const RGB = require('../utils/rgb.js');

const DefaultTheme = {
  lineHeight: 23.75, // [djb 09/23/2016] originally lineHeight=21
  date: {
    day: {
      color: RGB.gray,
    },
    month: {
      color: RGB.gray,
    },
  },
  calendar: {
    color: RGB.mediumGray,
  },
  notes: {
    header: {
      colorBackground: RGB.mediumGray,
    },
    rule: {
      color: RGB.lightBlue,
    },
  },
  logo: {
    color: undefined,
    scale: 1.0,
    svg: undefined, // no logo by default - see IBMLogo.js or CNLogo.js for format
  },
};

module.exports = DefaultTheme;
