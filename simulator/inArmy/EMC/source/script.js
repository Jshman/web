document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 선택
    const calendarEl = document.getElementById('calendar');
    const form = document.getElementById('form');
    const expenseForm = document.getElementById('expense-form');
    const dateInput = document.getElementById('date');
    const categoryInput = document.getElementById('category');
    const amountInput = document.getElementById('amount');
    const cancelButton = document.getElementById('cancel');
    const expenseDetails = document.getElementById('expense-details');
    const editForm = document.getElementById('edit-form');
    const editCategoryInput = document.getElementById('edit-category');
    const editAmountInput = document.getElementById('edit-amount');
    const editIndexInput = document.getElementById('edit-index');
    const updateButton = document.getElementById('update-button');
    const deleteButton = document.getElementById('delete-button');
    const closeEditButton = document.getElementById('close-edit');
    const saveButton = document.getElementById('save-button');
    const loadButton = document.getElementById('load-button');
    const initialScreen = document.getElementById('initial-screen');
    const monthlyTotalEl = document.getElementById('monthly-total');
    const monthlyTotalAmountEl = document.getElementById('monthly-total-amount');
    const weekTotalEls = [
        document.getElementById('week1-total'),
        document.getElementById('week2-total'),
        document.getElementById('week3-total'),
        document.getElementById('week4-total'),
        document.getElementById('week5-total'),
        document.getElementById('week6-total')
    ];

    // 모든 지출을 저장할 객체
    let expenses = {};

    // FullCalendar 초기화
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        // 날짜 클릭 이벤트 핸들러
        dateClick: function(info) {
            dateInput.value = info.dateStr;
            if (expenses[info.dateStr]) {
                const detailsHTML = `
                    <h3>${info.dateStr} 지출 리스트</h3>
                    <ul>
                        ${expenses[info.dateStr].items.map((item, index) => 
                            `<li data-index="${index}">${item.category}: ${item.amount} 원</li>`
                        ).join('')}
                    </ul>
                `;
                expenseDetails.innerHTML = detailsHTML;
            } else {
                expenseDetails.innerHTML = '<p>지출 내역이 없습니다.</p>';
            }
            expenseForm.classList.remove('hidden');
        },
        // 지출 데이터로부터 이벤트 생성
        events: Object.keys(expenses).map(date => ({
            title: `${expenses[date].total} 원`,
            start: date,
            allDay: true
        })),
        // 캘린더 날짜가 설정/변경될 때 핸들러
        datesSet: function() {
            updateMonthlyTotal();
        }
    });

    calendar.render();

    // 캘린더 이벤트 업데이트 함수
    function updateCalendar() {
        calendar.getEvents().forEach(event => event.remove());
        Object.keys(expenses).forEach(date => {
            calendar.addEvent({
                title: `${expenses[date].total} 원`,
                start: date,
                allDay: true
            });
        });
        checkInitialScreen();
        updateMonthlyTotal();
    }

    // 지출 세부사항 표시 업데이트 함수
    function updateExpenseDetails() {
        const date = dateInput.value;
        if (expenses[date]) {
            const detailsHTML = `
                <h3>${date} 지출 리스트</h3>
                <ul>
                    ${expenses[date].items.map((item, index) => 
                        `<li data-index="${index}">${item.category}: ${item.amount} 원</li>`
                    ).join('')}
                </ul>
            `;
            expenseDetails.innerHTML = detailsHTML;
        } else {
            expenseDetails.innerHTML = '<p>지출 내역이 없습니다.</p>';
        }
    }

    // 월별 및 주별 총액 업데이트 함수
    function updateMonthlyTotal() {
        const currentMonth = moment(calendar.getDate()).format('YYYY-MM');
        let monthlyTotal = 0;
        let weeklyTotals = [0, 0, 0, 0, 0, 0];

        Object.keys(expenses).forEach(date => {
            if (date.startsWith(currentMonth)) {
                const weekNumber = Math.floor((new Date(date).getDate() - 1) / 7);
                monthlyTotal += expenses[date].total;
                weeklyTotals[weekNumber] += expenses[date].total;
            }
        });

        monthlyTotalAmountEl.textContent = monthlyTotal;
        weeklyTotals.forEach((total, index) => {
            weekTotalEls[index].textContent = total;
        });

        monthlyTotalEl.classList.remove('hidden');
    }

    // 초기 화면 가시성 확인 및 업데이트 함수
    function checkInitialScreen() {
        if (Object.keys(expenses).length === 0) {
            initialScreen.classList.remove('hidden');
            monthlyTotalEl.classList.add('hidden');
        } else {
            initialScreen.classList.add('hidden');
            updateMonthlyTotal();
        }
    }

    // 폼 제출 이벤트 리스너
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const date = dateInput.value;
        const category = categoryInput.value;
        const amount = parseFloat(amountInput.value);

        if (!date || isNaN(amount) || amount <= 0) {
            alert('올바른 정보를 입력하세요.');
            return;
        }

        if (!expenses[date]) {
            expenses[date] = { total: 0, items: [] };
        }

        expenses[date].total += amount;
        expenses[date].items.push({ category, amount });

        // 캘린더 이벤트 업데이트 또는 추가
        const existingEvent = calendar.getEvents().find(event => event.startStr === date);
        if (existingEvent) {
            existingEvent.remove();
        }

        calendar.addEvent({
            title: `${expenses[date].total} 원`,
            start: date,
            allDay: true
        });

        // 폼 초기화 및 숨기기
        dateInput.value = '';
        categoryInput.value = '';
        amountInput.value = '';
        expenseForm.classList.add('hidden');

        // 세부사항 표시 업데이트
        updateExpenseDetails();
        updateCalendar();
    });

    // 취소 버튼 이벤트 리스너
    cancelButton.addEventListener('click', function() {
        dateInput.value = '';
        categoryInput.value = '';
        amountInput.value = '';
        expenseForm.classList.add('hidden');
        expenseDetails.innerHTML = '';
    });

    // 지출 세부사항 클릭 이벤트 리스너
    expenseDetails.addEventListener('click', function(e) {
        const index = e.target.getAttribute('data-index');
        if (index !== null) {
            const date = dateInput.value;
            const item = expenses[date].items[index];
            editCategoryInput.value = item.category;
            editAmountInput.value = item.amount;
            editIndexInput.value = index;
            editForm.classList.remove('hidden');
        }
    });

    // 업데이트 버튼 이벤트 리스너
    updateButton.addEventListener('click', function(e) {
        e.preventDefault();

        const date = dateInput.value;
        const category = editCategoryInput.value;
        const amount = parseFloat(editAmountInput.value);
        const index = parseInt(editIndexInput.value);

        if (!date || isNaN(amount) || amount <= 0 || isNaN(index)) {
            alert('올바른 정보를 입력하세요.');
            return;
        }

        const oldAmount = expenses[date].items[index].amount;
        expenses[date].total = expenses[date].total - oldAmount + amount;
        expenses[date].items[index] = { category, amount };

        editForm.classList.add('hidden');
        updateExpenseDetails();
        updateCalendar();
    });

    // 삭제 버튼 이벤트 리스너
    deleteButton.addEventListener('click', function(e) {
        e.preventDefault();

        const date = dateInput.value;
        const index = parseInt(editIndexInput.value);

        if (isNaN(index)) {
            alert('잘못된 인덱스입니다.');
            return;
        }

        const oldAmount = expenses[date].items[index].amount;
        expenses[date].total -= oldAmount;
        expenses[date].items.splice(index, 1);

        if (expenses[date].items.length === 0) {
            delete expenses[date];
        }

        editForm.classList.add('hidden');
        updateExpenseDetails();
        updateCalendar();
    });

    // 편집 폼 닫기 버튼 이벤트 리스너
    closeEditButton.addEventListener('click', function() {
        editForm.classList.add('hidden');
    });

    // 저장 버튼 이벤트 리스너
    saveButton.addEventListener('click', function() {
        const dataStr = JSON.stringify(expenses);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expenses.json';
        a.click();
    });

    // 로드 버튼 이벤트 리스너
    loadButton.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                expenses = JSON.parse(e.target.result);
                updateCalendar();
            };
            reader.readAsText(file);
        }
    });

    checkInitialScreen();
});
