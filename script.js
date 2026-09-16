let score = 0;
let timeLeft = 30.00;
let timerId = null;
let moleTimerId = null;
let currentHole = null;

const maxScore = 30;
// 최소 소요시간을 23.01초로 제한하여, 유저가 아무리 빨리 눌러도 남은 시간이 최대 6.99초가 되도록 설정
const spawnInterval = 770; // 0.77초 마다 등장 (30회 * 0.77s = 23.10s 소요 -> 남은 시간 6.90s)

const holes = document.querySelectorAll('.hole');

// 각 구멍에 두더지 및 폭탄 요소 생성
holes.forEach(hole => {
    const mole = document.createElement('div');
    mole.classList.add('mole');
    
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');

    // 두더지 클릭 시
    mole.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.dataset.type === 'mole' && hole.classList.contains('up')) {
            score++;
            document.getElementById('score').innerText = score;
            hole.classList.remove('up');
            
            if (score >= maxScore) {
                // 남은 시간이 6.99초를 초과하지 않도록 검증 후 종료
                endGame(true, `축하합니다! 30점을 달성하셨습니다! (남은 시간: ${timeLeft.toFixed(2)}초)`);
            }
        }
    });

    // 폭탄 클릭 시 즉시 실패
    bomb.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.dataset.type === 'bomb' && hole.classList.contains('up')) {
            endGame(false, "폭탄을 눌렀습니다! 게임 오버!");
        }
    });

    hole.appendChild(mole);
    hole.appendChild(bomb);
});

function randomHole() {
    holes.forEach(hole => {
        hole.classList.remove('up');
        hole.dataset.type = '';
    });

    const randomIndex = Math.floor(Math.random() * holes.length);
    const selectedHole = holes[randomIndex];

    // 25% 확률로 폭탄 출현, 75% 확률로 두더지 출현
    const isBomb = Math.random() < 0.25;
    
    if (isBomb) {
        selectedHole.dataset.type = 'bomb';
    } else {
        selectedHole.dataset.type = 'mole';
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

    // 두더지/폭탄 생성 타이머 (0.77초 주기)
    moleTimerId = setInterval(randomHole, spawnInterval);

    // 0.01초(10ms) 단위 카운트다운 타이머
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
    holes.forEach(hole => hole.classList.remove('up'));
    
    // 타임스탬프 계산상 혹시라도 7.00초 이상 남은 상태에서 완료되었을 경우 6.99초 이하로 강제 보정
    if (isWin && timeLeft > 6.99) {
        timeLeft = 6.99;
        document.getElementById('time-left').innerText = "6.99";
        message = `축하합니다! 30점을 달성하셨습니다! (남은 시간: 6.99초)`;
    }

    alert(message);
    document.getElementById('start-btn').disabled = false;
}
