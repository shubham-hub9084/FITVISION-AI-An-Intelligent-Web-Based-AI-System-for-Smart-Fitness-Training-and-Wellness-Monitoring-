class CoachingEngine:
    """
    Advanced AI Coaching Engine
    Aggregates session data and generates professional performance reports.
    """
    def __init__(self):
        self.session_errors = []
        self.total_reps = 0
        self.exercise_type = None
        self.start_time = None
        
    def start_session(self, exercise_type):
        self.exercise_type = exercise_type
        self.session_errors = []
        self.total_reps = 0
        
    def log_rep(self):
        self.total_reps += 1
        
    def log_feedback(self, feedback_list):
        """
        Log feedback messages to track common errors.
        Only logs '⚠️' warnings.
        """
        for msg in feedback_list:
            if "⚠️" in msg:
                self.session_errors.append(msg)

    def generate_report(self):
        """
        Generate a professional coaching summary of the session.
        """
        if self.total_reps == 0:
            return {
                "score": 0,
                "summary": "No reps completed. Let's try again!",
                "tips": ["Consistency is key. Start with just 1 rep."]
            }

        # Calculate Score
        # Simple algorithm: 100 - (errors / reps * weight)
        # Cap errors per rep at 1.
        error_count = len(set(self.session_errors))
        # Heuristic: 1 error per rep = 50% score? 
        # let's say score = 100 - (errors * 5). Min 0.
        raw_score = 100 - (error_count * 2) 
        # Provide buffer for reps. If 10 reps and 2 errors -> 96.
        # If 10 reps and 10 errors -> 80.
        score = max(0, min(100, raw_score))
        
        # Identify most common error
        from collections import Counter
        if self.session_errors:
            common_errors = Counter(self.session_errors).most_common(2)
            main_issue = common_errors[0][0].replace("⚠️ ", "")
        else:
            main_issue = None

        # Generate Narrative
        summary = f"Good effort on your {self.exercise_type}s! "
        if score > 90:
            summary += "Your form was excellent with very minor adjustments needed."
        elif score > 75:
            summary += "Solid performance, but watch out for form breakdowns as you fatigue."
        else:
            summary += "Focus on quality over quantity. Let's clean up the technique."

        # Generate Tips
        tips = []
        if main_issue:
            tips.append(f"Primary Focus: {main_issue}. Fix this to instantly improve.")
            
        if self.exercise_type == "squat":
             tips.append("Remember: Hips back, chest up, knees out.")
        elif self.exercise_type == "pushup":
             tips.append("Keep your core tight like a plank throughout the movement.")
        elif self.exercise_type == "curl":
             tips.append("Control the eccentric (lowering) phase for max growth.")

        return {
            "score": score,
            "summary": summary,
            "tips": tips,
            "total_reps": self.total_reps,
            "error_count": error_count
        }
