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

function deleteData() {
    Utils.deleteFromLocalStorage(Const.kanbanDataKey);
    location.reload(); // 画面をリロードして初期状態に戻す
}

function renderBoard() {
    const board = document.getElementById("board");
    const savedColumns = loadData();

    savedColumns.forEach((columnData) => {
        const column = Column.createColumn(columnData);
        board.appendChild(column);
    });
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
    Calendar.generateCalendar(0, "calendar1");
    Calendar.generateCalendar(1, "calendar2");
    Calendar.plotDeadlines();
}
init();
