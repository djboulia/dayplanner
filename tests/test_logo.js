var PageDetails = require('../pagedetails.js');
var IBMLogo = require('../ibmlogo.js');
var CNLogo = require('../cnlogo.js');

var fs = require('fs');
var PDFDocument = require('pdfkit');

var doc = new PDFDocument({
  size: 'letter',
});

console.log('Testing two different logos on a page.');

doc.pipe(fs.createWriteStream('out.pdf'));

renderLogos(doc);

doc.end();

function renderLogos(doc) {
  var page = new PageDetails(doc);
  page.logo(IBMLogo, 250, 150, {
    color: '#FF0000', // test default color of red for IBM logo
    scale: 0.05,
  });

  page.logo(CNLogo, 250, 350, {
    color: undefined, // use default colors
    scale: 0.125,
  });
}
