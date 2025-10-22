// AI Fitness Trainer - Dashboard JavaScript

let currentTab = 'squat';

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const historyTbody = document.getElementById('history-tbody');

// Tab Switching
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTab = btn.dataset.exercise;
        loadExerciseStats(currentTab);
    });
});

// Load Overall Stats
async function loadOverallStats() {
    try {
        const response = await fetch('/api/progress?limit=100');
        const data = await response.json();
        
        if (data.total_stats) {
            document.getElementById('total-workouts-stat').textContent = data.total_stats.total_workouts;
            document.getElementById('total-reps-stat').textContent = data.total_stats.total_reps;
            
            const mins = Math.floor(data.total_stats.total_duration / 60);
            document.getElementById('total-duration-stat').textContent = `${mins} min`;
            
            document.getElementById('exercise-types-stat').textContent = data.total_stats.exercise_types;
        }
    } catch (error) {
        console.error('Error loading overall stats:', error);
    }
}

// Load Exercise Stats
async function loadExerciseStats(exercise) {
    try {
        const response = await fetch(`/api/exercise_stats/${exercise}`);
        const data = await response.json();
        
        if (data.stats) {
            document.getElementById('ex-sessions').textContent = data.stats.sessions;
            document.getElementById('ex-total-reps').textContent = data.stats.total_reps;
            document.getElementById('ex-avg-reps').textContent = data.stats.avg_reps;
            document.getElementById('ex-max-reps').textContent = data.stats.max_reps;
        }
        
        // Personal Best
        if (data.personal_best) {
            const pb = data.personal_best;
            const date = new Date(pb.timestamp).toLocaleDateString();
            const duration = Math.floor(pb.duration / 60);
            
            document.getElementById('pb-details').innerHTML = `
                <strong>${pb.repetitions} reps</strong> on ${date}<br>
                Duration: ${duration} minutes
            `;
        } else {
            document.getElementById('pb-details').textContent = 'No records yet. Start working out!';
        }
    } catch (error) {
        console.error('Error loading exercise stats:', error);
    }
}

// Load Workout History
async function loadWorkoutHistory() {
    try {
        const response = await fetch('/api/progress?limit=20');
        const data = await response.json();
        
        if (data.history && data.history.length > 0) {
            historyTbody.innerHTML = '';
            
            data.history.forEach(workout => {
                const row = document.createElement('tr');
                
                const date = new Date(workout.timestamp).toLocaleString();
                const duration = formatDuration(workout.duration);
                
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${capitalizeFirst(workout.exercise_type)}</td>
                    <td>${workout.repetitions}</td>
                    <td>${duration}</td>
                `;
                
                historyTbody.appendChild(row);
            });
        } else {
            historyTbody.innerHTML = '<tr><td colspan="4" class="no-data">No workout history yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading workout history:', error);
    }
}

// Helper Functions
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ');
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loaded');
    loadOverallStats();
    loadExerciseStats(currentTab);
    loadWorkoutHistory();
    
    // Auto-refresh every 30 seconds
    setInterval(() => {
        loadOverallStats();
        loadExerciseStats(currentTab);
        loadWorkoutHistory();
    }, 30000);
});
