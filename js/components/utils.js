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
};
