function FontUtils(fontSize) {
  /*
   * calculate a reasonable spacing amount so that the text doesn't
   * look too cramped when laying out a grid
   */
  this.rowSpace = function () {
    return fontSize / 10;
  };

  this.columnSpace = function () {
    return fontSize / 2;
  };

  this.columnWidth = function () {
    // return a reasonable column width based on a given font size
    // this adds in some  white space for the given font size
    return fontSize + this.columnSpace();
  };
}

module.exports = FontUtils;
