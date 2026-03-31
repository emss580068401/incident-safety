/**
 * Tactical Audio Engine - Web Audio API
 * Provides low-latency beep feedback for UI interactions.
 */
class TacticalAudio {
    constructor() {
        this.ctx = null;
        this.enabled = false;
    }

    init() {
        if (this.enabled) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.enabled = true;
            console.log("[TACTICAL AUDIO]: Initialized");
        } catch (e) {
            console.error("AudioContext not supported", e);
        }
    }

    playBeep(frequency = 880, duration = 0.05, type = 'sine', volume = 0.1) {
        if (!this.enabled || !this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    // Specialized beeps
    playSelect() { this.playBeep(1200, 0.04, 'sine', 0.08); }
    playHover() { this.playBeep(800, 0.02, 'square', 0.02); }
    playSuccess() {
        this.playBeep(880, 0.1, 'sine', 0.1);
        setTimeout(() => this.playBeep(1100, 0.2, 'sine', 0.1), 100);
    }
    playAlert() {
        this.playBeep(440, 0.1, 'sawtooth', 0.1);
        setTimeout(() => this.playBeep(440, 0.1, 'sawtooth', 0.1), 200);
    }
}

const audioEngine = new TacticalAudio();

// Hook into DOM
document.addEventListener('DOMContentLoaded', () => {
    // Add hover sound to all buttons and cards
    const tacticalElements = document.querySelectorAll('.btn, .portal-card, .menu-item, a');
    tacticalElements.forEach(el => {
        el.addEventListener('mouseenter', () => audioEngine.playHover());
    });

    // Initialize on first click (browser policy)
    document.addEventListener('click', () => audioEngine.init(), { once: true });
});
