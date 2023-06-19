var PageDetails = require('../pagedetails.js');

var fs = require('fs');
var PDFDocument = require('pdfkit');

var doc = new PDFDocument({
  size: 'letter',
});

console.log('Generating Charity Navigator logo ');

doc.pipe(fs.createWriteStream('out.pdf'));

renderLogos(doc);

doc.end();

function renderLogos(doc) {
  var page = new PageDetails(doc);
  page.ibmLogo(250, 150);
  page.cnLogo(250, 350);
}
