// script.js
document.addEventListener('DOMContentLoaded', function() {
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
    const initialScreen = document.getElementById('initial-screen'); // 초기 화면 요소 추가

    let expenses = {};

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
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
        events: Object.keys(expenses).map(date => ({
            title: `${expenses[date].total} 원`,
            start: date,
            allDay: true
        }))
    });

    calendar.render();

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
    }

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

    function checkInitialScreen() {
        if (Object.keys(expenses).length === 0) {
            initialScreen.classList.remove('hidden');
        } else {
            initialScreen.classList.add('hidden');
        }
    }

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

        // Update or add calendar event
        const existingEvent = calendar.getEvents().find(event => event.startStr === date);
        if (existingEvent) {
            existingEvent.remove();
        }

        calendar.addEvent({
            title: `${expenses[date].total} 원`,
            start: date,
            allDay: true
        });

        // Clear and hide form
        dateInput.value = '';
        categoryInput.value = '';
        amountInput.value = '';
        expenseForm.classList.add('hidden');

        // Update details display
        updateExpenseDetails();
    });

    cancelButton.addEventListener('click', function() {
        dateInput.value = '';
        categoryInput.value = '';
        amountInput.value = '';
        expenseForm.classList.add('hidden');
        expenseDetails.innerHTML = '';
    });

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

    updateButton.addEventListener('click', function() {
        const date = dateInput.value;
        const index = parseInt(editIndexInput.value, 10);
        const category = editCategoryInput.value;
        const amount = parseFloat(editAmountInput.value);

        if (!date || isNaN(amount) || amount <= 0) {
            alert('올바른 정보를 입력하세요.');
            return;
        }

        if (expenses[date]) {
            // Update the item
            expenses[date].total -= expenses[date].items[index].amount;
            expenses[date].items[index] = { category, amount };
            expenses[date].total += amount;

            // Update or remove calendar event
            const existingEvent = calendar.getEvents().find(event => event.startStr === date);
            if (existingEvent) {
                existingEvent.remove();
            }

            if (expenses[date].total > 0) {
                calendar.addEvent({
                    title: `${expenses[date].total} 원`,
                    start: date,
                    allDay: true
                });
            }

            // Update details display
            updateExpenseDetails();

            // Hide edit form
            editForm.classList.add('hidden');
        }
    });

    deleteButton.addEventListener('click', function() {
        const date = dateInput.value;
        const index = parseInt(editIndexInput.value, 10);

        if (expenses[date]) {
            expenses[date].total -= expenses[date].items[index].amount;
            expenses[date].items.splice(index, 1);

            // Update or remove calendar event
            const existingEvent = calendar.getEvents().find(event => event.startStr === date);
            if (existingEvent) {
                existingEvent.remove();
            }

            if (expenses[date].total > 0) {
                calendar.addEvent({
                    title: `${expenses[date].total} 원`,
                    start: date,
                    allDay: true
                });
            } else {
                delete expenses[date];
            }

            // Update details display
            updateExpenseDetails();

            // Hide edit form
            editForm.classList.add('hidden');
        }
    });

    closeEditButton.addEventListener('click', function() {
        editForm.classList.add('hidden');
    });

    // Save to file
    saveButton.addEventListener('click', function() {
        const blob = new Blob([JSON.stringify(expenses)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'expenses.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Load from file
    loadButton.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                expenses = JSON.parse(e.target.result);
                updateCalendar();
                updateExpenseDetails();
            };
            reader.readAsText(file);
        }
    });

    // Initialize the screen
    checkInitialScreen();
});

