/**
 * Tactical Audio Engine v4.0 - Advanced Tactical Synthesis
 * 整合：MasterGain 控制、雙音調疊加、Attack 攻擊感優化、參數錯誤修正。
 */
class TacticalAudio {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.enabled = false;
        this.lastTriggerTime = 0;
        this.cooldown = 45; // 觸發冷卻 (ms)
    }

    init() {
        if (this.enabled) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // 全域音量控制 (Master Gain)
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            this.enabled = true;
            console.log("[TACTICAL AUDIO v4.0]: System Ready - Master Gain Linked");
            this.playSuccess();
        } catch (e) {
            console.warn("AudioContext failed", e);
        }
    }

    /**
     * 高級數位合成 (Digital Layering)
     */
    synth(freq, duration, volume = 0.05, type = 'sine', pan = 0) {
        if (!this.enabled || !this.ctx) return;
        
        const now = this.ctx.currentTime;
        let panner = null;
        if (this.ctx.createStereoPanner) {
            panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(pan, now);
            panner.connect(this.masterGain);
        }

        const createTone = (f, v, t) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            // 加入輕微頻率隨機化 (±10Hz) 增加真實感
            const detune = (Math.random() - 0.5) * 20;
            
            osc.type = t;
            osc.frequency.setValueAtTime(f + detune, now);
            
            // 增加 Attack 攻擊感 (8ms)
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(v, now + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            if (panner) {
                gain.connect(panner);
            } else {
                gain.connect(this.masterGain);
            }
            return osc;
        };

        const tone1 = createTone(freq, volume, type);
        const tone2 = createTone(freq * 1.5, volume * 0.3, 'sine'); // 諧波

        tone1.start(now);
        tone2.start(now);
        // 多 0.1s buffer 避免切斷
        tone1.stop(now + duration + 0.1);
        tone2.stop(now + duration + 0.1);
    }

    // --- 優化後的音效配置 (Sound Profiles) ---
    
    playHover() { 
        const now = Date.now();
        if (now - this.lastTriggerTime < this.cooldown) return;
        this.lastTriggerTime = now;
        this.synth(1100, 0.025, 0.03, 'sine', -0.1); 
    }

    playSelect() { 
        this.synth(1350, 0.04, 0.06, 'sine', 0);
        setTimeout(() => this.synth(950, 0.02, 0.04, 'sine', 0.2), 15);
    }

    playSuccess() {
        const notes = [660, 880, 1320];
        notes.forEach((f, i) => {
            setTimeout(() => this.synth(f, 0.1, 0.05, 'sine', (i-1)*0.2), i * 70);
        });
    }

    // 警告/錯誤：修正參數誤植 Bug，並增加左右立體偏移
    playAlert() {
        this.synth(440, 0.15, 0.05, 'sawtooth', -0.3);
        setTimeout(() => this.synth(320, 0.2, 0.04, 'sawtooth', 0.3), 100);
    }
    /**
     * 動態調整全局音量
     */
    setMasterVolume(volume = 0.75) {
        if (this.masterGain && this.ctx) {
            const v = Math.max(0, Math.min(1, volume));
            this.masterGain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
            console.log(`[TACTICAL AUDIO]: Master Volume set to ${v}`);
        }
    }
}

const audioEngine = new TacticalAudio();

// 全站自動化整合 (Event Delegation 版本)
document.addEventListener('DOMContentLoaded', () => {
    // 定義所有需要觸發音效的選擇器或條件
    const isTactical = (el) => {
        if (!el || el.nodeType !== 1) return false;
        
        // --- 效能最快路徑：優先檢查明確標記 ---
        if (el.hasAttribute('data-tactical') || 
            (el.dataset && el.dataset.tacticalAudio === 'true')) return true;

        // 核心選擇器清單
        const selectors = [
            'a', 'button', '.btn', '.portal-card', '.menu-item', 
            '.launch-btn', '.video-card', '.podcast-item', 
            '.option-btn', '.feature-item', '[onclick]', '[role="button"]'
        ];
        
        // 檢查元素本身或其父層是否匹配 (最多向上查找 3 層)
        let current = el;
        for (let i = 0; i < 3 && current && current !== document.body; i++) {
            if (selectors.some(s => current.matches(s))) return true;
            
            // 只有在必要時才觸發成本較高的 getComputedStyle
            if (current.tagName === 'A' || current.tagName === 'BUTTON') return true;
            if (window.getComputedStyle(current).cursor === 'pointer') return true;
            
            current = current.parentElement;
        }
        return false;
    };

    /**
     * 1. 鼠標經過音效 (mouseover) - 使用事件委派處理所有動態元素
     */
    document.addEventListener('mouseover', (e) => {
        const target = e.target;
        if (isTactical(target)) {
            // 防止在同一個元素內移動時重複觸發
            const related = e.relatedTarget;
            if (related && (target === related || target.contains(related))) return;
            
            audioEngine.playHover();
        }
    }, { passive: true });

    /**
     * 2. 點擊音效 (mousedown)
     */
    document.addEventListener('mousedown', (e) => {
        if (isTactical(e.target)) {
            audioEngine.playSelect();
        }
    }, { passive: true });

    /**
     * 3. 瀏覽器互動策略解鎖
     */
    const unlock = () => {
        audioEngine.init();
        ['mousedown', 'keydown', 'touchstart', 'wheel'].forEach(evt => {
            document.removeEventListener(evt, unlock);
        });
    };

    ['mousedown', 'keydown', 'touchstart', 'wheel'].forEach(evt => {
        document.addEventListener(evt, unlock, { once: true, passive: true });
    });
});
