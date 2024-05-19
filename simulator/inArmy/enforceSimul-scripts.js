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


// 강화 시도 함수
function tryLevelUp(levelId) {

    const currentLevelElement = document.getElementById(levelId);

    if (!currentLevelElement) {
        console.error('Element with ID ' + levelId + ' not found.');
        return;
    } 

    // 75% 확률로 성공
    // 성공 -> 강화레벨 +1
    // 실패 -> 강화레벨 0으로 초기화
//    let curnlvl = parseInt(currentLevel);
    let currentLevel = parseInt(currentLevelElement.innerText, 10);
    const percent = getRandomInt(0, 99);

    if (percent <= 75) {currentLevelElement.innerText = currentLevel + 1;}
    else {initializeLevel(levelId);}
    
    console.log("함수가 실행되었습니다.");

//  timerElement.innerText = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function initializeLevel(levelId) {
    document.getElementById(levelId).innerText = '0';
}



// 각 버튼에 이벤트 리스너 설정
document.getElementById('enforceBtn').addEventListener('click', function() {
  tryLevelUp('level');
});
