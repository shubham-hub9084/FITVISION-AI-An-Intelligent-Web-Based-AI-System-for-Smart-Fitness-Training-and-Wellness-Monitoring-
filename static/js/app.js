// AI Fitness Trainer - Main Application JavaScript

let currentExercise = 'squat';
let sessionActive = false;
let statsInterval = null;

// DOM Elements
const exerciseButtons = document.querySelectorAll('.exercise-btn');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const repsCount = document.getElementById('reps-count');
const duration = document.getElementById('duration');
const stage = document.getElementById('stage');
const totalReps = document.getElementById('total-reps');
const totalWorkouts = document.getElementById('total-workouts');

// Exercise Selection
exerciseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!sessionActive) {
            exerciseButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentExercise = btn.dataset.exercise;
            console.log('Selected exercise:', currentExercise);
        }
    });
});

// Start Session
startBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exercise: currentExercise })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            sessionActive = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            resetBtn.disabled = false;
            
            // Disable exercise selection during session
            exerciseButtons.forEach(btn => btn.style.pointerEvents = 'none');
            
            // Start polling for stats
            startStatsPolling();
            
            showFeedback(`Started ${currentExercise} session!`, 'success');
        }
    } catch (error) {
        console.error('Error starting session:', error);
        showFeedback('Failed to start session', 'error');
    }
});

// Stop Session
stopBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/stop_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            sessionActive = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            resetBtn.disabled = true;
            
            // Re-enable exercise selection
            exerciseButtons.forEach(btn => btn.style.pointerEvents = 'auto');
            
            // Stop polling
            stopStatsPolling();
            
            // Show summary
            const stats = data.stats;
            showFeedback(
                `Session complete! ${stats.repetitions} reps in ${Math.floor(stats.duration / 60)}:${(stats.duration % 60).toString().padStart(2, '0')}`,
                'success'
            );
            
            // Update quick stats
            loadQuickStats();
        }
    } catch (error) {
        console.error('Error stopping session:', error);
        showFeedback('Failed to stop session', 'error');
    }
});

// Reset Counter
resetBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/reset_counter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            repsCount.textContent = '0';
            showFeedback('Counter reset', 'info');
        }
    } catch (error) {
        console.error('Error resetting counter:', error);
    }
});

// Stats Polling
function startStatsPolling() {
    statsInterval = setInterval(updateStats, 1000);
}

function stopStatsPolling() {
    if (statsInterval) {
        clearInterval(statsInterval);
        statsInterval = null;
    }
}

async function updateStats() {
    try {
        const response = await fetch('/api/current_stats');
        const data = await response.json();
        
        if (data.active) {
            repsCount.textContent = data.repetitions;
            stage.textContent = data.stage;
            
            const mins = Math.floor(data.duration / 60);
            const secs = data.duration % 60;
            duration.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Feedback Messages
function showFeedback(message, type = 'info') {
    const feedbackContainer = document.getElementById('feedback-messages');
    
    const feedbackMsg = document.createElement('p');
    feedbackMsg.className = `feedback-msg ${type}`;
    feedbackMsg.textContent = message;
    
    feedbackContainer.innerHTML = '';
    feedbackContainer.appendChild(feedbackMsg);
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
        if (feedbackContainer.contains(feedbackMsg)) {
            feedbackMsg.remove();
        }
    }, 5000);
}

// Load Quick Stats
async function loadQuickStats() {
    try {
        const response = await fetch('/api/progress?limit=100');
        const data = await response.json();
        
        if (data.total_stats) {
            totalReps.textContent = data.total_stats.total_reps;
            totalWorkouts.textContent = data.total_stats.total_workouts;
        }
    } catch (error) {
        console.error('Error loading quick stats:', error);
    }
}

// Format Duration
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('AI Fitness Trainer loaded');
    loadQuickStats();
    
    // Set initial feedback
    showFeedback('Select an exercise and press START to begin', 'info');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (sessionActive) {
        stopStatsPolling();
    }
});
