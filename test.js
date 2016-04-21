PDFDocument = require('pdfkit');
var fs = require('fs');
var ibmlogo = require('./ibmlogo.js');

var doc = new PDFDocument()
doc.pipe(fs.createWriteStream('out.pdf'));

// Render each path that makes up the ibm logo
for (var i = 0; i < ibmlogo.length; i++) {
    var part = ibmlogo[i];

    doc.save()
    doc.translate(100,100);
    doc.scale(0.05);
    doc.path(part.path) // render an SVG path


    if (part['stroke-width']) {
        doc.lineWidth(part['stroke-width']);
    }

    if (part.fill != 'none' && part.stroke != 'none') {
        doc.fillAndStroke(part.fill, part.stroke);
    } else {

        if (part.fill == 'none') {
            doc.fill(part.fill)
        }

        if (part.stroke == 'none') {
            doc.stroke(part.stroke)
        }
    }

    doc.restore()
}

doc.end();