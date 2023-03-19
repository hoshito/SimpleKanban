function loadData() {
    const savedData = Utils.loadFromLocalStorage(Const.kanbanDataKey);
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        Const.columns.forEach((column, index) => {
            column.cards = parsedData[index].cards;
        });
        return Const.columns;
    } else {
        return Const.columns.map((column) => ({ ...column, cards: [] }));
    }
}

function updateData() {
    Utils.saveToLocalStorage(Const.kanbanDataKey, JSON.stringify(Const.columns));
}

function renderBoard() {
    const board = document.getElementById("board");
    const savedColumns = loadData();

    savedColumns.forEach((columnData) => {
        const column = Column.createColumn(columnData);
        board.appendChild(column);
    });
}

function showEditDialog(card) {
    const editDialog = document.getElementById("edit-dialog");
    const editText = document.getElementById("edit-text");
    const editDueDate = document.getElementById("edit-due-date");
    const editAssignee = document.getElementById("edit-assignee");
    const editColumn = document.getElementById("edit-column");

    editText.value = card.querySelector(".card-text").textContent;
    editDueDate.value = card.querySelector(".card-due-date").textContent;
    editAssignee.value = card.querySelector(".card-assignee").textContent;
    editColumn.value = card.closest(".column").getAttribute("data-column-name");

    editDialog.style.display = "block";

    const saveButton = document.getElementById("edit-save");
    const cancelButton = document.getElementById("edit-cancel");

    function save() {
        const columnIndex = Const.columns.findIndex(
            (column) => column.name === editColumn.value
        );
        const newColumn = document.querySelector(
            `[data-column-name="${editColumn.value}"]`
        );
        const newColumnCards = newColumn.querySelector(".column-cards");

        const oldColumn = card.closest(".column");
        const oldColumnCards = oldColumn.querySelector(".column-cards");

        const oldCardText = card.querySelector(".card-text").textContent;
        const oldCardAssignee = card.querySelector(".card-assignee").textContent;

        card.querySelector(".card-text").textContent = editText.value;
        card.querySelector(".card-due-date").textContent = editDueDate.value;
        card.querySelector(".card-assignee").textContent = editAssignee.value;
        card.style.backgroundColor = Const.assigneeColor[editAssignee.value];

        Task.updateDueDateClass(card, editDueDate.value);

        if (oldColumn !== newColumn) {
            oldColumnCards.removeChild(card);
            newColumnCards.appendChild(card);
        }

        editDialog.style.display = "none";

        const oldColumnName = oldColumn.getAttribute("data-column-name");
        const oldColumnData = Const.columns.find(
            (column) => column.name === oldColumnName
        );
        const newColumnData = Const.columns[columnIndex];
        const cardData = {
            text: editText.value,
            dueDate: editDueDate.value,
            assignee: editAssignee.value,
        };

        oldColumnData.cards = oldColumnData.cards.filter(
            (c) => c.text !== oldCardText || c.assignee !== oldCardAssignee
        );
        newColumnData.cards.push(cardData);

        updateData();
    }

    function save() {
        const columnIndex = Const.columns.findIndex(
            (column) => column.name === editColumn.value
        );
        const newColumn = document.querySelector(
            `[data-column-name="${editColumn.value}"]`
        );
        const newColumnCards = newColumn.querySelector(".column-cards");

        const oldColumn = card.closest(".column");
        const oldColumnCards = oldColumn.querySelector(".column-cards");

        const oldText = card.querySelector(".card-text").textContent;
        const oldAssignee = card.querySelector(".card-assignee").textContent;

        card.querySelector(".card-text").textContent = editText.value;
        card.querySelector(".card-due-date").textContent = editDueDate.value;
        card.querySelector(".card-assignee").textContent = editAssignee.value;
        card.style.backgroundColor = Const.assigneeColor[editAssignee.value];

        Task.updateDueDateClass(card, editDueDate.value);

        if (oldColumn !== newColumn) {
            oldColumnCards.removeChild(card);
            newColumnCards.appendChild(card);
        }

        editDialog.style.display = "none";

        const oldColumnName = oldColumn.getAttribute("data-column-name");
        const oldColumnData = Const.columns.find(
            (column) => column.name === oldColumnName
        );
        const newColumnData = Const.columns[columnIndex];
        const cardData = {
            text: editText.value,
            dueDate: editDueDate.value,
            assignee: editAssignee.value,
        };

        oldColumnData.cards = oldColumnData.cards.filter(
            (c) => c.text !== oldText || c.assignee !== oldAssignee
        );
        newColumnData.cards.push(cardData);

        updateData();
        loadData();
    }

    function cancel() {
        editDialog.style.display = "none";
    }

    saveButton.removeEventListener("click", save);
    cancelButton.removeEventListener("click", cancel);

    saveButton.addEventListener("click", save);
    cancelButton.addEventListener("click", cancel);

    const deleteButton = document.getElementById("edit-delete");
    deleteButton.onclick = () => {
        const oldColumn = card.closest(".column");
        const oldColumnCards = oldColumn.querySelector(".column-cards");
        const oldColumnName = oldColumn.getAttribute("data-column-name");
        const oldColumnData = Const.columns.find(
            (column) => column.name === oldColumnName
        );

        oldColumnCards.removeChild(card);
        oldColumnData.cards = oldColumnData.cards.filter(
            (c) => c.text !== editText.value
        );

        editDialog.style.display = "none";
        updateData();
    };
}

