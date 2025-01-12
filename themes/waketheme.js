var WakeLogo = require('../logos/wakelogo.js');
const RGB = require('../utils/rgb.js');

const Theme = {
  lineHeight: 19,
  notes: {
    header: {
      colorBackground: RGB.black,
    },
    rule: {
      color: RGB.gray,
    },
  },
  logo: {
    color: undefined,
    scale: 1.5,
    svg: WakeLogo,
  },
};

module.exports = Theme;
