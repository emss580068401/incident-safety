/**
 * 情境體驗遊戲邏輯 - 風險辨識挑戰與關鍵決策模擬
 * v2.0 - 新增台灣在地化風險場景與決策 Mission 2
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 共用邏輯 ---

    // --- 風險辨識挑戰 (Hazard Spotter) ---
    const spotterScenes = [
        {
            name: "化工廠內部火警",
            image: "images/hazard_factory.png",
            hazards: [
                { x: 67, y: 75, w: 12, h: 18, msg: "❌ 未標示化學品！依消防法21-1，應提供配置圖及化學品名稱。" },
                { x: 88, y: 35, w: 10, h: 25, msg: "❌ 危害辨識卡(H-Card)未揭示！指揮官將無法獲取關鍵危害資訊。" },
                { x: 10, y: 30, w: 12, h: 25, msg: "❌ 緊急出口阻塞！違反建築物公共安全，且危及消防員退離動線。" },
                { x: 45, y: 65, w: 18, h: 22, msg: "❌ 設備未固定/PPE缺失！現場雜亂且人員未配戴完整SCBA面罩進入熱區。" }
            ]
        },
        {
            name: "火場搜救中繼區",
            image: "images/hazard_staging.png",
            hazards: [
                { x: 5, y: 15, w: 42, h: 58, msg: "❌ 未部署 RIT 小組！消防車（E-41）旁缺乏緊急搜救小組待命，且現場隊員分散，若前方發生 MAYDAY 將無人能即時應援。" },
                { x: 18, y: 52, w: 58, h: 28, msg: "❌ 缺少補水與恢復站！隊員坐在地上休息（REHAB），但周邊無充足飲水進行熱衰竭預防，ISO 應提醒建立恢復區。" },
                { x: 46, y: 40, w: 25, h: 22, msg: "❌ 指揮看板資訊不全！白板上未確實紀錄入室小組的人員管制(Accountability)，極易造成空間迷失且指揮官無法掌握人員進度。" }
            ]
        },
        {
            name: "頂樓違建鐵皮工廠",
            image: "images/hazard_rooftop.png",
            hazards: [
                { x: 38, y: 15, w: 45, h: 20, msg: "❌ 鐵皮屋頂塌陷預兆！屋頂大幅度彎曲(Bowing)，且煙霧呈脈動式噴出，隨時有崩塌風險。" },
                { x: 52, y: 75, w: 25, h: 22, msg: "❌ 側向逃生口阻塞！地面堆放大量木製棧板與雜物，阻礙緊急退離動線與水源佈署。" },
                { x: 88, y: 45, w: 10, h: 45, msg: "❌ 資訊權落實缺失！違建內部空間複雜且改建頻繁，屋主未在場提供平面圖，ISO 應暫緩人員入室。" }
            ]
        },
        {
            name: "殘火處理 - PPE紀律",
            image: "images/hazard_ppe.png",
            hazards: [
                { x: 45, y: 32, w: 15, h: 25, msg: "❌ 脫下面罩呼吸！殘火處理階段仍有高濃度 CO 與氰化氫，必須持續配戴面罩。" },
                { x: 72, y: 45, w: 12, h: 22, msg: "❌ 器具操作不當！現場燈光昏暗，操作破壞器材時應有監視員或穩定重心。" },
                { x: 30, y: 78, w: 30, h: 15, msg: "❌ 地面絆倒風險！混亂的水線與建築殘骸散落，危及受困人員與隊員退避。" }
            ]
        },
        {
            name: "狹窄巷弄中繼供水",
            image: "images/hazard_alley.png",
            hazards: [
                { x: 55, y: 35, w: 30, h: 50, msg: "❌ 消防車遭違停機車阻擋！巷弄狹小導致第二面攻堅與救援空間受限，亦影響殘火處理動線。" },
                { x: 82, y: 65, w: 15, h: 32, msg: "❌ 消防栓遭騎壓！機車停放於水源設施旁，嚴重延誤建立中繼水源之速度。" },
                { x: 20, y: 3, w: 55, h: 22, msg: "❌ 架空電線電弧風險！火勢波及上方雜亂電線，ISO 應提醒射水人員注意「感電」風險。" }
            ]
        }
    ];

    let currentSceneIndex = 0;
    let foundInCurrentScene = 0;

    const gameCanvas = document.getElementById('game-canvas');
    const foundCountDisp = document.getElementById('found-count');
    const totalCountDisp = document.getElementById('total-count');
    const sceneNameDisp = document.getElementById('scene-name');
    const gameImage = document.getElementById('game-image');

    function loadSpotterScene(index) {
        const scene = spotterScenes[index];
        gameImage.src = scene.image;
        sceneNameDisp.innerText = scene.name;
        foundInCurrentScene = 0;
        updateHud();

        // 清除舊熱點與側邊欄紀錄
        const oldHotspots = document.querySelectorAll('.hotspot');
        oldHotspots.forEach(h => h.remove());
        
        const sidebarLog = document.getElementById('sidebar-log');
        if (sidebarLog) {
            sidebarLog.innerHTML = '<div class="empty-log">[ 系統就緒 ] 請掃描右側影像以查找潛在風險...</div>';
        }

        // 注入新熱點
        scene.hazards.forEach((h, i) => {
            const div = document.createElement('div');
            div.className = 'hotspot';
            div.style.left = h.x + '%';
            div.style.top = h.y + '%';
            div.style.width = h.w + '%';
            div.style.height = h.h + '%';
            div.addEventListener('click', () => findHazard(div, h.msg));
            gameCanvas.appendChild(div);
        });
        
        totalCountDisp.innerText = scene.hazards.length;
    }

    // --- 數位音效引擎 (Web Audio API) ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playTacticalSound(type) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        if (type === 'find') {
            // 辨識成功的短促電腦音
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'clear') {
            // 場景全數找出的成功音效 (上升和弦)
            const now = audioCtx.currentTime;
            [440, 554.37, 659.25, 880].forEach((freq, i) => {
                const osc = audioCtx.createOscillator();
                const g = audioCtx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now + i * 0.1);
                g.connect(audioCtx.destination);
                osc.connect(g);
                g.gain.setValueAtTime(0.05, now + i * 0.1);
                g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.3);
            });
        }
    }

    function findHazard(el, msg) {
        const isFirstFind = !el.classList.contains('found');
        
        if (isFirstFind) {
            el.classList.add('found');
            foundInCurrentScene++;
            updateHud();
            
            // 點擊音效
            playTacticalSound('find');
            
            // 更新側邊欄 (Updated to use sidebar log)
            updateSidebarLog(msg);
            
            const currentScene = spotterScenes[currentSceneIndex];
            if (foundInCurrentScene === currentScene.hazards.length) {
                setTimeout(() => {
                    playTacticalSound('clear');
                    updateSidebarLog("🏆 任務成功：您已成功識別此場景所有安全威脅。");
                }, 1000);
            }
        } else {
            // 已找到過的標示為高亮但不再重複加入 Log (或者可以重複加入)
            updateSidebarLog(msg);
        }
    }

    function updateSidebarLog(msg) {
        const sidebarLog = document.getElementById('sidebar-log');
        if (!sidebarLog) return;

        // 移除先前的 empty-log
        const empty = sidebarLog.querySelector('.empty-log');
        if (empty) empty.remove();

        // 移除所有目前的 newest 高亮
        document.querySelectorAll('.log-entry').forEach(e => e.classList.remove('newest'));

        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0') + ':' + 
                        now.getSeconds().toString().padStart(2, '0');

        const entry = document.createElement('div');
        entry.className = 'log-entry newest';
        entry.innerHTML = `
            <span class="log-time">[${timeStr}] ALERT</span>
            <div class="log-text">${msg}</div>
        `;

        sidebarLog.prepend(entry); // 最新的放在最上面
    }

    function updateHud() {
        foundCountDisp.innerText = foundInCurrentScene;
    }

    // --- 全域切換場景指令 ---
    window.nextScene = function() {
        currentSceneIndex++;
        if (currentSceneIndex >= spotterScenes.length) {
            currentSceneIndex = 0;
        }
        loadSpotterScene(currentSceneIndex);
        playTacticalSound('find'); // 切換音效
    };

    // --- 關鍵決策模擬 (Decision Matrix) ---
    const decisionData = {
        mission1: {
            title: "Mission 1：化工廠噩夢 (H-Card 運用)",
            steps: [
                {
                    id: "m1-s1",
                    text: "工廠內部發生火警，報案人稱存放有大量不明化學品。ISO 到場後首要動作是？",
                    thermal: 10, toxic: 40,
                    options: [
                        { text: "立刻帶隊入室搶救人員", next: "m1-fail-rush" },
                        { text: "向屋主索取 H-Card 與配置圖", next: "m1-s2" },
                        { text: "建立水線進行外部防護", next: "m1-fail-passive" }
                    ]
                },
                {
                    id: "m1-s2",
                    text: "獲取 H-Card 顯示該處存放『甲苯』與『過氧化物』。火勢已延燒至化學倉，應採取？",
                    thermal: 60, toxic: 80,
                    options: [
                        { text: "使用大量水進行冷卻射水", next: "m1-fail-reaction" },
                        { text: "預警可能爆炸，撤離室內噴灑防護", next: "m1-win" }
                    ]
                }
            ],
            results: {
                "m1-fail-rush": { title: "❌ 決策失敗", desc: "盲目入室！未經危害辨識即進入熱區，造成多名消防員觸及化學毒氣受傷。", legal: "《消防機關救災安全手冊》第參章：ISO 應督導於化學救災前確實執行 H-Card 危害辨識。" },
                "m1-fail-reaction": { title: "❌ 決策失敗", desc: "化學反應！過氧化物遇水可能引發劇烈反應，現場發生二次爆炸。", legal: "《消防救災標準作業程序》：化學災害應優先確認物質特性，嚴禁貿然供水。" },
                "m1-win": { title: "🏅 任務成功", desc: "正確識別風險！及時撤出人員避免了爆炸傷亡，並有效執行防護動線。", legal: "《消防法》第 21-1 條：資訊權之落實。ISO 成功確保現場救災人員之安全優先權。" }
            }
        },
        mission2: {
            title: "Mission 2：違建頂加考驗 (結構風險)",
            steps: [
                {
                    id: "m2-s1",
                    text: "頂樓鐵皮加蓋起火，已有明顯鐵皮受熱變形(Bowing)。現場入室後發現內部雜物堆置嚴重，此時 ISO 應？",
                    thermal: 80, toxic: 60,
                    options: [
                        { text: "回報指揮官，要求室內人員全數撤出", next: "m2-s2" },
                        { text: "調整水線位置，嘗試冷卻屋頂鐵件", next: "m2-fail-collapse" }
                    ]
                },
                {
                    id: "m2-s2",
                    text: "撤出指令下達後，仍有一小組回報受困於雜物堆後方，此時 ISO 應啟動？",
                    thermal: 90, toxic: 95,
                    options: [
                        { text: "命令其他入室人員回頭支援搜索", next: "m2-fail-double" },
                        { text: "啟動 EVA 撤退警報並指派 RIT 小組進入", next: "m2-win" }
                    ]
                }
            ],
            results: {
                "m2-fail-collapse": { title: "❌ 決策失敗", desc: "結構坍塌！鐵皮受損後承載力快速丧失，人員遭埋壓傷亡。", legal: "《消防機關救災安全手冊》：鐵皮建築受熱變形時，即為高度坍塌警訊，ISO 應下令撤離。" },
                "m2-win": { title: "🏅 任務成功", desc: "精準評估！撤退指令及時避免了全面坍塌造成的集體傷亡，RIT 小組成功救出受困弟兄。", legal: "《消防機關救災安全手冊》第伍章：結構安全評估。ISO 展現了對於『撤離權』的果斷執行。" }
            }
        },
        mission3: {
            title: "Mission 3：地下室火警 (閃燃預兆)",
            steps: [
                {
                    id: "m3-s1",
                    text: "地下室機房起火，煙霧呈深黑色且具有極高噴出速度(Velocity)。內部小組回報熱像儀顯示天花板已達 300 度以上。ISO 應？",
                    thermal: 85, toxic: 80,
                    options: [
                        { text: "協助小組執行正壓排煙 (PPV)", next: "m3-fail-flashover" },
                        { text: "下令關閉門扇控火，並要求小組撤至通風處", next: "m3-s2" }
                    ]
                },
                {
                    id: "m3-s2",
                    text: "控制流路後，火勢稍緩但熱氣層仍不穩定。ISO 發現外部煙霧開始出現『向內吸入』的脈動(Pulsing)。ISO 應下達？",
                    thermal: 95, toxic: 85,
                    options: [
                        { text: "啟動 EVA 撤退警報，所有人全數撤離地下室", next: "m3-win" },
                        { text: "要求水線小組嘗試進行天花板點放冷卻", next: "m3-fail-backdraft" }
                    ]
                }
            ],
            results: {
                "m3-fail-flashover": { title: "❌ 決策失敗", desc: "引發閃燃！不當的通風（PPV）提供了新鮮氧氣，地下室瞬間陷入火海。", legal: "《火場指揮及搶救安全指導原則》：通風路徑管控（Flow Path Control）。ISO 未能察覺脈動式火煙危險。" },
                "m3-fail-backdraft": { title: "❌ 決策失敗", desc: "發生復燃！人員停留在熱氣層輻射區過久，遭極度高溫灼傷。", legal: "《消防機關救災安全手冊》：閃燃與復燃前兆辨識。ISO 決策延遲。" },
                "m3-win": { title: "🏅 任務成功", desc: "成功規避風險！及時判讀出閃燃/復燃的前兆脈動，保全了入室人員生命安全。", legal: "《消防機關救災安全手冊》：火煙判讀 VVDC 原則之落實。" }
            }
        },
        mission4: {
            title: "Mission 4：現場 MAYDAY (緊急救援)",
            steps: [
                {
                    id: "m4-s1",
                    text: "火場內部突然傳出連續三聲『MAYDAY』！有一名隊員失蹤且空氣瓶警報響起。身為 ISO 你的首要動作？",
                    thermal: 50, toxic: 50,
                    options: [
                        { text: "親自衝入現場協尋失蹤隊員", next: "m4-fail-losecmd" },
                        { text: "確認 LUNAR 資訊並下達無線電靜默（LIPS）", next: "m4-s2" }
                    ]
                },
                {
                    id: "m4-s2",
                    text: "已確認位置與傷勢，RIT 小組已整裝待發。ISO 發現目前水線小組正分散於不同樓層，此時應？",
                    thermal: 70, toxic: 70,
                    options: [
                        { text: "命令 RIT 進入救人，其餘小組維持攻擊火勢", next: "m4-fail-protection" },
                        { text: "抽調鄰近水線支援 RIT 搜救路徑防護", next: "m4-win" }
                    ]
                }
            ],
            results: {
                "m4-fail-losecmd": { title: "❌ 決策失敗", desc: "失去指揮！ISO 離崗造成現場無人監控安全動向，導致救援行動陷入混亂。", legal: "《消防緊急應援小組RIT作業規定》：ISO 必須留守指揮站監控人員管制(Accountability)。" },
                "m4-fail-protection": { title: "❌ 決策失敗", desc: "防護缺失！RIT 小組進入搜救時無水線掩護，遭突發火勢阻隔受困。", legal: "《RIT搜救作業指引》：搜救時必須建立支援水線（Backup Line）確保路徑安全。" },
                "m4-win": { title: "🏅 任務成功", desc: "教科書般的救援！冷靜執行 LIPS 管制並確保搜救路徑防護，成功將受困消防員救出。", legal: "《消防機關救災安全手冊》：MAYDAY 處置程序。ISO 成功執行人員安全與生存權之保護。" }
            }
        } ,
        mission5: {
            title: "Mission 5：高層建築 - 風壓火災 (Wind-Driven)",
            steps: [
                {
                    id: "m5-s1",
                    text: "20 樓層住宅起火，強陣風從迎風面陽台吹入，走廊充滿高壓高溫火煙。指揮官命小組撤離後，火勢極速延燒至雲梯車無法觸及處。身為 ISO，你的第一步專業判讀？",
                    thermal: 80, toxic: 80,
                    options: [
                        { text: "命令水線小組在起火層門口進行點放冷卻", next: "m5-s2" },
                        { text: "要求小組先行掌控另一側樓梯門，防止風壓效應擴散", next: "m5-s2" }
                    ]
                },
                {
                    id: "m5-s2",
                    text: "掌控門戶後，風壓依然猛烈。內部小組回報熱像儀感應到牆壁出現『閃爍爆裂』現象。此時應採取？",
                    thermal: 95, toxic: 90,
                    options: [
                        { text: "繼續在樓梯間待命，等待風向改變", next: "m5-fail-wind" },
                        { text: "全面撤離該樓層，改由室內消防栓執行防禦攻擊", next: "m5-win" }
                    ]
                }
            ],
            results: {
                "m5-fail-wind": { title: "❌ 決策失敗", desc: "烈火灌入！風壓效應（Wind-driven effect）將熱氣直接灌入樓梯間，造成搶救小組受困嚴重灼傷。", legal: "《高層建築火災搶救作業程序》：應優先建立『防煙區劃』並注意風壓效應之致命性。" },
                "m1-fail-rush": { title: "❌ 決策失敗", desc: "盲目入室！未經危害辨識即進入熱區，造成多名消防員觸及化學毒氣受傷。", legal: "《消防機關救災安全手冊》第參章：ISO 應督導於化學救災前確實執行 H-Card 危害辨識。" },
                "m5-win": { title: "🏅 專精戰術成功", desc: "教科書般的風壓防護！成功阻止了走廊閃燃擴散，並利用建築本身結構保全了小組生命。", legal: "《高層建築火災安全指引》：ISO 成功判讀風壓效應並果斷行使撤離建議。" }
            }
        },
        mission6: {
            title: "Mission 6：大型地下停車場 (視覺零度)",
            steps: [
                {
                    id: "m6-s1",
                    text: "多樓層大型賣場停車場起火，內部充滿濃煙、視野為零。導引線小組入室後失去無線電聯繫 2 分鐘。ISO 的處置決策？",
                    thermal: 40, toxic: 85,
                    options: [
                        { text: "親自背負 SCBA 循導引線入室找人", next: "m6-fail-losecontrol" },
                        { text: "立即建立現場通訊中繼站，並回報 MAYDAY 預警", next: "m6-s2" }
                    ]
                },
                {
                    id: "m6-s2",
                    text: "中繼建立後，小組回報氣瓶警告響起。內部回音嚴重，難以辨識方向。ISO 此時應下令？",
                    thermal: 60, toxic: 95,
                    options: [
                        { text: "開啟所有排煙設備，強力抽風", next: "m6-win" },
                        { text: "要求小組分散行動，摸牆尋找出口", next: "m6-fail-disoriented" }
                    ]
                }
            ],
            results: {
                "m6-fail-losecontrol": { title: "❌ 決策失敗", desc: "指揮真空！ISO 脫崗入室導致現場安全監控中斷，救援任務陷入失控。", legal: "《消防人員安全與衛生管理辦法》：安全官不得隨意參與一線搶救，必須留守監控站。" },
                "m6-fail-disoriented": { title: "❌ 決策失敗", desc: "空間迷失！分散行動導致多名隊員在廣大停車場迷航，氧氣耗盡。", legal: "《消防機關救災安全手冊》：入室搜救必須維持小組行動（Crew Integrity），嚴禁私自離隊。" },
                "m6-win": { title: "🏅 專家級成功", desc: "極地救援成功！在高壓情況下維持通訊穩定與團隊完整度，成功營救全員撤出。", legal: "《特種場所火災搶救要領》：通訊中繼與氣瓶管理（Air Management）是 ISO 的核心職責。" }
            }
        }
    };

    let currentMission = 'mission1';
    let currentStepIndex = 0;

    function startMission(missionKey) {
        currentMission = missionKey;
        currentStepIndex = 0;
        document.getElementById('result-overlay').classList.remove('active');
        document.getElementById('legal-citation').classList.remove('active');
        document.getElementById('eva-alarm').classList.remove('active');
        
        // 重置為專業思維圖
        const isoImg = document.getElementById('decision-img');
        if (isoImg) isoImg.src = "images/taiwan_iso_thinking.png";

        showDecision();
    }

    function showDecision() {
        const mission = decisionData[currentMission];
        const step = mission.steps[currentStepIndex];
        const textEl = document.getElementById('decision-text');
        const optionsEl = document.getElementById('decision-options');
        
        if (step.thermal) updateBar('thermal-bar', step.thermal);
        if (step.toxic) updateBar('toxic-bar', step.toxic);

        textEl.innerText = "";
        let i = 0;
        const typeInterval = setInterval(() => {
            textEl.innerText += step.text[i];
            i++;
            if (i >= step.text.length) {
                clearInterval(typeInterval);
                playTacticalSound('find');
            }
        }, 30);

        optionsEl.innerHTML = "";
        step.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = "decision-btn";
            btn.innerText = opt.text;
            btn.onclick = () => {
                if (opt.next.includes('win') || opt.next.includes('fail')) {
                    showResult(opt.next);
                } else {
                    currentStepIndex++;
                    showDecision();
                }
            };
            optionsEl.appendChild(btn);
        });
    }

    function updateBar(id, value) {
        const bar = document.getElementById(id);
        bar.style.width = value + '%';
        if (value > 80) bar.style.background = '#ef4444';
        else if (value > 50) bar.style.background = '#f59e0b';
        else bar.style.background = 'var(--gradient-blue)';
    }

    function showResult(resultKey) {
        const mission = decisionData[currentMission];
        const result = mission.results[resultKey];
        const overlay = document.getElementById('result-overlay');
        const legalEl = document.getElementById('legal-citation');
        const isoImg = document.getElementById('decision-img');
        
        document.getElementById('result-title').innerText = result.title;
        document.getElementById('result-title').className = "result-title " + (resultKey.includes('win') ? 'success' : 'failure');
        document.getElementById('result-desc').innerText = result.desc;
        
        // 根據成敗更換為場景圖
        if (isoImg) {
            if (resultKey.includes('win')) {
                isoImg.src = "images/hsinchu_female_iso_success.png";
            } else if (resultKey.includes('fail')) {
                isoImg.src = "images/iso_failure.png";
            }
        }

        // 延遲顯示結果文字覆蓋層 (Delay result overlay)
        const delay = resultKey.includes('win') ? 800 : 1500;
        
        setTimeout(() => {
            overlay.classList.add('active');
            if (result.legal) {
                legalEl.innerText = result.legal;
                legalEl.classList.add('active');
            }
        }, delay);

        if (resultKey.includes('win')) {
            playTacticalSound('clear');
            if (typeof flashScreen === 'function') flashScreen('rgba(16, 185, 129, 0.2)'); // 成功綠色閃爍
        } else {
            playAlarmSound(); 
            // 失敗視覺回饋 (Shake & Flash)
            if (typeof shakeScreen === 'function') shakeScreen(12, 600);
            if (typeof flashScreen === 'function') flashScreen('rgba(239, 68, 68, 0.4)', 800);
            
            if (result.desc.includes('坍塌') || result.desc.includes('閃燃') || result.desc.includes('爆裂')) {
                document.getElementById('eva-alarm').classList.add('active');
            }
        }
    }

    function playAlarmSound() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.5);
        osc.frequency.linearRampToValueAtTime(440, now + 1.0);
        osc.connect(g);
        g.connect(audioCtx.destination);
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
        osc.start(now);
        osc.stop(now + 1.0);
    }

    window.nextDecision = function() {
        const missionKeys = Object.keys(decisionData);
        let nextIdx = missionKeys.indexOf(currentMission) + 1;
        if (nextIdx >= missionKeys.length) nextIdx = 0;
        startMission(missionKeys[nextIdx]);
    };

    window.switchMode = function(mode) {
        const spotterView = document.getElementById('spotter-view');
        const decisionView = document.getElementById('decision-view');
        const btns = document.querySelectorAll('.mode-btn');

        btns.forEach(b => b.classList.remove('active'));

        if (mode === 'spotter') {
            spotterView.style.display = 'block';
            decisionView.style.display = 'none';
            btns[0].classList.add('active');
        } else {
            spotterView.style.display = 'none';
            decisionView.style.display = 'block';
            btns[1].classList.add('active');
            startMission('mission1');
        }
    };

    // --- 初始化首個場景 ---
    loadSpotterScene(0);
});
