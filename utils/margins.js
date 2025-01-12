const getPageMargins = function (pageNumber) {
  // [djb 04/08/2020] moved top margin to 15 from 13 to avoid cutting
  //                  off the top of page on inkjet printers. (COVID-19)

  // odd pages have an additional offset on the left
  // to allow for hole punching/binding
  const BINDING = 25;
  const left = pageNumber % 2 === 1 ? 30 + BINDING : 30;
  const width = 520;

  const margin = {
    left: left,
    right: left + width,
    width: width,
    top: 15, // minimum we can start from top
    height: 767, // maximum height of page
  };

  return margin;
};

module.exports = getPageMargins;
