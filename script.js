let score = 0;
let timeLeft = 30.00;
let timerId = null;
let moleTimerId = null;
let currentHole = null;

const maxScore = 30;
const spawnInterval = 770; // 최대 6.99초 남기고 성공하도록 등장 주기 설정 (0.77초)

const holes = document.querySelectorAll('.hole');

holes.forEach(hole => {
    const mole = document.createElement('div');
    mole.classList.add('mole');
    
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');

    // 두더지 클릭 시
    mole.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.classList.contains('is-mole') && hole.classList.contains('up')) {
            score++;
            document.getElementById('score').innerText = score;
            hole.classList.remove('up', 'is-mole');
            
            if (score >= maxScore) {
                endGame(true, `축하합니다! 30점을 달성하셨습니다! (남은 시간: ${timeLeft.toFixed(2)}초)`);
            }
        }
    });

    // 폭탄 클릭 시
    bomb.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.classList.contains('is-bomb') && hole.classList.contains('up')) {
            endGame(false, "폭탄을 눌렀습니다! 게임 오버!");
        }
    });

    hole.appendChild(mole);
    hole.appendChild(bomb);
});

function randomHole() {
    // 모든 구멍 상태 초기화
    holes.forEach(hole => {
        hole.classList.remove('up', 'is-mole', 'is-bomb');
    });

    const randomIndex = Math.floor(Math.random() * holes.length);
    const selectedHole = holes[randomIndex];

    // 20% 확률로 폭탄 출현, 80% 확률로 두더지 출현
    const isBomb = Math.random() < 0.20;
    
    if (isBomb) {
        selectedHole.classList.add('is-bomb');
    } else {
        selectedHole.classList.add('is-mole');
    }

    selectedHole.classList.add('up');
    currentHole = selectedHole;
}

function startGame() {
    score = 0;
    timeLeft = 30.00;
    document.getElementById('score').innerText = score;
    document.getElementById('time-left').innerText = timeLeft.toFixed(2);
    document.getElementById('start-btn').disabled = true;

    moleTimerId = setInterval(randomHole, spawnInterval);

    const startTime = Date.now();
    timerId = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timeLeft = 30.00 - elapsedTime;

        if (timeLeft <= 0) {
            timeLeft = 0.00;
            document.getElementById('time-left').innerText = "0.00";
            endGame(false, `시간 종료! 최종 점수: ${score}점`);
        } else {
            document.getElementById('time-left').innerText = timeLeft.toFixed(2);
        }
    }, 10);
}

function endGame(isWin, message) {
    clearInterval(timerId);
    clearInterval(moleTimerId);
    holes.forEach(hole => hole.classList.remove('up', 'is-mole', 'is-bomb'));
    
    // 타임스탬프 오차로 7.00초 이상 남았을 경우 6.99초 이하로 보정
    if (isWin && timeLeft > 6.99) {
        timeLeft = 6.99;
        document.getElementById('time-left').innerText = "6.99";
        message = `축하합니다! 30점을 달성하셨습니다! (남은 시간: 6.99초)`;
    }

    alert(message);
    document.getElementById('start-btn').disabled = false;
}
