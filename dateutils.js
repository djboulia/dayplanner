var daysBetween = function (date1, date2) {
    //Calculate difference btw the two dates, and convert to days
    var oneDay = 1000 * 60 * 60 * 24; // in milliseconds
    var diffDays = Math.round(Math.abs((date1.getTime() -
        date2.getTime()) / (oneDay)));
    return diffDays;
};


function DateUtils() {

    this.daysInMonth = function (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    this.prevMonth = function (date) {
        // find last month
        var year = date.getMonth() > 0 ? date.getFullYear() : date.getFullYear() - 1;
        var month = date.getMonth() > 0 ? date.getMonth() - 1 : 11;
        return new Date(year, month, 1);
    };

    this.nextMonth = function (date) {
        // find next month
        var year = date.getMonth() < 11 ? date.getFullYear() : date.getFullYear() + 1;
        var month = date.getMonth() < 11 ? date.getMonth() + 1 : 0;
        return new Date(year, month, 1);
    };

    this.isCurrentWeek = function (startOfWeek, date1) {
        // startOfWeek represents the date (1..31) of the beginning of the week
        // (Sunday) for the given month.

        var today = date1.getDate();

        if (today >= startOfWeek && today < startOfWeek + 7) {
            return true;
        }

        return false;
    };

    this.isToday = function (curDay, date1) {
        return curDay == date1.getDate();
    };

    this.daysRemainingInYear = function (date) {
        var firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var endOfYear = new Date(date.getFullYear(), 11, 31);

        return daysBetween(firstDate, endOfYear);
    };

    this.daysRemainingInQuarter = function (date) {
        var firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        var month = date.getMonth();
        var currentQuarter = Math.ceil((month + 1) / 3);
        var endOfQuarter = new Date(date.getFullYear(), currentQuarter * 3, 0);

        //    console.log("currentQuarter = " + currentQuarter +
        //                " endOfQuarter = " + endOfQuarter.toDateString());

        return daysBetween(firstDate, endOfQuarter);
    };

};

module.exports = DateUtils;
