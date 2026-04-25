"""
Pose Detection Module
Uses MediaPipe to detect and track body landmarks in real-time
"""

import cv2
import mediapipe as mp
import numpy as np


class PoseDetector:
    """
    Detects human pose using MediaPipe Pose solution
    Provides keypoint coordinates and visualization
    """
    
    def __init__(self, mode=False, complexity=1, smooth_landmarks=True,
                 detection_confidence=0.5, tracking_confidence=0.5):
        """
        Initialize the pose detector
        
        Args:
            mode: Static image mode (False for video)
            complexity: Model complexity (0, 1, or 2)
            smooth_landmarks: Smooth landmarks across frames
            detection_confidence: Minimum detection confidence
            tracking_confidence: Minimum tracking confidence
        """
        self.mode = mode
        self.complexity = complexity
        self.smooth_landmarks = smooth_landmarks
        self.detection_confidence = detection_confidence
        self.tracking_confidence = tracking_confidence
        
        # Initialize MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.mp_draw = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=self.mode,
            model_complexity=self.complexity,
            smooth_landmarks=self.smooth_landmarks,
            min_detection_confidence=self.detection_confidence,
            min_tracking_confidence=self.tracking_confidence
        )
        
    def find_pose(self, img, draw=True):
        """
        Detect pose in the image
        
        Args:
            img: Input image (BGR format)
            draw: Whether to draw landmarks on image
            
        Returns:
            img: Image with drawn landmarks (if draw=True)
            results: MediaPipe pose results
        """
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Process the image
        results = self.pose.process(img_rgb)
        
        # Draw landmarks if requested and detected
        if draw and results.pose_landmarks:
            self.mp_draw.draw_landmarks(
                img,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                self.mp_draw.DrawingSpec(color=(0, 0, 255), thickness=2)
            )
        
        return img, results
    
    def get_position(self, img, results, draw=True):
        """
        Extract landmark positions from pose results
        
        Args:
            img: Input image
            results: MediaPipe pose results
            draw: Whether to draw landmark IDs
            
        Returns:
            landmarks: List of landmarks [id, x, y, z]
        """
        landmarks = []
        
        if results.pose_landmarks:
            for id, lm in enumerate(results.pose_landmarks.landmark):
                h, w, c = img.shape
                # Convert normalized coordinates to pixel coordinates
                cx, cy = int(lm.x * w), int(lm.y * h)
                landmarks.append([id, cx, cy, lm.z, lm.visibility])
                
                # Draw circles on landmarks if requested
                if draw:
                    cv2.circle(img, (cx, cy), 5, (255, 0, 255), cv2.FILLED)
        
        return landmarks
    
    def calculate_angle(self, landmarks, p1, p2, p3):
        """
        Calculate angle between three points
        
        Args:
            landmarks: List of landmarks
            p1, p2, p3: Landmark IDs (p2 is the vertex)
            
        Returns:
            angle: Angle in degrees
        """
        if len(landmarks) == 0:
            return 0
        
        # Get coordinates of the three points
        try:
            x1, y1 = landmarks[p1][1], landmarks[p1][2]
            x2, y2 = landmarks[p2][1], landmarks[p2][2]
            x3, y3 = landmarks[p3][1], landmarks[p3][2]
            
            # Calculate angle using arctangent
            angle = np.degrees(
                np.arctan2(y3 - y2, x3 - x2) - 
                np.arctan2(y1 - y2, x1 - x2)
            )
            
            # Normalize angle to 0-180 range
            if angle < 0:
                angle += 360
            if angle > 180:
                angle = 360 - angle
                
            return angle
        except:
            return 0
    
    def close(self):
        """Release resources"""
        self.pose.close()
