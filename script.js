let score = 0;
let timeLeft = 30.00;
let timerId = null;
let moleTimerId = null;

const maxScore = 30;
// 출현 주기를 0.68초로 단축 (30점 달성 시 약 20.4초 소요되어 최대 9.6초, 최소 8초 이상 남기기 가능)
const spawnInterval = 680; 

const holes = document.querySelectorAll('.hole');

// 각 구멍 클릭 이벤트 바인딩
holes.forEach(hole => {
    const mole = hole.querySelector('.mole');
    const bomb = hole.querySelector('.bomb');

    // 두더지 클릭
    mole.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.classList.contains('show-mole')) {
            score++;
            document.getElementById('score').innerText = score;
            hole.classList.remove('show-mole');
            
            if (score >= maxScore) {
                endGame(true, `축하합니다! 30점을 달성하셨습니다! (남은 시간: ${timeLeft.toFixed(2)}초)`);
            }
        }
    });

    // 폭탄 클릭 (즉시 패배)
    bomb.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hole.classList.contains('show-bomb')) {
            endGame(false, "폭탄을 눌렀습니다! 게임 오버!");
        }
    });
});

function randomHole() {
    // 1. 모든 구멍 상태 초기화
    holes.forEach(hole => {
        hole.classList.remove('show-mole', 'show-bomb');
    });

    // 2. 무조건 두더지 1개 등장 (랜덤 위치)
    const moleIndex = Math.floor(Math.random() * holes.length);
    holes[moleIndex].classList.add('show-mole');

    // 3. 폭탄 확률을 10%로 낮춤 (난이도 하향)
    if (Math.random() < 0.10) {
        let bombIndex;
        do {
            bombIndex = Math.floor(Math.random() * holes.length);
        } while (bombIndex === moleIndex); // 두더지와 겹치지 않도록 처리

        holes[bombIndex].classList.add('show-bomb');
    }
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
    holes.forEach(hole => hole.classList.remove('show-mole', 'show-bomb'));
    
    // 남은 시간이 15.00초를 초과하여 성공했을 경우 15.00초로 보정 처리
    if (isWin && timeLeft > 15.00) {
        timeLeft = 15.00;
        document.getElementById('time-left').innerText = "15.00";
        message = `축하합니다! 30점을 달성하셨습니다! (남은 시간: 15.00초)`;
    }

    alert(message);
    document.getElementById('start-btn').disabled = false;
}
