let score = 0;
let timeLeft = 30;
let timerId = null;
let moleTimerId = null;
let currentHole = null;

const maxScore = 30;

// 구멍 9개 요소 생성 및 클릭 이벤트 설정
const holes = document.querySelectorAll('.hole');
holes.forEach(hole => {
    const mole = document.createElement('div');
    mole.classList.add('mole');
    mole.addEventListener('click', () => {
        if (hole === currentHole) {
            score++;
            document.getElementById('score').innerText = score;
            hole.classList.remove('up');
            currentHole = null;

            // 최대 점수 30점 도달 시 게임 승리 및 즉시 종료
            if (score >= maxScore) {
                endGame(true);
            }
        }
    });
    hole.appendChild(mole);
});

function randomHole() {
    holes.forEach(hole => hole.classList.remove('up'));
    
    const randomIndex = Math.floor(Math.random() * holes.length);
    const selectedHole = holes[randomIndex];
    selectedHole.classList.add('up');
    currentHole = selectedHole;
}

function startGame() {
    // 초기화
    score = 0;
    timeLeft = 30;
    document.getElementById('score').innerText = score;
    document.getElementById('time-left').innerText = timeLeft;
    document.getElementById('start-btn').disabled = true;

    // 0.8초마다 랜덤 위치에 두더지 등장
    moleTimerId = setInterval(randomHole, 800);

    // 1초마다 카운트다운
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;

        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(isWin) {
    clearInterval(timerId);
    clearInterval(moleTimerId);
    holes.forEach(hole => hole.classList.remove('up'));
    
    if (isWin) {
        alert(`축하합니다! 30점을 달성하여 성공하셨습니다! (남은 시간: ${timeLeft}초)`);
    } else {
        alert(`시간 종료! 최종 점수: ${score}점`);
    }
    
    document.getElementById('start-btn').disabled = false;
}
