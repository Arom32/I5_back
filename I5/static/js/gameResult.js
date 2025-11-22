// document.addEventListener('DOMContentLoaded', () => {
//     const retryButton = document.querySelector('.retry-btn');    
//     const closeButton = document.querySelector('.close-btn');
//     const timerElement = document.querySelector('.timer');
//     const progressBar = document.querySelector('.progress-bar');
    
//     // 게임 시간 설정 (초 단위)
//     const totalTime = 30; // 30초
//     let elapsedTime = 0;
    
//     // setInterval로 타이머 시작
// //     const timerInterval = setInterval(() => {
// //         elapsedTime++;
        
//         // 분:초 형식으로 표시
//         const minutes = Math.floor(elapsedTime / 60);
//         const seconds = elapsedTime % 60;
//         const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
//         timerElement.textContent = formattedTime;
        
//         // 진행 바 업데이트 (왼쪽에서 오른쪽으로 늘어남)
//         // const progress = (elapsedTime / totalTime) * 100;
//         // progressBar.style.width = `${progress}%`;
        
//         // 시간이 다 되면 정지
//         if (elapsedTime >= totalTime) {
//             clearInterval(timerInterval);
//             alert('시간이 종료되었습니다!');
//         }
//     }, 1000);
    
//     // 다시 도전 버튼
//     retryButton.addEventListener('click', () => {
//         alert('다시 도전합니다!');
//     });
    
//     // 닫기 버튼
//     closeButton.addEventListener('click', () => {
//         clearInterval(timerInterval);
//         // 게임 종료 로직
//     });
    
//     // 점수 업데이트 함수
//     // function updateScore(newScore) {
//     //     const scoreElement = document.getElementById('current-score');
//     //     scoreElement.textContent = `${newScore}점`;
//     // }
// });

