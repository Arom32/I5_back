// -------------------------- [설정] --------------------------
// urls.py에 설정된 URL과 일치해야 합니다.
const MEANING_URL = "/converter/meaning/"; 

// -------------------------- 요소 선택 --------------------------
const page = document.getElementById("document-page");
const sidebar = document.getElementById("sidebar");
const wordList = document.getElementById("word-list"); 
const closeBtn = document.getElementById("closePanel");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const filterButtons = document.querySelectorAll('.translation-filter .filter-btn');
// -------------------------- 문서 줌 기능 --------------------------
let scale = 1;

if (zoomInBtn) {
    zoomInBtn.onclick = () => {
        scale = Math.min(2.0, scale + 0.1); 
        if (page) page.style.transform = `scale(${scale})`;
    };
}

if (zoomOutBtn) {
    zoomOutBtn.onclick = () => {
        scale = Math.max(0.5, scale - 0.1); 
        if (page) page.style.transform = `scale(${scale})`;
    };
}

/* ------------------------- 
   본문 단어 클릭 이벤트 (여기가 핵심입니다!)
------------------------- */
document.addEventListener("click", (e) => {
    // 클릭한 요소가 'word' 클래스를 가지고 있는지 확인
    if (e.target.classList.contains("word")) {
        const rawWord = e.target.innerText;
        // 특수문자 제거
        const cleanWord = rawWord.replace(/[^가-힣a-zA-Z0-9]/g, "").trim();

        if (!cleanWord) return;

        console.log("단어 클릭됨:", cleanWord); // 디버깅용 로그

        openSidebar(); // 사이드바 열기
        
        // 이미 목록에 있는 단어면 깜빡임 효과만 주고 종료
        if (highlightExistingWord(cleanWord)) return;

        // 서버에 뜻 요청하고 목록에 추가
        fetchAndAddWord(cleanWord);
    }
});

// 사이드바 열기 함수
function openSidebar() {
    if (sidebar) {
        sidebar.classList.remove("hidden");
        // 애니메이션을 위해 약간의 지연 후 open 클래스 추가
        setTimeout(() => {
            sidebar.classList.add("open");
        }, 10);
    }
}

// 이미 검색한 단어인지 확인하는 함수
function highlightExistingWord(word) {
    if (!wordList) return false;
    const items = wordList.querySelectorAll('.word-item');
    for (let item of items) {
        // 헤더의 텍스트에서 '📌' 등을 제외하고 비교
        const titleSpan = item.querySelector('.word-header span'); 
        if (titleSpan) {
            // "가다📌" -> "가다" 로 텍스트만 추출해서 비교
            const currentTitle = titleSpan.innerText.replace(/[📌]/g, '').trim();
            if (currentTitle === word) {
                // 강조 효과
                item.style.opacity = "0.5";
                setTimeout(() => { item.style.opacity = "1"; }, 300);
                
                // 닫혀있으면 열어주기
                const body = item.querySelector(".word-body");
                const icon = item.querySelector(".toggle-icon");
                if(body && body.style.display === "none"){
                    body.style.display = "block";
                    if(icon) icon.innerText = "▲";
                }
                
                // 해당 위치로 스크롤 이동
                item.scrollIntoView({ behavior: "smooth", block: "center" });
                return true;
            }
        }
    }
    return false;
}

/* -------------------------
   단어 추가 및 서버 요청 함수 (제목 수정 기능 포함)
------------------------- */
function fetchAndAddWord(searchWord) {
    if (!wordList) {
        console.error("word-list 요소를 찾을 수 없습니다.");
        return;
    }

    // 1. 단어 카드 틀 만들기
    const item = document.createElement("div");
    item.className = "word-item"; 

    // 처음에는 클릭한 단어(searchWord)로 제목 표시
    item.innerHTML = `
        <div class="word-header" style="cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold;">${searchWord}📌</span>
            <span class="toggle-icon" style="font-size: 0.8em; opacity: 0.7;">▼</span> 
        </div>
        
        <div class="word-body" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1);">
            <p class="loading-msg" style="margin: 0; font-size: 0.9em; opacity: 0.7;">검색 중...</p>
        </div>
    `;

    // 목록의 맨 위에 추가
    wordList.prepend(item);

    // 2. 아코디언(접기/펴기) 기능 연결
    const header = item.querySelector(".word-header");
    const body = item.querySelector(".word-body");
    const icon = item.querySelector(".toggle-icon");

    // 카드가 추가되면 자동으로 열리게 설정 (선택 사항)
    body.style.display = "block";
    icon.innerText = "▲";

    header.addEventListener("click", () => {
        if (body.style.display === "none") {
            body.style.display = "block";
            icon.innerText = "▲";
        } else {
            body.style.display = "none";
            icon.innerText = "▼";
        }
    });

    // 3. 서버에 뜻 요청
    fetch(`${MEANING_URL}?word=${searchWord}`)
        .then(res => {
            if (!res.ok) throw new Error("네트워크 응답에 문제가 있습니다.");
            return res.json();
        })
        .then(data => {
            // ★ [제목 업데이트] 서버에서 정리해준 단어(cleaned_word)가 있으면 교체
            if (data.word && data.word.trim() !== "") {
                const titleSpan = item.querySelector(".word-header span");
                if(titleSpan) titleSpan.innerText = `${data.word}📌`;
            }

            // 뜻 목록 HTML 생성
            let definitionsHtml = "";
            if (Array.isArray(data.definitions)) {
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
            console.error("Fetch error:", error);
            body.innerHTML = `<p style="color: red; margin: 0;">오류: 정보를 가져올 수 없습니다.</p>`;
        });
}

// -------------------------- 저장 버튼 기능 --------------------------
if (wordList) {
    wordList.addEventListener("click", (e) => {
        // 동적으로 생성된 버튼이므로 이벤트 위임 사용
        if (e.target.classList.contains("save-btn")) {
            const item = e.target.closest(".word-item");
            // 📌 제거하고 텍스트만 가져오기
            const rawText = item.querySelector(".word-header span").innerText;
            const wordToSave = rawText.replace("📌", "").trim();
            
            saveWord(wordToSave);
        }
    });
}

function saveWord(word) {
    // 로컬 스토리지 사용 (필요시 서버 DB 저장 로직으로 변경 가능)
    let saved = JSON.parse(localStorage.getItem("savedWords") || "[]");
    if (!saved.includes(word)) {
        saved.push(word);
        localStorage.setItem("savedWords", JSON.stringify(saved));
        alert(`"${word}" 단어장에 저장되었습니다.`);
    } else {
         alert(`이미 저장된 단어입니다.`);
    }
}

// -------------------------- 닫기 버튼 기능 --------------------------
if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
        setTimeout(() => {
            sidebar.classList.add("hidden");
        }, 300); // CSS transition 시간과 맞춤
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 모든 버튼에서 active 제거
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 active 추가
        button.classList.add('active');
        if(this.textContent === '단어') {
            searchTitle.textContent = '단어 검색';
            searchDesc.textContent = '어려운 단어를 입력하면 단어의 뜻을 제공합니다.';
        } else {
            // <a href="{% url 'converter:upload'%}"> 문서 변환 페이지로 이동</a>
            window.location.href = '/words/dictionary/';
        }
    });
});
