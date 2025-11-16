document.addEventListener("click", (e) => {
  // [수정] document 전체에 클릭 이벤트 리스너를 추가
  const sidebar = document.getElementById("dictionary-sidebar");
  const sidebarContent = document.getElementById("dictionary-content");

  // 1. 단어(.word)를 클릭했을 때
  if (e.target.classList.contains("word")) {
    const word = e.target.innerText;

    // 로딩 중 표시
    sidebarContent.innerHTML = `<p><strong>${word}</strong> 검색 중...</p>`;
    sidebar.style.display = "block"; // 사이드바 보이기

    // [수정] 하드코딩된 URL 대신, html에서 넘겨준 MEANING_URL 변수 사용
    fetch(`${MEANING_URL}?word=${word}`)
      .then(res => {
        if (!res.ok) { // 500 에러 등
          throw new Error(`서버 응답 오류: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // [수정] views.py에서 보낸 data.definitions (리스트)를 처리
        let definitionsHtml = "";
        
        // data.definitions가 배열인지 확인
        if (Array.isArray(data.definitions)) {
          definitionsHtml = data.definitions.map(def => `<li>${def}</li>`).join('');
        } else {
          definitionsHtml = "<li>뜻을 불러오는 데 실패했습니다.</li>";
        }

        // [수정] data.word (views.py에서 보낸 정리된 단어) 사용
        sidebarContent.innerHTML = `
          <strong>${data.word}</strong>
          <ol>
            ${definitionsHtml}
          </ol>
        `;
      })
      .catch(error => {
        // 네트워크 오류 등
        console.error("Fetch error:", error);
        sidebarContent.innerHTML = `<p>오류 발생: ${error.message}</p>`;
      });
  }

  // 2. 닫기 버튼(#close-sidebar)을 클릭했을 때
  if (e.target.id === "close-sidebar") {
    sidebar.style.display = "none"; // 사이드바 숨기기
  }

});