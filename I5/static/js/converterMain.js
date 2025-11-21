document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('file-upload');
    const filterButtons = document.querySelectorAll('.translation-filter .filter-btn');
    const uploadForm = document.getElementById('upload-form');
    // 1. 문서 업로드 버튼 클릭 시 파일 입력창 열기
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // 2. 파일 선택 시 다음으로 넘어가는 거
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length > 0) {
            const fileName = event.target.files[0].name;
            if (uploadForm) {
                console.log("폼 제출 시작")
                uploadForm.submit(); // 폼 제출
            }else{
                console.error("업로드 폼을 찾을 수 없습니다.");
            }
        }
    });

    // 3. 필터 버튼 활성화/비활성화
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 버튼에서 active 제거
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 클릭된 버튼에 active 추가
            button.classList.add('active');
        
        });
    });
});