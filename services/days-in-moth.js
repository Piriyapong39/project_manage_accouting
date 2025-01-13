class FindDate {
    constructor() {}
    getDaysInMonth(timeNow) {
        const year = timeNow.getFullYear();
        const month = timeNow.getMonth();
        return new Date(year, month + 1, 0).getDate();
    }
}

module.exports = FindDate