/**
 * 災害事故調查與角色定位 - 互動網頁腳本
 * 負責捲動特效、標籤切換與導覽列互動
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. 導覽列捲動變色特效 (Sticky Navbar)
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. 捲動浮現動畫 (Scroll Reveal via Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');
    
    const revealOptions = {
        threshold: 0.15, // 當元素 15% 進入可視範圍時觸發
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            // 加上 active class 啟動 CSS 動畫
            entry.target.classList.add('active');
            
            // 觸發後即停止觀察，優化效能
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // 3. 案例借鏡區塊 (Tabs) 切換邏輯
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按鈕的 active 狀態
            tabBtns.forEach(b => b.classList.remove('active'));
            // 隱藏所有內容
            tabContents.forEach(content => content.classList.remove('active'));

            // 啟動當前點選的按鈕
            btn.classList.add('active');
            
            // 顯示對應的內容
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 4. 平滑捲動 (Smooth Scroll) 修復偏移
    const navLinks = document.querySelectorAll('.nav-links a, .hero-cta a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if(!targetId || !targetId.startsWith('#')) return; // 只處理同頁面錨點連結
            
            e.preventDefault();
            if(targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if(targetSection) {
                // 考量導覽列高度造成的偏移
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. 互動標籤 Modal 視窗邏輯
    const interactiveTags = document.querySelectorAll('.tag.interactive');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    if (modalOverlay) {
        // 開啟 Modal
        interactiveTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const targetId = tag.getAttribute('data-modal');
                const modal = document.getElementById(targetId);
                if (modal) {
                    modalOverlay.classList.add('active');
                    modal.classList.add('active');
                }
            });
        });

        // 關閉 Modal (按關閉按鈕)
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-container');
                if (modal) {
                    modal.classList.remove('active');
                    modalOverlay.classList.remove('active');
                }
            });
        });

        // 關閉 Modal (點擊背景)
        modalOverlay.addEventListener('click', () => {
            const activeModals = document.querySelectorAll('.modal-container.active');
            activeModals.forEach(m => m.classList.remove('active'));
            modalOverlay.classList.remove('active');
        });
    }

    // 6. 沈浸式音訊系統 (背景音樂與點擊音效)
    let audioCtx = null;
    let bgmAudio = new Audio('audio/The_High_Pass.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5;

    // 預設開啟設定
    if (sessionStorage.getItem('bgm_playing') === null) {
        sessionStorage.setItem('bgm_playing', 'true');
    }

    function initAudio() {
        if(!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if(audioCtx.state === 'suspended') audioCtx.resume();
    }

    // 點擊音效 (UI 提示音)
    function playClickSfx() {
        if(!audioCtx) initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
        
        // Add a second, higher "tick" for a digital feel
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(2500, audioCtx.currentTime);
        gain2.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.04);
    }

    // 控制邏輯
    function startBGM() {
        initAudio();
        bgmAudio.play().catch(e => console.log("Autoplay blocked, waiting for interaction"));
        
        sessionStorage.setItem('bgm_playing', 'true');
        const btn = document.getElementById('audio-toggle');
        if(btn) btn.classList.add('playing');
        const icon = document.querySelector('#audio-toggle .icon');
        if(icon) icon.textContent = '🔊';
    }

    function stopBGM() {
        bgmAudio.pause();
        sessionStorage.setItem('bgm_playing', 'false');
        const btn = document.getElementById('audio-toggle');
        if(btn) btn.classList.remove('playing');
        const icon = document.querySelector('#audio-toggle .icon');
        if(icon) icon.textContent = '🔇';
    }

    // 建立 UI 控制按鈕
    const audioWrapper = document.createElement('div');
    const isPlaying = sessionStorage.getItem('bgm_playing') === 'true';
    audioWrapper.innerHTML = `<button id="audio-toggle" class="audio-btn ${isPlaying ? 'playing' : ''}" title="切換背景音樂">
        <span class="icon">${isPlaying ? '🔊' : '🔇'}</span>
    </button>`;
    document.body.appendChild(audioWrapper);

    document.getElementById('audio-toggle').addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSfx();
        if (!bgmAudio.paused) stopBGM(); else startBGM();
    });

    // 系統初始化引導視窗控制
    const startBtn = document.getElementById('start-system-btn');
    const welcomeOverlay = document.getElementById('welcome-overlay');

    if (startBtn && welcomeOverlay) {
        // 如果已經在同一會話中初始化過，則直接移除
        if (sessionStorage.getItem('system_initialized') === 'true') {
            welcomeOverlay.style.display = 'none';
        }

        startBtn.addEventListener('click', () => {
            sessionStorage.setItem('system_initialized', 'true');
            welcomeOverlay.classList.add('fade-out');
            
            // 觸發音訊系統
            initAudio();
            startBGM();
            
            // 延時後徹底移除 DOM 以免擋住點擊
            setTimeout(() => {
                welcomeOverlay.style.display = 'none';
            }, 800);
        });
    }

    let firstX = true;
    const triggerAudio = () => {
        if(firstX) {
            initAudio();
            if(sessionStorage.getItem('bgm_playing') === 'true') {
                startBGM();
            }
            // 如果視窗還在，也讓它消失 (保險起見)
            if (welcomeOverlay) welcomeOverlay.classList.add('fade-out');
            firstX = false;
        }
    };

    document.addEventListener('click', triggerAudio);
    document.addEventListener('touchstart', triggerAudio); // 增加手機端觸發支援

    // 全局行動端選單控制 (漢堡按鈕)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && mobileNavLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            mobileNavLinks.classList.toggle('active');
            
            // 防止背景捲動
            if (mobileNavLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 點擊選單連結後自動關閉 (適用於單頁或換頁)
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNavLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // 點擊外部關閉
        document.addEventListener('click', (e) => {
            if (mobileNavLinks && mobileNavLinks.classList.contains('active') && !mobileNavLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                mobileNavLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // 全域互動音效
    document.addEventListener('mousedown', (e) => {
        // As requested by user: any interaction should have sound
        // We exclude the audio-toggle to prevent double sound on that specific button handler if it calls it too
        if(e.target.id !== 'audio-toggle') {
            playClickSfx();
        }
    });

});
