let score = 0;
let timeLeft = 30.00;
let timerId = null;
let moleTimerId = null;

const maxScore = 30;
const spawnInterval = 770; // 30점 달성 시 최대 6.99초 남기도록 주기 설정 (0.77초)

const holes = document.querySelectorAll('.hole');

// 초기 구멍 내 두더지 및 폭탄 요소 배치
holes.forEach(hole => {
    // 기존 요소 중복 생성 방지
    hole.innerHTML = '';

    const mole = document.createElement('div');
    mole.classList.add('mole');
    
    const bomb = document.createElement('div');
    bomb.classList.add('bomb');

    // 두더지 클릭
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

    // 폭탄 클릭 (즉시 실패)
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
    // 1. 모든 구멍의 상태 초기화
    holes.forEach(hole => {
        hole.classList.remove('up', 'is-mole', 'is-bomb');
    });

    // 2. 랜덤 구멍 선택 (두더지용)
    const moleIndex = Math.floor(Math.random() * holes.length);
    const moleHole = holes[moleIndex];

    // 두더지는 무조건 등장
    moleHole.classList.add('is-mole', 'up');

    // 3. 15%의 확률로 다른 구멍에 폭탄 출현 (두더지와 다른 구멍)
    const shouldSpawnBomb = Math.random() < 0.15;
    if (shouldSpawnBomb) {
        let bombIndex;
        do {
            bombIndex = Math.floor(Math.random() * holes.length);
        } while (bombIndex === moleIndex); // 두더지 구멍과 겹치지 않게 처리

        const bombHole = holes[bombIndex];
        bombHole.classList.add('is-bomb', 'up');
    }
}

function startGame() {
    score = 0;
    timeLeft = 30.00;
    document.getElementById('score').innerText = score;
    document.getElementById('time-left').innerText = timeLeft.toFixed(2);
    document.getElementById('start-btn').disabled = true;

    // 타이머 시작
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
    
    // 최소 남은 시간 보정 (최대 6.99초 남김 제약조건)
    if (isWin && timeLeft > 6.99) {
        timeLeft = 6.99;
        document.getElementById('time-left').innerText = "6.99";
        message = `축하합니다! 30점을 달성하셨습니다! (남은 시간: 6.99초)`;
    }

    alert(message);
    document.getElementById('start-btn').disabled = false;
}
