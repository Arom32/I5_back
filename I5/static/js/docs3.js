// -------------------------- 문서 줌 기능 --------------------------
let scale = 1;
const page = document.getElementById("document-page");

if (document.getElementById("zoomIn")) {
    document.getElementById("zoomIn").onclick = () => {
        scale = Math.min(2.0, scale + 0.1); 
        page.style.transform = `scale(${scale})`;
    };
}

if (document.getElementById("zoomOut")) {
    document.getElementById("zoomOut").onclick = () => {
        scale = Math.max(0.5, scale - 0.1); 
        page.style.transform = `scale(${scale})`;
    };
}

// -------------------------- 사이드바 기능 --------------------------
const sidebar = document.getElementById("sidebar");
const wordList = document.getElementById("word-list");
const closeBtn = document.getElementById("closePanel");
// 초록색/회색 요소들 (번역 문장)
const lineBoxes = document.querySelectorAll(".line-box"); 

// 단어 설명 데이터베이스
const dictionary = {
    "impact": "영향, 충격, 효과",
    "dynamic": "역동적인, 활발한",
    "optimize": "최적화하다, 가장 잘 활용하다",
    "analysis": "분석, 검토",
    "design": "설계, 디자인",
};

/* ------------------------- 
   본문 단어 클릭 → 사이드바 열기 및 단어 추가
------------------------- */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("word")) {
        const word = e.target.innerText;
        openSidebar(word);
        
        // 단어를 선택하면 초록색/회색 요소들을 보이게 함
        showTranslationBoxes(true); 
    }
});

/* -------------------------
   사이드바 열기 & 단어 추가
------------------------- */
function openSidebar(word) {
    if (sidebar) {
        sidebar.classList.remove("hidden");
        
        setTimeout(() => {
            sidebar.classList.add("open");
        }, 10);
        
        addWordToSidebar(word);
    }
}

/* -------------------------
   단어 박스 생성
------------------------- */
function addWordToSidebar(word) {
    if (!wordList) return;

    // 중복 추가 방지
    const existingWords = Array.from(wordList.querySelectorAll('span')).map(span => span.innerText);
    if (existingWords.includes(word)) {
        return;
    }
    
    const item = document.createElement("div");
    item.className = "word-item";

    const tooltipText = dictionary[word] || "설명이 없습니다.";

    item.innerHTML = `
        <span>${word}</span>
        <button class="save-btn" aria-label="단어 저장">📌</button>
        <div class="tooltip">${tooltipText}</div>
    `;

    // 최신 단어가 목록 상단에 오도록 prepend 사용
    wordList.prepend(item);
}

/* -------------------------
   초록색/회색 박스(line-box) 표시/숨김 함수
------------------------- */
function showTranslationBoxes(shouldShow) {
    lineBoxes.forEach(box => {
        // 단어 선택 시 보이게, 사이드바 닫을 때 숨김
        box.style.opacity = shouldShow ? '1' : '0'; 
        box.style.visibility = shouldShow ? 'visible' : 'hidden';
    });
}


/* -------------------------
   저장 버튼 클릭 → localStorage 저장
------------------------- */
if (wordList) {
    wordList.addEventListener("click", (e) => {
        if (e.target.classList.contains("save-btn")) {
            const word = e.target.parentElement.querySelector("span").innerText;
            saveWord(word);
        }
    });
}

function saveWord(word) {
    let saved = JSON.parse(localStorage.getItem("savedWords") || "[]");

    if (!saved.includes(word)) {
        saved.push(word);
        localStorage.setItem("savedWords", JSON.stringify(saved));
        alert(`"${word}"가 단어장에 저장되었습니다.`);
    } else {
         alert(`"${word}"는 이미 저장되어 있습니다.`);
    }
}

/* -------------------------
   사이드바 닫기 (X 버튼)
------------------------- */
if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");

        // 사이드바 닫을 때 초록색/회색 요소들을 숨김
        showTranslationBoxes(false); 

        // 애니메이션이 끝난 후 완전히 숨김
        setTimeout(() => {
            sidebar.classList.add("hidden");
        }, 300);
    });
}

// 초기 상태: 초록색/회색 박스를 숨깁니다.
showTranslationBoxes(false);