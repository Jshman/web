
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
     console.log("가로줄에서 실패!");	
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
        displayFirework();
        console.log("성공!");
    } else {
        console.log("실패! 틀린부분을 찾아서 고치세요.");
    }
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

function highlight(event) {

    // 현재 셀의 색 변경
    // highligt clicked cell
    highlightClickedCell(event);

    
    // 주변 셀의 색 변경
    // highlight around cells
    highlightAroundCells(event);
    
}

// 셀 클릭 시에 해당 셀 색 설정
function highlightClickedCell(event) {

    // 클릭됐었지만, 이번엔 클릭되지 않은 영역에 대해서 모두 지워주기. 암튼 이거 없으면 안 됨
    cells.forEach((e) => {
        e.classList.remove("clicked");
    });

    // 클릭됐다고 알려주기.
    event.target.classList.add("clicked");

}

function highlightAroundCells(event) {
    
    const cellId = event.target.id; //string

    let [row, column] = cellId.split("_")[1].split(",");

    cells.forEach((e) => {
        e.classList.remove("gradingRange");
    });

    // 현재 클릭된 셀의 행, 열, 박스를 Sky blue로 강조 표시
    for (let i = 1; i <= 9; i++) {
        // 행에 대한 강조 표시
        if (i !== row) {
            document.getElementById("coor_" + i + "," + column).classList.add("gradingRange");
        }
        // 열에 대한 강조 표시
        if (i !== column) {
            document.getElementById("coor_" + row + "," + i).classList.add("gradingRange");
        }
    }

    // 박스에 대한 강조 표시
    const startRow = Math.floor((row - 1) / 3) * 3 + 1;
    const startColumn = Math.floor((column - 1) / 3) * 3 + 1;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startColumn; j < startColumn + 3; j++) {
            if (!(i === row && j === column)) {
                document.getElementById("coor_" + i + "," + j).classList.add("gradingRange");
            }
        }
    }

}



// 테스트 버튼에 클릭 이벤트 리스너 추가
document.getElementById('testBtn').addEventListener('click', testSudokuSolution);
// 초기화 버튼에 이벤트 리스너 설정
document.getElementById('initializationBtn').addEventListener('click', initializationSudokuGrid);// 채점하기 버튼 이벤트 리스너 설정
document.getElementById('gradeBtn').addEventListener('click', function() {gradeAll()});
// 셀 클릭 리스너 추가
// cells : querySelectorAll로 받아온 input들로 구성된 연결리스트
const cells = document.querySelectorAll('.sudoku-board input');
cells.forEach(cell => cell.addEventListener('click', highlight));



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
