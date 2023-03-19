var Task = {
    createCard: function (text, dueDate, assignee, color) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <div class="card-text">${text}</div>
      <div class="card-due-date">${dueDate}</div>
      <div class="card-assignee">${assignee}</div>
    `;
        card.style.backgroundColor = color;

        Task.updateDueDateClass(card, dueDate);

        card.addEventListener("dblclick", () => {
            Task.showEditDialog(card);
        });
        return card;
    },

    updateDueDateClass(card, dueDate) {
        const cardDueDateElement = card.querySelector(".card-due-date");
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const dueDateObject = new Date(dueDate);

        if (dueDateObject - today <= oneDay) {
            cardDueDateElement.classList.add("card-due-soon");
        } else {
            cardDueDateElement.classList.remove("card-due-soon");
        }

    },

    deleteTask: function (taskId) {
        var task = document.getElementById(taskId);
        if (task) {
            task.parentElement.removeChild(task);
        }
    },

    showEditDialog: function (card) {
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
        saveButton.removeEventListener("click", save);
        saveButton.addEventListener("click", save);

        const cancelButton = document.getElementById("edit-cancel");
        cancelButton.removeEventListener("click", cancel);
        cancelButton.addEventListener("click", cancel);

        const deleteButton = document.getElementById("edit-delete");
        deleteButton.addEventListener("click", del);

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

        function del() {
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
            loadData();
        }
    },
};
