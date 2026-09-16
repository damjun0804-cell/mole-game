let score = 0;
let timeLeft = 10;
let timerId = null;
let moleTimerId = null;
let currentHole = null;

// 구멍 9개 요소 생성
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
    timeLeft = 10;
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
            clearInterval(timerId);
            clearInterval(moleTimerId);
            holes.forEach(hole => hole.classList.remove('up'));
            alert(`게임 종료! 최종 점수: ${score}점`);
            document.getElementById('start-btn').disabled = false;
        }
    }, 1000);
}
