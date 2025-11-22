

// 로그아웃 처리 함수
function handleLogout() {
    const buttonGroup = document.querySelector('.button-group');
    const message = document.querySelector('.message');
    const form = document.getElementById('logout-form');

    // 1. 버튼 그룹 삭제 (DOM Manipulation)
    buttonGroup.style.display = 'none';

    // 2. 메시지 변경
    message.textContent = "로그아웃 되었습니다. 안녕히 가세요!";

    setTimeout(() => {
        form.submit(); 
    }, 1500);
}
