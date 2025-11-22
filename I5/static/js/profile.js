document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('openModalBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('profileModal');

    // 1. 모달 열기
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // 2. 모달 닫기 (X 버튼)
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }

    // 3. 모달 닫기 (배경 클릭)
    if (modal) {
        modal.addEventListener('click', function(e) {
            // 클릭한 요소(e.target)가 모달 배경(modal-overlay)일 때만 닫기
            // 모달 내부(modal-content)를 클릭했을 때는 닫히지 않아야 함
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});