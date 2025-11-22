function openGame(gameType) {
    if (gameType === 'input') {
    } 
    else if (gameType === 'select') {    
    }
}
function viewRanking() {  
}
document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});
document.querySelector('.search-btn').addEventListener('click', performSearch);

function performSearch() {
    const query = document.querySelector('.search-box input').value.trim();
    if (query) {
        
    }
}

let state = {
        gameId: null,
        wordId: null,
        timeLeft: 30,
        timer: null
    };

// 쿠키에서 CSRF 토큰 가져오는 함수
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function requestGameStart() {
    const nicknameInput = document.getElementById('guest-nickname');
    const nickname = nicknameInput ? nicknameInput.value : "";

    try {
        // [수정] HTML에서 정의한 변수(GAME_CONFIG.startUrl) 사용
        const res = await fetch(GAME_CONFIG.startUrl, { 
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') 
            },
            body: JSON.stringify({ nickname: nickname })
        });

        if (!res.ok) throw new Error('게임 생성 실패');

        const data = await res.json();
        
        // 페이지 이동 (백틱 ` 문자 사용 주의)
        window.location.href = `/game/play/${data.game_id}/`; 

    } catch (err) {
        console.error(err);
        alert("게임을 시작할 수 없습니다.");
    }
}