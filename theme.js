var CNLogo = require('./cnlogo.js');

// CN color palette from CN Logo
var CHARITY_NAVIGATOR = {
  green: '#89e260',
  blue: '#3f5df5',
  black: '#011936',
};

var Theme = {
  colorDay: CHARITY_NAVIGATOR.blue,
  colorMonth: CHARITY_NAVIGATOR.black,
  colorCalendar: CHARITY_NAVIGATOR.black,
  colorNotesHeader: CHARITY_NAVIGATOR.black,
  colorNotesRulerLines: CHARITY_NAVIGATOR.blue,
  logo: {
    color: undefined,
    scale: 0.125,
    svg: CNLogo,
  },
};

module.exports = Theme;
