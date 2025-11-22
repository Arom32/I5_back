document.addEventListener('DOMContentLoaded', () => {
    // --- [DOM 요소 선택] ---
    const closeBtn = document.querySelector('.close-btn');
    const progressFill = document.querySelector('.progress-fill');
    const header = document.querySelector('.header');
    
    const questionWord = document.getElementById('question-word');
    const optionsArea = document.getElementById('options-area');
    const scoreDisplay = document.getElementById('score-display');
    const feedbackMsg = document.getElementById('feedback-msg');

    // --- [설정값 가져오기] ---
    const config = window.GAME_CONFIG || { urls: {} };

    // --- [상태 변수 관리] ---
    const TOTAL_TIME = 30; 
    let state = {
        gameId: config.gameId,
        wordId: null,
        timeLeft: TOTAL_TIME, 
        timerId: null,
        isProcessing: false 
    };

    // --- [UI 초기화: 타이머 요소 생성] ---
    const timerEl = document.createElement('span');
    timerEl.className = 'timer';
    timerEl.textContent = '00:30';
    
    // CSS 스타일링
    timerEl.style.fontWeight = 'bold';
    timerEl.style.fontSize = '1.2rem';
    
    if (header) {
        header.insertBefore(timerEl, header.children[1]);
    }

    // --- [유틸리티: 쿠키 가져오기] ---
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

    // --- [1. 타이머 로직 (수정됨)] ---
    function updateTimerUI() {
        // 분:초 텍스트 업데이트
        const minutes = Math.floor(state.timeLeft / 60);
        const seconds = state.timeLeft % 60;
        timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // 프로그레스 바 업데이트 (남은 시간 비율)
        if (progressFill) {
            const percentage = (state.timeLeft / TOTAL_TIME) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    function startTimer() {
        // 초기 UI 설정
        updateTimerUI();

        // 1초마다 실행
        state.timerId = setInterval(() => {
            state.timeLeft--; // 시간 감소

            if (state.timeLeft >= 0) {
                updateTimerUI();
            }

            // 시간 종료 체크
            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                finishGame(); // 게임 종료 함수 호출
            }
        }, 1000);
    }

    // --- [2. 퀴즈 로드 로직] ---
    async function loadQuiz() {
        // 시간이 다 되었으면 퀴즈 로드 중단
        if (state.timeLeft <= 0) return;

        try {
            state.isProcessing = false;
            const res = await fetch(config.urls.getQuiz);
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // 데이터 적용
            state.wordId = data.word_id;
            if (questionWord) 
                questionWord.innerText = data.quiz_word;
            if (feedbackMsg) 
                feedbackMsg.innerHTML = "&nbsp;"; // 공백 유지

            // 버튼 생성
            if (optionsArea) {
                optionsArea.innerHTML = ''; 
                data.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn'; 
                    btn.innerText = opt.text;
                    
                    // 클릭 이벤트
                    btn.addEventListener('click', () => checkAnswer(opt.id, btn));
                    optionsArea.appendChild(btn);
                });
            }

        } catch (e) {
            console.error("Quiz Load Error:", e);
        }
    }

    // --- [3. 정답 체크 로직] ---
    async function checkAnswer(selectedId, btnElement) {
        if (state.isProcessing || state.timeLeft <= 0) return;
        state.isProcessing = true;

        // 버튼 잠금
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.style.pointerEvents = 'none');
        btnElement.classList.add('selected');

        try {
            const res = await fetch(config.urls.check, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    game_id: state.gameId,
                    word_id: state.wordId,
                    selected_id: selectedId
                })
            });

            const data = await res.json();

            // 결과 표시
            if (data.is_correct) {
                if(feedbackMsg) {
                    feedbackMsg.innerText = "정답!";
                    feedbackMsg.style.color = "#4CAF50";
                }
                btnElement.style.backgroundColor = "#d4edda"; 
                btnElement.style.borderColor = "#28a745";
                if (scoreDisplay) scoreDisplay.innerText = data.current_score;
            } else {
                if(feedbackMsg) {
                    feedbackMsg.innerText = "오답!";
                    feedbackMsg.style.color = "#ff5252";
                }
                btnElement.style.backgroundColor = "#ffebee";
                btnElement.style.borderColor = "#ff5252";
            }

            // 다음 문제로 이동 (시간이 남았을 때만)
            if (state.timeLeft > 0) {
                setTimeout(loadQuiz, 600);
            } else {
                // 타이밍 이슈로 시간이 0 이하가 되면 바로 종료
                finishGame();
            }

        } catch (e) {
            console.error(e);
            state.isProcessing = false;
        }
    }

    // --- [4. 게임 종료 로직] ---
    function finishGame() {
        // 중복 호출 방지를 위해 타이머 확실히 제거
        clearInterval(state.timerId);
        window.location.href = `${config.urls.result}?game_id=${state.gameId}`;
    }   

    // --- [초기 실행] ---
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // 타이머 일시 정지 (선택 사항)
            // clearInterval(state.timerId); 
            
            if (confirm('게임을 종료하시겠습니까?')) {
                clearInterval(state.timerId);
                window.history.back();
            } else {
                // 취소 시 타이머 재개 로직이 필요하다면 여기에 추가
                // 현재는 그냥 계속 흘러감
            }
        });
    }

    loadQuiz();
    startTimer();
});