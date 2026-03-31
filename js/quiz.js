const quizDataBank = [
    // --- 資訊權與法規罰則 (5題) ---
    {
        scenario: "火警現場，廠方負責人含糊其辭，不願提供化學品存放平面圖。內部火勢逐漸擴大且開始竄出不明顏色濃煙。",
        question: "身為指揮官/安全官，您應該依法行使哪一項權利並可依法對廠方開罰？",
        options: ["行政調查權", "退避權", "資訊權"],
        correctAnswer: 2,
        feedbackCorrect: "完美決策！依據《消防法第 21-1 條》資訊權，管理權人必須提供化學品種類、位置與搶救資訊。",
        feedbackWrong: "決策失誤！此情況下最直接能要求廠方的是「資訊權」。"
    },
    {
        scenario: "您抵達化學廠準備索取 H-Card 危害辨識卡時，廠務人員表示圖資還放在辦公室，拒絕提供且不願指派專人協助。",
        question: "依據《消防法》第 43-1 條，不給圖或給假資料的廠方最高將面臨多少罰鍰？",
        options: ["10 萬至 50 萬元", "最高 500 萬元", "最高 1,000 萬元"],
        correctAnswer: 1,
        feedbackCorrect: "正確。消防法大修後，未依規定提供搶救資訊者，最高將處以新台幣 500 萬元的重罰。",
        feedbackWrong: "錯了。為有效嚇阻，修法後不提供圖資最高可開罰 500 萬元。"
    },
    {
        scenario: "廠方不僅無法提供圖資，甚至在火災發生後，無人願意出面，未指派專人至現場協助指揮官。",
        question: "依據《消防法第 43-1 條》，未立即指派專人到場協助的罰則為何？",
        options: ["50萬至 1,000 萬元", "吊銷營業執照", "最高 500 萬元"],
        correctAnswer: 0,
        feedbackCorrect: "答對了！最高可開罰一千萬！不派人的後果非常嚴重，廠方有義務全程協助搶救。",
        feedbackWrong: "這罰則更重！未指派專人到場協助，將面臨 50 萬至 1,000 萬元的超高額罰鍰。"
    },
    {
        scenario: "您在場所外部發現一張「危害風險標示板 (GHS)」，上面寫著過期兩年的化學品資訊。",
        question: "依據《消防法第 21-2 條》(動態更新義務)，下列何者正確？",
        options: ["只要有掛牌子就算合法", "危害風險有變動時，必須及時更新", "過期資訊不影響搶救，不須更新"],
        correctAnswer: 1,
        feedbackCorrect: "完全正確！掛著過期的牌子應付了事是絕對禁忌，必須及時更新內容與等級。",
        feedbackWrong: "錯！過期的危害資訊會嚴重誤導第一線人員，法規要求必須及時更新。"
    },
    {
        scenario: "廠方終於交出一張 H-Card。您必須快速檢視上面是否具備完整的法定要素。",
        question: "一張合規的 H-Card 核心要素「不包含」下列哪一項？",
        options: ["附近超商的位置", "廠區基本資料與化學品內容標示", "樓層平面圖與立面圖 (若適用)"],
        correctAnswer: 0,
        feedbackCorrect: "正確。合規的H-Card關注的是廠區結構、化學品、緊急聯絡人與消防配置。",
        feedbackWrong: "要注意看！H-Card 的四大核心包含：廠區資料、化學品內容、平面圖與立面圖。"
    },

    // --- 退避權與危險性救災行動 (6題) ---
    {
        scenario: "鐵皮工廠內部燃燒猛烈，外牆嚴重扭曲變形、且屋頂有凹陷跡象，且確認內部人員已全數打卡下班(無人受困)。",
        question: "為了防止悲劇發生，指揮官下一步該下達什麼指令？",
        options: ["呼叫 RIT (緊急救援小組) 進入內部接手滅火", "行使退避權，全面撤出內部人員改為外部防禦性射水", "要求內部人員加快腳步建立水線"],
        correctAnswer: 1,
        feedbackCorrect: "正確判斷！《消防法第 20-1 條》明定，在無人命危害之虞的前提下，得不執行危險性救災。",
        feedbackWrong: "危險決策！結構強度已喪失且無人受困，必須立即行使退避權。"
    },
    {
        scenario: "在決定是否行使退避權時，指揮官必須遵守一個大前提「無人命危害之虞」。",
        question: "何謂無人命危害之虞？",
        options: ["長官覺得危險就算", "民眾在裡面但因為很熱不救", "確認無人命需救援疏散，或受災民眾已無生還可能"],
        correctAnswer: 2,
        feedbackCorrect: "正確。只要滿足無人需救援，或已無生還可能，即可依法行使退避權。",
        feedbackWrong: "這是不正確的認知。必須確認「無人命需救援」或「已無法生還」才是客觀標準。"
    },
    {
        scenario: "依據《危險性救災行動認定標準》，當現場為製造印刷電路板 (PCB) 或輕量型鋼結構建築火警時。",
        question: "這屬於 6 大危險情境的哪一項，得不執行入室搶救？",
        options: ["核生化熱區", "脆弱結構", "封閉空間"],
        correctAnswer: 1,
        feedbackCorrect: "正確！輕鋼架與 PCB 廠在高溫下極易迅速崩塌，被歸類為「脆弱結構」。",
        feedbackWrong: "請熟記6大情境。輕量鋼結構與PCB應屬於「脆弱結構」類型。"
    },
    {
        scenario: "某長隧道發生大型遊覽車起火，濃煙密佈全線，隧道內溫度急劇攀升，無從通風排煙。",
        question: "依據《危險性救災行動認定標準》，這是屬於哪一種情形？",
        options: ["倒塌危機", "綜合研判", "封閉空間"],
        correctAnswer: 2,
        feedbackCorrect: "正確！長隧道、地下軌道船艙都屬於標準明訂的「封閉空間」。",
        feedbackWrong: "這種類型屬於「封閉空間」，在無適當排煙下極度致命。"
    },
    {
        scenario: "在火警初期，攻堅小組已入室。但在外部，安全官觀察到「高壓且高速的濃密黃煙」突然從屋簷噴出。",
        question: "退避權的動態防線精神告訴我們，此時應該採取什麼行動？",
        options: ["這是正常現象繼續滅火", "遇閃燃/爆燃前兆，立刻採取動態撤離行動並回報MAYDAY", "只需回報不需要出來"],
        correctAnswer: 1,
        feedbackCorrect: "判讀精準！退避權不僅是進場前的決定，在遭遇閃燃前兆時，更應採取啟動動態撤離機制。",
        feedbackWrong: "錯！高壓黃煙是閃燃暴燃前兆，情況極度危急，安全官必須下達緊急撤出指令。"
    },
    {
        scenario: "調查權被譽為消防黃金三角之一，《消防法第 27-1 條》明定若有消防員重傷殉職，應組成災害事故調查會。",
        question: "調查會成員中，新增了哪一個群體的參與權利以求公開透明？",
        options: ["肇事工廠的員工", "基層消防團體代表", "保險公司代表"],
        correctAnswer: 1,
        feedbackCorrect: "完全正確！修法後特別納入「基層代表」並邀請外部學者，打破球員兼裁判之疑慮。",
        feedbackWrong: "為了公平與防偏頗，法規明定必須有「基層團體代表」參與。"
    },

    // --- 指揮官職權與現場權責 (6題) ---
    {
        scenario: "為了有效阻絕延燒，指揮官必須徵用鄰近大樓的水池與強制自來水公司集中供水。",
        question: "這是行使《消防法》中指揮官四項法定的哪一項職權？",
        options: ["緊急處置權", "劃定警戒區", "水源使用權"],
        correctAnswer: 2,
        feedbackCorrect: "正確！法規賦予指揮官合法動用附近各種資源的「水源使用權」。",
        feedbackWrong: "這個權限就是非常直覺的「水源使用權」。"
    },
    {
        scenario: "廠房有嚴重易爆氣體洩漏，指揮官下令打破某民宅落地窗以利氣體排散，並強行開路供消防車進駐。",
        question: "破壞非當事人(第三人)的建築與車輛，是基於哪項權力？",
        options: ["緊急處置權", "破壞權", "截斷能源權"],
        correctAnswer: 0,
        feedbackCorrect: "正確！第19條明定救災可使用、損壞人民的土地/建物/車輛，謂之「緊急處置權」。",
        feedbackWrong: "不對，針對財物的破壞與使用統稱為「緊急處置權」。"
    },
    {
        scenario: "為了阻止風向將大火吹往後方的整排連棟木造民房，指揮官決定請台電強制斷電。",
        question: "這是指揮官的哪一項權責？",
        options: ["緊急處置權", "截斷能源權", "連帶賠償權"],
        correctAnswer: 1,
        feedbackCorrect: "正確。必要時得通知事業機構截斷電源或瓦斯，即為「截斷能源權」。",
        feedbackWrong: "切斷水電瓦斯皆屬於法定中的「截斷能源權」。"
    },
    {
        scenario: "鄉親想硬闖火災現場搶救貴重財物，指揮官劃下封鎖線並將不聽勸的民眾強制架離。",
        question: "指揮官這項限制人車與強制疏散的權力稱為什麼？",
        options: ["劃定警戒區", "緊急拘留權", "行政處罰權"],
        correctAnswer: 0,
        feedbackCorrect: "正確。對火災處所周邊劃定警戒區，必要時得強制疏散，為四大權限之一。",
        feedbackWrong: "這是基本常識「劃定警戒區」。"
    },
    {
        scenario: "消防隊為了阻止大火延燒，合法動用緊急處置權，砸破了周邊無辜住戶(A先生)的玻璃窗。A先生非常崩潰。",
        question: "無辜的A先生能依法申請財產破壞補償嗎？",
        options: ["不行，這是為了整體救災就算他倒楣", "可以，因為他無端遭受財產的『特別犧牲』", "只要是救災造成的永遠不能賠償"],
        correctAnswer: 1,
        feedbackCorrect: "沒錯！針對不可歸責於該民眾之無辜者，其為救災承受了「特別犧牲」，可向主管機關申請補償。",
        feedbackWrong: "救災有底線也有法理。若非當事人造成的損害，屬於「特別犧牲」，主管機關仍應給予補償。"
    },
    {
        scenario: "承上題，如果起火戶就是 B 先生家（他忘記關爐火燒了自己家），消防隊破門進去滅火。",
        question: "B 先生能針對他被消防隊破壞的自家大門申請補償嗎？",
        options: ["可以，門很貴", "不能，因為火災可歸責於他自己", "看指揮官心情"],
        correctAnswer: 1,
        feedbackCorrect: "正確！火災是他自己造成的（可歸責於己），不符合特別犧牲的條件，不予補償。",
        feedbackWrong: "因起火原因是當事人的過失，依法這不屬於「特別犧牲」，不予補償。"
    },

    // --- 火場前線安全戰技 (8題) ---
    {
        scenario: "安全官在外圍觀察，看見火場噴出極度濃密(Volume大)的黑色煙霧，且流動速度(Velocity)非常快。",
        question: "這代表這棟建築物內部正處於什麼狀態？",
        options: ["火勢即將熄滅", "木造裝潢悶燒中", "高溫氣體累積，隨時準備引發閃燃 (Flashover)"],
        correctAnswer: 2,
        feedbackCorrect: "正確判讀！濃厚、高速且黑的煙霧是閃燃前的強烈警告，請隨時準備行使退避權。",
        feedbackWrong: "這是非常致命的火煙特徵。代表閃燃即將發生。"
    },
    {
        scenario: "您剛被指派擔任一場三級複雜火警的「事故安全官 (Safety Officer)」。",
        question: "您的「首要核心職責」是什麼？",
        options: ["直接指揮水線入室滅火", "360度環顧火場發覺危險徵兆，保護打火弟兄安全", "聯絡媒體記者"],
        correctAnswer: 1,
        feedbackCorrect: "觀念正確！安全官是不帶水線的。專注於找出 Hazards (危害)，必要時行使絕對強制中止權。",
        feedbackWrong: "安全官不是去打火的，而是去「保護打火的人」。"
    },
    {
        scenario: "判讀建築物平面圖時，有一句核心口訣叫做「梯開危險空間軟」。",
        question: "其中「空」字代表什麼意義？",
        options: ["空軍支援 (Air Support)", "空間死角 (極易造成迷失的高風險夾層/單一入口)", "空調與通風管道"],
        correctAnswer: 1,
        feedbackCorrect: "正確！地下室、夾層、無窗房等「空間死角」是最容易讓兄弟迷失與殉職的殺手。",
        feedbackWrong: "「空」是指「空間的死角」，代表無窗或狹窄的致命空間。"
    },
    {
        scenario: "承上題，口訣中的「軟」代表應具備兩手準備。",
        question: "下列哪一項不是「軟/逃」網方案的實務作為？",
        options: ["架設好逃生梯，替受困可能多準備一條退路", "確認多口進出雙方向救援計畫", "只顧往前衝，不用留退路"],
        correctAnswer: 2,
        feedbackCorrect: "這是致命錯誤！「軟網方案」就是要我們隨時把退路(架梯、確保門開啟)佈置好，絕不破釜沉舟。",
        feedbackWrong: "衝進去不留退路就是找死。「軟」就是強調退路跟保護網。"
    },
    {
        scenario: "第一線人員在熱區連續作戰後，因氣量不足撤離到 REHAB (後勤照護區)。",
        question: "在 REHAB 區安全幕僚必須落實的 4 大要素 (R.E.H.A.) 中，不包含哪一項？",
        options: ["Hydration (補水)", "Energy (營養與檢測)", "Heroism (個人英雄主義)"],
        correctAnswer: 2,
        feedbackCorrect: "很好！REHAB 是講求科學的恢復站，嚴禁帶有硬撐的英雄主義思想。",
        feedbackWrong: "REHAB 的核心是休息與恢復，不包含英雄主義。"
    },
    {
        scenario: "無線電傳來：「指揮官，我是四四分隊的小李，我在3樓辦公區，空氣剩 60 bar，氣瓶閥被電線卡死了」",
        question: "這呼叫符合 L.U.N.A.R. 求救原則。此案例中，他的 \"R (Resource needed)\" 是什麼？",
        options: ["他是小李 (Name)", "他在 3 樓辦公區 (Location)", "被電線卡死，需要脫困器或備用空氣 (Resource)"],
        correctAnswer: 2,
        feedbackCorrect: "非常敏銳！把遇到的困境講出來，外面的 RIT 才具備正確帶裝備（如剪線器）進去的能力。",
        feedbackWrong: "R 代表的是 Resource needed (遇到的問題跟所需資源)。"
    },
    {
        scenario: "指揮中心立刻派遣待命的 RIT 小組進入。請問 RIT (Rapid Intervention Team) 的唯一目標為何？",
        options: ["保護剛搬出來的保險箱", "救出陷入危機的「消防隊員」", "深入火點中心撲滅火勢"],
        correctAnswer: 1,
        feedbackCorrect: "沒錯！RIT 的信條就是：「消防員救消防員」。不打火、不搬物資，專門待命應付 MAYDAY。",
        feedbackWrong: "別搞錯編制了！RIT 的任務非常專一，只有在消防員陷入危險時才會出動救援同袍。"
    },
    {
        scenario: "113年消防修法在第 25-1 到 25-7 條引入了「消防職安專章」。",
        question: "推行職安專章的核心精神類似於業界的哪一種管理系統制度？",
        options: ["ISO 45001 職業安全衛生管理系統", "ISO 9001 品質管理系統", "ESG 企業永續治理報告"],
        correctAnswer: 0,
        feedbackCorrect: "正是如此！政府以 ISO45001 的精神，要求消防機關制定安全防護計畫，從系統本質上預防過勞與傷害。",
        feedbackWrong: "消防職安專章參考的正是 ISO 45001 的職安衛管理認證架構。"
    }
];

