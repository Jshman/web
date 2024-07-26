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

    const expenses = {};

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

        calendar.getEvents().forEach(event => {
            if (event.startStr === date) {
                event.remove();
            }
        });

        calendar.addEvent({
            title: `${expenses[date].total} 원`,
            start: date,
            allDay: true
        });

        dateInput.value = '';
        categoryInput.value = '';
        amountInput.value = '';
        expenseForm.classList.add('hidden');

        const detailsHTML = `
            <h3>${date} 지출 리스트</h3>
            <ul>
                ${expenses[date].items.map((item, index) => 
                    `<li data-index="${index}">${item.category}: ${item.amount} 원</li>`
                ).join('')}
            </ul>
        `;
        expenseDetails.innerHTML = detailsHTML;
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

            // Refresh the calendar event
            calendar.getEvents().forEach(event => {
                if (event.startStr === date) {
                    event.remove();
                }
            });

            calendar.addEvent({
                title: `${expenses[date].total} 원`,
                start: date,
                allDay: true
            });

            // Update the details display
            const detailsHTML = `
                <h3>${date} 지출 리스트</h3>
                <ul>
                    ${expenses[date].items.map((item, index) => 
                        `<li data-index="${index}">${item.category}: ${item.amount} 원</li>`
                    ).join('')}
                </ul>
            `;
            expenseDetails.innerHTML = detailsHTML;

            // Close the edit form
            editForm.classList.add('hidden');
        }
    });

    deleteButton.addEventListener('click', function() {
        const date = dateInput.value;
        const index = parseInt(editIndexInput.value, 10);

        if (expenses[date]) {
            expenses[date].total -= expenses[date].items[index].amount;
            expenses[date].items.splice(index, 1);

            if (expenses[date].items.length === 0) {
                delete expenses[date];
            } else {
                // Update the total and events
                calendar.getEvents().forEach(event => {
                    if (event.startStr === date) {
                        event.remove();
                    }
                });

                calendar.addEvent({
                    title: `${expenses[date].total} 원`,
                    start: date,
                    allDay: true
                });
            }

            // Update the details display
            const detailsHTML = `
                <h3>${date} 지출 리스트</h3>
                <ul>
                    ${expenses[date] ? expenses[date].items.map((item, index) => 
                        `<li data-index="${index}">${item.category}: ${item.amount} 원</li>`
                    ).join('') : '<p>지출 내역이 없습니다.</p>'}
                </ul>
            `;
            expenseDetails.innerHTML = detailsHTML;

            // Close the edit form
            editForm.classList.add('hidden');
        }
    });

    closeEditButton.addEventListener('click', function() {
        editForm.classList.add('hidden');
    });
});

