/**
 * combine the defaults with any user defined object
 * user defined object properties will override the defaults
 **/
const mergeObjects = function (defaultStyles, userStyles) {
  defaultStyles = defaultStyles || {};
  userStyles = userStyles || {};

  const mergedStyles = {};

  for (let attrname in defaultStyles) {
    mergedStyles[attrname] = defaultStyles[attrname];
  }

  // now apply any user defined styles.  note that any user styles
  // will override the default
  for (let attrname in userStyles) {
    mergedStyles[attrname] = userStyles[attrname];
  }

  return mergedStyles;
};

module.exports = mergeObjects;
