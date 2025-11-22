document.addEventListener("DOMContentLoaded", () => {

    // 1. HTML에 있는 id="login-form"을 찾습니다.
    const loginForm = document.getElementById("login-form");
    
    // 입력창 2개 (로그인은 아이디/비번만 필요)
    const useridInput = document.getElementById("username");
    const userpwInput = document.getElementById("password");

    // 에러 메시지 2개
    const idError = document.getElementById("id-error");
    const pwError = document.getElementById("pw-error");

    
    // 2. '로그인' 버튼을 눌렀을 때(submit) 실행될 함수
    loginForm.addEventListener("submit", (event) => {
        
        // 새로고침 방지
        event.preventDefault(); 
        
        // (B) 검사하기 전에 에러 메시지 초기화
        idError.textContent = "";
        pwError.textContent = "";

        // 모든 검사가 통과했는지 기억할 변수
        let isValid = true; 

        // 1. 아이디 검사
        if (useridInput.value.trim() === "") {
            idError.textContent = "아이디를 입력해 주세요.";
            isValid = false;
        }

        // 2. 비밀번호 검사
        if (userpwInput.value.trim() === "") {
            pwError.textContent = "비밀번호를 입력해 주세요.";
            isValid = false;
        }

        // isValid 변수가 true라면 로그인 성공 처리
        if (isValid) {
            alert("로그인 성공!");
            loginForm.submit();
        }
        
    });
});