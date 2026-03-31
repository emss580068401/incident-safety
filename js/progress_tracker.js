/**
 * Training Progress Tracker - localStorage
 * Records module completions and quiz scores.
 */
class ProgressTracker {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('incident_training_progress')) || {
            modules: {
                training: false,
                rights: false,
                investigation: false,
                experience: false
            },
            quizzes: []
        };
    }

    save() {
        localStorage.setItem('incident_training_progress', JSON.stringify(this.data));
        this.updateDashboard();
    }

    completeModule(moduleId) {
        if (this.data.modules.hasOwnProperty(moduleId)) {
            this.data.modules[moduleId] = true;
            this.save();
        }
    }

    addQuizResult(score, total) {
        this.data.quizzes.push({
            score: score,
            total: total,
            date: new Date().toISOString()
        });
        this.save();
    }

    getProgress() {
        const completed = Object.values(this.data.modules).filter(v => v).length;
        const total = Object.keys(this.data.modules).length;
        return {
            completed: completed,
            total: total,
            percentage: Math.round((completed / total) * 100)
        };
    }

    updateDashboard() {
        const dashboard = document.getElementById('progress-dashboard');
        if (!dashboard) return;

        const progress = this.getProgress();
        dashboard.innerHTML = `
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-value">${progress.completed}/${progress.total}</span>
                    <span class="stat-label">已完成模組</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${progress.percentage}%</span>
                    <span class="stat-label">訓練進度</span>
                </div>
            </div>
            <div class="progress-bar-container" style="height: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; margin-top: 1rem; overflow: hidden;">
                <div class="progress-fill" style="width: ${progress.percentage}%; height: 100%; background: var(--gradient-blue); transition: width 1s ease;"></div>
            </div>
        `;
    }
}

const tracker = new ProgressTracker();

// Auto-record completion based on page URL
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('training.html')) tracker.completeModule('training');
    if (path.includes('rights.html')) tracker.completeModule('rights');
    if (path.includes('investigation.html')) tracker.completeModule('investigation');
    if (path.includes('experience.html')) tracker.completeModule('experience');

    // Update dashboard if exists
    tracker.updateDashboard();
});
