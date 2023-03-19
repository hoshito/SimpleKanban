var Task = {
    createTask: function (text, dueDate, assignee, color) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <div class="card-text">${text}</div>
      <div class="card-due-date">${dueDate}</div>
      <div class="card-assignee">${assignee}</div>
    `;
        card.style.backgroundColor = color;

        updateDueDateClass(card, dueDate);

        card.addEventListener("dblclick", () => {
            showEditDialog(card);
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

    // 他のタスクに関する操作が必要であれば、ここに追加します。
};
