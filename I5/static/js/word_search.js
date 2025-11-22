// 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // // 모든 탭에서 active 클래스 제거
        // tabButtons.forEach(btn => btn.classList.remove('active'));
        // // 클릭된 탭에 active 클래스 추가
        // this.classList.add('active');
        
        // // 탭에 따라 제목과 설명 변경
        // const searchTitle = document.querySelector('.search-word-tabs h2');
        // const searchDesc = document.querySelector('.search-word-tabs p');
        // const searchInput = document.querySelector('.mian-search-input-wrapper input');
        
        if(this.textContent === '단어') {
            window.location.href = '/words/dictionary/';
        } else {
            // searchTitle.textContent = '문서 검색';
            // searchDesc.textContent = '문서를 업로드하면 어려운 표현을 쉽게 변환해드립니다.';
            // searchInput.placeholder = '문서를 검색하세요...';
            window.location.href = '/converter/';
        }
    });
});

// 검색 입력 기능
const searchInput = document.querySelector('.mian-search-input-wrapper input');
const headerSearchInput = document.querySelector('.search-box input');

// 메인 검색창 엔터키 이벤트
if(searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// 헤더 검색창 엔터키 이벤트
if(headerSearchInput) {
    headerSearchInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') {
            performSearch(this.value);
        }
    });
}

// 헤더 검색 버튼 클릭 이벤트
const headerSearchBtn = document.querySelector('.search-btn');
if(headerSearchBtn) {
    headerSearchBtn.addEventListener('click', function() {
        performSearch(headerSearchInput.value);
    });
}

// 검색 실행 함수
function performSearch(query) {
    if(query.trim() === '') {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log('검색어:', query);
    //alert(`"${query}" 검색 결과를 표시합니다.`);
    // 여기서 실제 검색 API 호출 또는 결과 페이지로 이동
}