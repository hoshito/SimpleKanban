var Utils = {
    saveToLocalStorage: function (key, data) {
        // JSON形式に変換してデータを保存
        localStorage.setItem(key, JSON.stringify(data));
    },

    loadFromLocalStorage: function (key) {
        // データをJSON形式からオブジェクトに変換して読み込み
        var jsonData = localStorage.getItem(key);
        return jsonData ? JSON.parse(jsonData) : null;
    },

    deleteFromLocalStorage: function (key) {
        localStorage.removeItem(key);
    },

    compareCards(a, b) {
        if (a.assignee < b.assignee) {
            return -1;
        } else if (a.assignee > b.assignee) {
            return 1;
        } else {
            const dueDateA = new Date(a.dueDate);
            const dueDateB = new Date(b.dueDate);
            return dueDateA - dueDateB;
        }
    },

};
