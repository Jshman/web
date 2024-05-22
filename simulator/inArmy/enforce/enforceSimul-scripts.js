// 난수 생성
function getRandom() {
    return Math.random();
}

// 두 값 사이의 정수 난수 생성하기
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 최댓값은 제외, 최솟값은 포함
}

// 두 값 사이의 실수 난수 생성하기
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function Max(a, b) {
    return a > b ? a : b;
}


// 강화 시도 함수
function tryLevelUp(levelId, maxScoreId) {

    const currentLevelElement = document.getElementById(levelId);
    const currentMaxScoreElement = document.getElementById(maxScoreId);

    if (!currentLevelElement || !currentMaxScoreElement) {
        console.error('Element with ID ' + levelId + ' or ' + maxScoreId + ' not found.');
        return;
    } 

    // 90% 확률로 성공
    // 성공 -> 레벨 +1
    // 실패 -> 레벨 0으로 초기화
//    let curnlvl = parseInt(currentLevel);
    let currentLevel = parseInt(currentLevelElement.innerText, 10);
    const percent = getRandomInt(0, 99);

    if (percent <= 90) {
        let lvl = currentLevel + 1;
        currentLevelElement.innerText = lvl;
        if((currentLevel + 1)%5 == 0){animateLevelText(levelId);}        
        if((currentLevel + 1)%10 == 0){displayStars();}
    }
    else {
//    animateFailure(levelId)
    currentMaxScoreElement.innerText = Max(currentLevel, parseInt(currentMaxScoreElement.innerText));
    initializeLevel(levelId);}
    
    console.log("함수가 실행되었습니다.");

}

function initializeLevel(levelId) {
    document.getElementById(levelId).innerText = '0';
}



// 각 버튼에 이벤트 리스너 설정
document.getElementById('enforceBtn').addEventListener('click', function() {
  tryLevelUp('level', 'max_score');
});







// 시각적 이펙트 함수들


// 스타 버스터즈!
function displayStars() {
    var defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 150);
    setTimeout(shoot, 300);
}


// firework 폭죽 함수
function displayFirework() {
  var duration = 15 * 100;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };
  //  startVelocity: 범위, spread: 방향, ticks: 갯수

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var interval = setInterval(function () {
    var timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    );
  }, 250);
}



// 강화 성공 후 레벨 텍스트 애니메이션
function animateLevelText(levelId) {
    const levelElement = document.getElementById(levelId);
    levelElement.style.transition = 'transform 0.2s ease-in-out';
    levelElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        levelElement.style.transform = 'scale(1)';
    }, 200);
}

// 강화 실패 시 텍스트 깨지는 애니메이션
function animateFailure(levelId) {
    const levelElement = document.getElementById(levelId);
    levelElement.style.transition = 'transform 0.2s ease-in-out';
    levelElement.style.transform = 'scale(0)';
    setTimeout(() => {
        levelElement.style.transform = 'scale(1)';
    }, 200);
}
