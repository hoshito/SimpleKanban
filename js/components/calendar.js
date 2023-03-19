var Calendar = {
    generateCalendar: function(offsetMonth = 0, targetCalendar) {
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
    },
    
    plotDeadlines: function() {
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
};
