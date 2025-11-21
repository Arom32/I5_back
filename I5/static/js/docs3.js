// -------------------------- [설정] --------------------------
const MEANING_URL = "/converter/meaning/"; 

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
const lineBoxes = document.querySelectorAll(".line-box"); 

/* ------------------------- 
   본문 단어 클릭 이벤트
------------------------- */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("word")) {
        const rawWord = e.target.innerText;
        const cleanWord = rawWord.replace(/[^가-힣a-zA-Z0-9]/g, "").trim();

        if (!cleanWord) return;

        openSidebar();
        showTranslationBoxes(true); 

        if (highlightExistingWord(cleanWord)) return;

        fetchAndAddWord(cleanWord);
    }
});

function openSidebar() {
    if (sidebar) {
        sidebar.classList.remove("hidden");
        setTimeout(() => {
            sidebar.classList.add("open");
        }, 10);
    }
}

function highlightExistingWord(word) {
    if (!wordList) return false;
    const items = wordList.querySelectorAll('.word-item');
    for (let item of items) {
        // 구조가 바뀌어도 단어 텍스트는 첫번째 span에 있다고 가정
        const titleSpan = item.querySelector('span'); 
        if (titleSpan && titleSpan.innerText === word) {
            // 이미 있는 단어 강조 (클래스로 제어하거나 투명도 조절만)
            item.style.opacity = "0.5";
            setTimeout(() => { item.style.opacity = "1"; }, 300);
            return true;
        }
    }
    return false;
}

/* -------------------------
   [수정] 디자인 침해 없는 아코디언 기능
------------------------- */
function fetchAndAddWord(searchWord) {
    if (!wordList) return;

    const item = document.createElement("div");
    item.className = "word-item"; 
    // [중요] 여기에 style="..." 로 배경색이나 테두리를 넣지 않았습니다!
    // 기존 CSS의 .word-item 스타일을 그대로 따라갑니다.

    // 1. HTML 구조 생성
    // 기존 스타일을 깨지 않기 위해 최대한 단순하게 구성했습니다.
    item.innerHTML = `
        <div class="word-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold;">${searchWord}📌</span>
            <span class="toggle-icon" style="font-size: 0.8em; opacity: 0.7;">▼</span> 
        </div>
        
        <div class="word-body" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1);">
            <p class="loading-msg" style="margin: 0; font-size: 0.9em; opacity: 0.7;">검색 중...</p>
        </div>
    `;

    wordList.prepend(item);

    // 2. 클릭 이벤트 (열고 닫기)
    const header = item.querySelector(".word-header");
    const body = item.querySelector(".word-body");
    const icon = item.querySelector(".toggle-icon");

    header.addEventListener("click", () => {
        if (body.style.display === "none") {
            body.style.display = "block";
            icon.innerText = "▲";
        } else {
            body.style.display = "none";
            icon.innerText = "▼";
        }
    });

    // 3. 서버 요청
    fetch(`${MEANING_URL}?word=${searchWord}`)
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            return res.json();
        })
        .then(data => {
            let definitionsHtml = "";
            if (Array.isArray(data.definitions)) {
                // 리스트 스타일도 최대한 기본값으로 유지
                if (data.definitions.length === 0) {
                    definitionsHtml = "<div style='opacity:0.6;'>뜻이 없습니다.</div>";
                } else {
                    definitionsHtml = `<ul style="padding-left: 18px; margin: 5px 0;">` + 
                                      data.definitions.map(def => `<li>${def}</li>`).join('') + 
                                      `</ul>`;
                }
            } else {
                definitionsHtml = `<p>${data.definitions}</p>`;
            }

            // 내용 업데이트 (저장 버튼 포함)
            // [중요] 저장 버튼 클래스 save-btn 유지 (기존 CSS 적용되도록)
            body.innerHTML = `
                <div style="margin-bottom: 8px; font-size: 0.95em;">
                    ${definitionsHtml}
                </div>
                <button class="save-btn" style="width: 100%; margin-top: 5px; cursor: pointer;">
                    단어장에 저장
                </button>
            `;
        })
        .catch(error => {
            console.error(error);
            body.innerHTML = `<p style="color: red; margin: 0;">에러: ${error.message}</p>`;
        });
}

function showTranslationBoxes(shouldShow) {
    lineBoxes.forEach(box => {
        box.style.opacity = shouldShow ? '1' : '0'; 
        box.style.visibility = shouldShow ? 'visible' : 'hidden';
    });
}

// 저장 버튼 클릭 처리
if (wordList) {
    wordList.addEventListener("click", (e) => {
        if (e.target.classList.contains("save-btn")) {
            const item = e.target.closest(".word-item");
            // word-header 안의 span에서 텍스트를 가져옴
            const word = item.querySelector(".word-header span").innerText;
            saveWord(word);
        }
    });
}

function saveWord(word) {
    let saved = JSON.parse(localStorage.getItem("savedWords") || "[]");
    if (!saved.includes(word)) {
        saved.push(word);
        localStorage.setItem("savedWords", JSON.stringify(saved));
        alert(`"${word}" 저장 완료`);
    } else {
         alert(`이미 저장된 단어입니다.`);
    }
}

if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
        showTranslationBoxes(false); 
        setTimeout(() => {
            sidebar.classList.add("hidden");
        }, 300);
    });
}
showTranslationBoxes(false);