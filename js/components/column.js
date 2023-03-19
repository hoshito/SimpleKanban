var Column = {
    createColumn: function (columnData) {
        const column = document.createElement("div");
        column.className = "column";
        column.setAttribute("data-column-name", columnData.name);
        column.innerHTML = `
              <div class="column-header">${columnData.name}</div>
              <div class="column-cards"></div>
        `;

        const columnCards = column.querySelector(".column-cards");
        const sortedCards = columnData.cards.sort(Utils.compareCards); // ソートされたカードデータ

        sortedCards.forEach((cardData) => {
            const card = Task.createCard(
                cardData.text,
                cardData.dueDate,
                cardData.assignee,
                Const.assigneeColor[cardData.assignee]
            );
            columnCards.appendChild(card);
        });

        return column;

    },

    deleteColumn: function (columnId) {
        var column = document.getElementById(columnId);
        if (column) {
            column.parentElement.removeChild(column);
        }
    },

    // 他のカラムに関する操作が必要であれば、ここに追加します。
};