//  Fisher-Yates 洗牌演算法 (Shuffle)
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const QUIZ_LENGTH = 5; // 每次隨機抽取 5 題
let activeQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnswered = false;
let answeredLog = []; // ← 記錄每題作答情況，供解析面板使用

const questionCounter = document.getElementById('question-counter');
const progressBar = document.getElementById('progress-bar');
const scenarioText = document.getElementById('scenario-text');
const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const feedbackBox = document.getElementById('feedback-box');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackContent = document.getElementById('feedback-content');
const nextBtn = document.getElementById('next-btn');

const quizUI = document.getElementById('quiz-ui');
const scoreScreen = document.getElementById('score-screen');
const scoreNumber = document.getElementById('score-number');
const scoreTitle = document.getElementById('score-title');
const scoreDesc = document.getElementById('score-desc');

function initQuiz() {
    activeQuiz = shuffle([...quizDataBank]).slice(0, QUIZ_LENGTH);
    currentQuestionIndex = 0;
    score = 0;
    answeredLog = []; // ← 清空記錄
    loadQuestion();
}

function loadQuestion() {
    isAnswered = false;
    const currentQuizData = activeQuiz[currentQuestionIndex];
    
    questionCounter.innerText = `Question ${currentQuestionIndex + 1} / ${activeQuiz.length}`;
    progressBar.style.width = `${((currentQuestionIndex) / activeQuiz.length) * 100}%`;
    
    scenarioText.innerText = currentQuizData.scenario;
    questionText.innerText = currentQuizData.question;
    optionsGrid.innerHTML = '';
    
    feedbackBox.className = 'feedback-box';
    nextBtn.style.display = 'none';
    nextBtn.innerText = '進入下一題 ➡️';

    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index));
        optionsGrid.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    if (isAnswered) return;
    isAnswered = true;

    const currentQuizData = activeQuiz[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQuizData.correctAnswer;
    
    const optionBtns = document.querySelectorAll('.option-btn');

    optionBtns.forEach((btn, index) => {
        btn.disabled = true;
        if (index === currentQuizData.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    feedbackBox.classList.add('show');

    if (isCorrect) {
        score++;
        feedbackBox.classList.add('correct-fb');
        feedbackTitle.innerText = "⭐ 專業決策！";
        feedbackContent.innerText = currentQuizData.feedbackCorrect;
        if (typeof window.onQuizCorrect === 'function') {
            window.onQuizCorrect(optionBtns[selectedIndex]);
        }
    } else {
        feedbackBox.classList.add('wrong-fb');
        feedbackTitle.innerText = "⚠️ 決策失誤";
        feedbackContent.innerText = currentQuizData.feedbackWrong;
        if (typeof window.onQuizWrong === 'function') {
            window.onQuizWrong();
        }
    }

    progressBar.style.width = `${((currentQuestionIndex + 1) / activeQuiz.length) * 100}%`;

    // 記錄作答
    answeredLog.push({
        question: currentQuizData.question,
        scenario: currentQuizData.scenario,
        options: currentQuizData.options,
        selected: selectedIndex,
        correct: currentQuizData.correctAnswer,
        isCorrect,
        feedbackCorrect: currentQuizData.feedbackCorrect
    });

    nextBtn.style.display = 'block';
    
    if (currentQuestionIndex === activeQuiz.length - 1) {
        nextBtn.innerText = '查看安全評估結果 ➡️';
    }
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuiz.length) {
        loadQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    quizUI.style.display = 'none';
    scoreScreen.classList.add('active');
    
    // Calculate final score base 100
    const finalScore = Math.round((score / activeQuiz.length) * 100);
    scoreNumber.innerText = finalScore;

    // Record result in progress tracker
    if (typeof tracker !== 'undefined') {
        tracker.addQuizResult(finalScore, 100);
    }

    if (score === activeQuiz.length) {
        scoreNumber.style.borderColor = '#10b981';
        scoreNumber.style.color = '#10b981';
        scoreNumber.style.background = 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)';
        scoreTitle.innerText = "🏆 卓越決策者";
        scoreDesc.innerText = "5 題特考全對！您對消防法規、退避決策與現場安全評估具備了極高的實踐能力。";
    } else if (score >= activeQuiz.length / 2) {
        scoreNumber.style.borderColor = '#f59e0b';
        scoreNumber.style.color = '#f59e0b';
        scoreNumber.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)';
        scoreTitle.innerText = "🛡️ 合格安全官";
        scoreDesc.innerText = "您具備不錯的安全意識，但部分法規判定 (H-Card、6大情境) 仍可多加精進。";
    } else {
        scoreNumber.style.borderColor = '#ef4444';
        scoreNumber.style.color = '#ef4444';
        scoreNumber.style.background = 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)';
        scoreTitle.innerText = "⚠️ 需重新鑑測";
        scoreDesc.innerText = "您在真實演練中的決策容錯率偏低，這將為自身與團隊帶來高風險。請反覆練習本題庫。";
    }

    // 渲染本次作答解析面板
    const reviewPanel = document.getElementById('answer-review-panel');
    const reviewList = document.getElementById('answer-review-list');
    if (reviewPanel && reviewList) {
        reviewList.innerHTML = answeredLog.map((log, i) => `
            <div class="review-item ${log.isCorrect ? 'review-correct' : 'review-wrong'}">
                <div class="review-q-num">${log.isCorrect ? '✅' : '❌'} 第 ${i+1} 題</div>
                <p class="review-scenario">${log.scenario}</p>
                <p class="review-question"><strong>${log.question}</strong></p>
                <div class="review-options">
                    ${log.options.map((opt, oi) => `
                        <span class="review-opt ${oi === log.correct ? 'is-correct' : ''} ${oi === log.selected && !log.isCorrect ? 'is-wrong' : ''}">${opt}</span>
                    `).join('')}
                </div>
                <p class="review-feedback">${log.feedbackCorrect}</p>
            </div>
        `).join('');
    }
}

// 系統啟動進入首題
initQuiz();
