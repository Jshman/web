
//가로줄 채점
// 현재 위치(좌표) 입력 받아야 함.
// 반환값은 true, false
function gradeRow(row){
    //반복문으로 채점.
    //가로줄이므로 row는 고정시켜놓고 column을 움직이면서 탐색.
  
  //count sort 응용
  var numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var num;
  for (var step = 1; step < 10; step++) {
    // 각 셀의 input 값을 가져옴.
    num = parseInt(document.getElementById(("coor_" + row.toString() + "," + step.toString()).value));
    console.log("num: ", num, " 아 왜 안 되냐");
    numbers[num-1] += 1;
  }
  
  for (var idx = 0; idx < 10; idx++) {
    if (numbers[idx] > 1 || numbers[idx] == 0) {
      console.log("가로줄에서 실패 ", numbers[idx]);
      console.log("row: ",row);
      console.log("numbers: ",numbers.toString());
      
      return false;
    }
  }
  return true;
}


// 세로줄 채점
// 현재 위치(좌표) 입력 받아야 함.
// 반환값은 true, false
function gradeColumn(column){
  //row 값이 움직이면서 column이 완성 됐는지 확인.
  //count sort 응용
  var numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var num;
  for (var step = 1; step < 10; step++) {
    // 각 셀의 input 값을 가져옴.
    num = parseInt(document.getElementById(("coor_" + step.toString() + "," + column.toString()).value));
    numbers[num-1] += 1;
  }
  
  for (var idx = 0; idx < 10; idx++) {
    if (numbers[idx] > 1 || numbers[idx] == 0) {
      console.log("세로줄에서 실패 ", numbers[idx]);
      return false;
    }
  }
  return true;
}

//3 by 3 집 채점
function gradeHouse(row, column) {
    var numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    // 각 구역의 시작 좌표 계산
    const startRow = Math.floor((row - 1) / 3) * 3 + 1;
    const startColumn = Math.floor((column - 1) / 3) * 3 + 1;

    // 해당 구역 내의 숫자 채점
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startColumn; j < startColumn + 3; j++) {
            const num = parseInt(document.getElementById("coor_" + i.toString() + "," + j.toString()).value);
            if (isNaN(num) || num < 1 || num > 9 || ++numbers[num - 1] > 1) {
                console.log("구역에서 실패");
                return false;
            }
        }
    }

    // 모든 숫자가 한 번씩만 나왔는지 확인
    for (let idx = 0; idx < 9; idx++) {
        if (numbers[idx] !== 1) {
            return false;
        }
    }
    return true;
}

function getRowAndColumn(inputId){
  const coorIdElement = document.getElementById(inputId);
  let tmp = coorIdElement.textContent.split("_");
  let y = parseInt(tmp[1]);
  let x = parseInt(tmp[2]);
  return [y, x];
}

//채점하기 버튼으로 실행하는 함수
function gradeAll(inputId) {
  var rowAndColumn = getRowAndColumn(inputId);
  
  let y = rowAndColumn[0];
  let x = rowAndColumn[1];
  
  let resultRow = gradeRow(y);
  let resultColumn = gradeColumn(x);
  let resultHouse = gradeHouse(y, x);
  
  // 가로, 세로, 집에서 모두 성립함.
  if (resultRow && resultColumn && resultHouse){
    // 성공 기념 시각적 이벤트 추가
    console.log("성공!");
  } else {
    console.log("실패!\n틀린부분을 찾아서 고치세요.");
  }
}

// 채점하기 함수
function grade() {
  for (var i = 1; i<10; i++) {
    for (var j = 1; j<10; j++) {
      gradeAll("coor_" + i.toString() + "," + j.toString());
    }
  }
}

// 좌표의 위치 추적하기 및 함수 다루기 연습
function test(coorId) {
  const coorIdElement = document.getElementById(coorId);
  
  let tmp = coorIdElement.textContent.split("_");
  let y = tmp[1];
  let x = tmp[2];
  coorIdElement.style.backgroundColor = "#ff00ff";
  
  console.log("현재 좌표", y,", ", x);
  console.log("함수가 실행되었습니다.");

}

// 테스트 버튼 클릭 시 스도쿠 정답을 입력하는 함수
function testSudokuSolution() {
    const sudokuSolution = [
        [8, 3, 9, 6, 5, 7, 2, 1, 4],
        [6, 7, 2, 9, 4, 1, 5, 8, 3],
        [1, 5, 4, 8, 3, 2, 9, 6, 7],
        [5, 4, 1, 2, 8, 3, 7, 9, 6],
        [2, 8, 7, 4, 9, 6, 3, 5, 1],
        [9, 6, 3, 7, 1, 5, 4, 2, 8],
        [7, 1, 8, 3, 2, 9, 6, 4, 5],
        [3, 2, 5, 1, 6, 4, 8, 7, 9],
        [4, 9, 6, 5, 7, 8, 1, 3, 2]
    ];

    // 각 셀에 스도쿠 정답 입력
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            const cellValue = sudokuSolution[i - 1][j - 1]; // 정답 배열에서 값 가져오기
            document.getElementById("coor_" + i.toString() + "," + j.toString()).value = cellValue; // 해당 셀에 값 입력
        }
    }
}

// 초기화 버튼 클릭 시에 스도쿠 판 초기화하기
function initializationSudokuGrid() {
    // 각 셀에 "" 입력 === 빈칸으로 만들기
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            document.getElementById("coor_" + i.toString() + "," + j.toString()).value = "";
        }
    }
}




// 테스트 버튼에 클릭 이벤트 리스너 설정
document.getElementById('testBtn').addEventListener('click', testSudokuSolution);

// 초기화 버튼에 이벤트 리스너 설정
document.getElementById('initializationBtn').addEventListener('click', initializationSudokuGrid);


// 채점하기 버튼 이벤트 리스너 설정
document.getElementById('gradeBtn').addEventListener('click', function() {grade()});


