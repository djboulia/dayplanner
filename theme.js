var CNLogo = require('./cnlogo.js');

// CN color palette from CN Logo
var CHARITY_NAVIGATOR = {
  green: '#89e260',
  blue: '#3f5df5',
  black: '#011936',
};

const Theme = {
  date: {
    day: {
      color: CHARITY_NAVIGATOR.blue,
    },
    month: {
      color: CHARITY_NAVIGATOR.black,
    },
  },
  calendar: {
    color: CHARITY_NAVIGATOR.black,
  },
  notes: {
    header: {
      colorBackground: CHARITY_NAVIGATOR.black,
    },
    rule: {
      color: CHARITY_NAVIGATOR.blue,
    },
  },
  logo: {
    color: undefined,
    scale: 0.125,
    svg: CNLogo,
  },
};

module.exports = Theme;
