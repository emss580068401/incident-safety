/* ============================================================
   FIRE SAFETY PORTAL - Interactive Effects Engine v2.0
   ============================================================ */

/* --- 1. 3D Tilt Effect (Mouse Tracking) --- */
function initTilt3D() {
    const tiltTargets = document.querySelectorAll('[data-tilt]');
    
    tiltTargets.forEach(el => {
        const maxTilt = parseFloat(el.dataset.tiltMax) || 12;
        const glare   = el.dataset.tiltGlare !== 'false';
        
        // Inject glare layer
        if (glare && !el.querySelector('.tilt-glare')) {
            const glareEl = document.createElement('div');
            glareEl.classList.add('tilt-glare');
            el.style.position = 'relative';
            el.style.overflow = 'hidden';
            el.appendChild(glareEl);
        }
        
        el.addEventListener('mousemove', e => {
            const rect   = el.getBoundingClientRect();
            const centerX = rect.left + rect.width  / 2;
            const centerY = rect.top  + rect.height / 2;
            const dx = (e.clientX - centerX) / (rect.width  / 2);
            const dy = (e.clientY - centerY) / (rect.height / 2);
            
            const rotX = (-dy * maxTilt).toFixed(2);
            const rotY = ( dx * maxTilt).toFixed(2);
            
            el.style.transform = `
                perspective(1000px)
                rotateX(${rotX}deg)
                rotateY(${rotY}deg)
                scale3d(1.04, 1.04, 1.04)
            `;
            el.style.transition = 'transform 0.1s ease';
            
            // Glare effect
            const glareEl = el.querySelector('.tilt-glare');
            if (glareEl) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
                const opacity = Math.min((Math.abs(dx) + Math.abs(dy)) / 2, 0.25);
                glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${opacity}) 0%, rgba(255,255,255,0) 60%)`;
            }
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
            const glareEl = el.querySelector('.tilt-glare');
            if (glareEl) glareEl.style.background = 'transparent';
        });
    });
}

/* --- 2. Floating Embers (Canvas Particle System) --- */
function initEmbers(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const COUNT = 60;
    
    class Ember {
        constructor() { this.reset(); }
        reset() {
            this.x    = Math.random() * canvas.width;
            this.y    = canvas.height + Math.random() * 60;
            this.size = Math.random() * 3.5 + 0.5;
            this.speedY = -(Math.random() * 1.2 + 0.4);
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.alpha  = Math.random() * 0.8 + 0.2;
            this.hue    = Math.random() * 40 + 15; // 15-55 orangey range
            this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
            this.wobble += 0.04;
            this.x += this.speedX + Math.sin(this.wobble) * 0.4;
            this.y += this.speedY;
            this.alpha -= 0.004;
            if (this.alpha <= 0 || this.y < -20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.shadowBlur  = 10;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
            ctx.fillStyle   = `hsl(${this.hue}, 100%, 65%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    for (let i = 0; i < COUNT; i++) {
        const e = new Ember();
        // Scatter Y so they don't all start from bottom at once
        e.y = Math.random() * canvas.height;
        e.alpha = Math.random() * 0.5 + 0.1;
        particles.push(e);
    }
    
    function animLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animLoop);
    }
    animLoop();
}

/* --- 3. Screen Flash Effect --- */
function flashScreen(color = 'rgba(16, 185, 129, 0.25)', duration = 600) {
    const overlay = document.getElementById('screen-flash') || (() => {
        const el = document.createElement('div');
        el.id = 'screen-flash';
        el.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            pointer-events: none; opacity: 0;
            transition: opacity 0.1s ease;
        `;
        document.body.appendChild(el);
        return el;
    })();
    
    overlay.style.background = color;
    overlay.style.opacity    = '1';
    setTimeout(() => { overlay.style.opacity = '0'; }, duration * 0.3);
}

/* --- 4. Screen Shake Effect --- */
function shakeScreen(intensity = 8, totalDuration = 500) {
    const body = document.body;
    const start = performance.now();
    
    function doShake(now) {
        const elapsed = now - start;
        if (elapsed >= totalDuration) {
            body.style.transform = '';
            return;
        }
        const decay = 1 - elapsed / totalDuration;
        const dx = (Math.random() - 0.5) * intensity * 2 * decay;
        const dy = (Math.random() - 0.5) * intensity * 2 * decay;
        body.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(doShake);
    }
    requestAnimationFrame(doShake);
}

/* --- 5. Danger Ring Pulse (border flash) --- */
function dangerPulse(element, color = '#ef4444') {
    element.style.boxShadow = `0 0 0 0 ${color}`;
    element.style.animation = 'none';
    element.offsetHeight; // reflow
    element.style.animation = 'dangerRing 0.6s ease-out';
    
    const style = document.getElementById('danger-ring-style') || (() => {
        const s = document.createElement('style');
        s.id = 'danger-ring-style';
        s.textContent = `
            @keyframes dangerRing {
                0%   { box-shadow: 0 0 0 0 ${color}88; }
                70%  { box-shadow: 0 0 0 20px transparent; }
                100% { box-shadow: 0 0 0 0 transparent; }
            }
        `;
        document.head.appendChild(s);
        return s;
    })();
}

/* --- 6. Correct Answer: Score Burst Particle --- */
function correctBurst(targetEl) {
    if (!targetEl) return;
    const rect   = targetEl.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2 + window.scrollX;
    const cy     = rect.top  + rect.height / 2 + window.scrollY;
    const colors = ['#10b981', '#34d399', '#6ee7b7', '#facc15', '#ffffff'];
    
    for (let i = 0; i < 24; i++) {
        const dot = document.createElement('span');
        const angle  = (i / 24) * 360;
        const dist   = 60 + Math.random() * 50;
        const size   = 6 + Math.random() * 6;
        const color  = colors[Math.floor(Math.random() * colors.length)];
        
        dot.style.cssText = `
            position: absolute;
            left: ${cx}px; top: ${cy}px;
            width:  ${size}px; height: ${size}px;
            border-radius: 50%;
            background: ${color};
            box-shadow: 0 0 6px ${color};
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            animation: burst-dot 0.7s ease-out forwards;
            --bx: ${Math.cos(angle * Math.PI / 180) * dist}px;
            --by: ${Math.sin(angle * Math.PI / 180) * dist}px;
        `;
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 800);
    }
    
    // Inject burst keyframe once
    if (!document.getElementById('burst-style')) {
        const s = document.createElement('style');
        s.id = 'burst-style';
        s.textContent = `
            @keyframes burst-dot {
                0%   { opacity:1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
                100% { opacity:0; transform: translate(-50%,-50%) translate(var(--bx), var(--by)) scale(0); }
            }
        `;
        document.head.appendChild(s);
    }
}

/* --- Glare CSS injection --- */
(function injectEffectStyles() {
    if (document.getElementById('effects-base-style')) return;
    const s = document.createElement('style');
    s.id = 'effects-base-style';
    s.textContent = `
        .tilt-glare {
            position: absolute; inset: 0;
            border-radius: inherit;
            pointer-events: none;
            z-index: 10;
            transition: background 0.15s ease;
        }
        [data-tilt] { transform-style: preserve-3d; will-change: transform; }

        /* Embers canvas */
        .embers-canvas {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 0;
        }
    `;
    document.head.appendChild(s);
})();

/* --- Auto-init on DOMContentLoaded --- */
document.addEventListener('DOMContentLoaded', () => {
    initTilt3D();
    // Embers are inited per-page via page-specific calls
});
