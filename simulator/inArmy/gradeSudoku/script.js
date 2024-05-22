
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
    num = parseInt(document.getElementById("coor_" + row + "," + step).value);
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
function gradeColumn(column) {
    const numbers = Array(9).fill(0);
    let num;

    for (let step = 1; step <= 9; step++) {
        num = parseInt(document.getElementById("coor_" + step + "," + column).value);
        if (isNaN(num) || num < 1 || num > 9) {
            console.log("세로줄에서 실패!");
            return false;
        }
        numbers[num - 1]++;
    }

    return numbers.every(count => count === 1);
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

// 주어진 ID로부터 행과 열 좌표를 추출
function getRowAndColumn(inputId) {
    const parts = inputId.split("_")[1].split(",");
    return [parseInt(parts[0]), parseInt(parts[1])];
}

// 채점하기 버튼으로 실행하는 함수
function gradeAll() {
    let isValid = true;
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            if (!gradeRow(i) || !gradeColumn(j) || !gradeHouse(i, j)) {
                isValid = false;
                break;
            }
        }
    }

    if (isValid) {
        console.log("성공!");
    } else {
        console.log("실패! 틀린부분을 찾아서 고치세요.");
    }
}

// // 채점하기 함수
// // 모든 셀을 순회하며 채점하는 함수
// function grade() {
//     for (let i = 1; i <= 9; i++) {
//         for (let j = 1; j <= 9; j++) {
//             const inputId = "coor_" + i + "," + j;
//             gradeAll(inputId);
//         }
//     }
// }

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

// 테스트 버튼에 클릭 이벤트 리스너 추가
document.getElementById('testBtn').addEventListener('click', testSudokuSolution);


// 채점하기 버튼 이벤트 리스너 설정
document.getElementById('gradeBtn').addEventListener('click', function() {gradeAll()});

// 각 input에 이벤트 리스너 설정
document.getElementById('coor_1,8').addEventListener('input', function() {test('coor_1,8')});