function populateSelect(select, options) {
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

function addNewCard() {
    const newText = document.getElementById("new-text");
    const newDueDate = document.getElementById("new-due-date");
    const newAssignee = document.getElementById("new-assignee");
    const newColumn = document.getElementById("new-column");

    const columnIndex = Const.columns.findIndex(
        (column) => column.name === newColumn.value
    );
    const targetColumn = document.querySelector(
        `[data-column-name="${newColumn.value}"]`
    );
    const columnCards = targetColumn.querySelector(".column-cards");

    const card = Task.createCard(
        newText.value,
        newDueDate.value,
        newAssignee.value,
        Const.assigneeColor[newAssignee.value]
    );
    alert();

    columnCards.appendChild(card);

    const columnData = Const.columns[columnIndex];
    const cardData = {
        text: newText.value,
        dueDate: newDueDate.value,
        assignee: newAssignee.value,
    };
    columnData.cards.push(cardData);

    updateData();
    loadData();

    newText.value = "";
    newDueDate.value = "";
    newAssignee.value = assigneeOptions[0];
    newColumn.value = columnOptions[0];
}

function deleteData() {
    Utils.deleteFromLocalStorage(Const.kanbanDataKey);
    location.reload(); // 画面をリロードして初期状態に戻す
}

function generateCalendar(offsetMonth = 0, targetCalendar) {
    const calendarElement = document.getElementById(targetCalendar);
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + offsetMonth);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let calendarHtml = '<table>';
    calendarHtml += '<tr><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th><th>日</th></tr>';

    let dayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1; // 月曜始まりにするために調整
    let week = Math.ceil((daysInMonth + dayOfWeek) / 7);

    for (let w = 0; w < week; w++) {
        calendarHtml += '<tr>';

        for (let d = 0; d < 7; d++) {
            const currentDay = w * 7 + d - dayOfWeek + 1;

            if (currentDay > 0 && currentDay <= daysInMonth) {
                calendarHtml += `<td class="calendar-day" data-date="${currentYear}-${('00' + (currentMonth + 1)).slice(-2)}-${('00' + currentDay).slice(-2)}">${currentDay}</td>`;
            } else {
                calendarHtml += '<td></td>';
            }
        }

        calendarHtml += '</tr>';
    }

    calendarHtml += '</table>';
    calendarElement.innerHTML = calendarHtml;

}

function plotDeadlines() {
    const deadlines = {};

    Const.columns.forEach((column) => {
        column.cards.forEach((card) => {
            const dueDate = card.dueDate;
            if (deadlines[dueDate]) {
                deadlines[dueDate].push(card);
            } else {
                deadlines[dueDate] = [card];
            }
        });
    });

    Object.entries(deadlines).forEach(([date, cards]) => {
        const dayElement = document.querySelector(`[data-date="${date}"]`);
        if (dayElement) {
            cards.forEach((card) => {
                const eventElement = document.createElement("div");
                eventElement.className = "calendar-event";
                eventElement.textContent = card.text;
                dayElement.appendChild(eventElement);
            });
        }
    });
}
function init() {
    const assigneeOptions = Object.keys(Const.assigneeColor);
    const editAssigneeSelect = document.getElementById("edit-assignee");
    const newAssigneeSelect = document.getElementById("new-assignee");
    populateSelect(editAssigneeSelect, assigneeOptions);
    populateSelect(newAssigneeSelect, assigneeOptions);

    const columnOptions = Const.columns.map((column) => column.name);
    const editColumnSelect = document.getElementById("edit-column");
    const newColumnSelect = document.getElementById("new-column");
    populateSelect(editColumnSelect, columnOptions);
    populateSelect(newColumnSelect, columnOptions);

    const addCardButton = document.getElementById("add-card-button");
    addCardButton.addEventListener("click", addNewCard);

    const deleteButton = document.getElementById("delete-data");
    deleteButton.addEventListener("click", deleteData);

    renderBoard();
    generateCalendar(0, "calendar1");
    generateCalendar(1, "calendar2");
    plotDeadlines();
}
init();
