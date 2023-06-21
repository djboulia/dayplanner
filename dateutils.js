const daysBetween = function (date1, date2) {
  //Calculate difference btw the two dates, and convert to days
  const oneDay = 1000 * 60 * 60 * 24; // in milliseconds
  const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  return diffDays;
};

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

const MONTHS_ABBREVIATION = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function DateUtils() {
  this.getMonthName = function (month) {
    return MONTHS[month];
  };

  this.getMonthAbbreviation = function (month) {
    return MONTHS_ABBREVIATION[month];
  };

  this.daysInMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  this.prevMonth = function (date) {
    // find last month
    const year = date.getMonth() > 0 ? date.getFullYear() : date.getFullYear() - 1;
    const month = date.getMonth() > 0 ? date.getMonth() - 1 : 11;
    return new Date(year, month, 1);
  };

  this.nextMonth = function (date) {
    // find next month
    const year = date.getMonth() < 11 ? date.getFullYear() : date.getFullYear() + 1;
    const month = date.getMonth() < 11 ? date.getMonth() + 1 : 0;
    return new Date(year, month, 1);
  };

  this.isCurrentWeek = function (startOfWeek, date1) {
    // startOfWeek represents the date (1..31) of the beginning of the week
    // (Sunday) for the given month.

    const today = date1.getDate();

    if (today >= startOfWeek && today < startOfWeek + 7) {
      return true;
    }

    return false;
  };

  this.isToday = function (curDay, date1) {
    return curDay == date1.getDate();
  };

  this.daysRemainingInYear = function (date) {
    const firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfYear = new Date(date.getFullYear(), 11, 31);

    return daysBetween(firstDate, endOfYear);
  };

  this.daysRemainingInQuarter = function (date) {
    const firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const month = date.getMonth();
    const currentQuarter = Math.ceil((month + 1) / 3);
    const endOfQuarter = new Date(date.getFullYear(), currentQuarter * 3, 0);

    //    console.log("currentQuarter = " + currentQuarter +
    //                " endOfQuarter = " + endOfQuarter.toDateString());

    return daysBetween(firstDate, endOfQuarter);
  };
}

module.exports = DateUtils;
