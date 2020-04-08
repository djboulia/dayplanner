var express = require('express');
var Planner = require('./planner.js');

var app = express();

app.get('/', function (req, res) {
    sendDocument(res);
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('DayPlanner app listening at http://%s:%s', host, port);
});

var sendDocument = function (res) {
    var date = new Date();

    var planner = new Planner(date);

    planner.open(res);

    planner.renderTodo();
    planner.newPage();
    planner.renderNotes();

    planner.close();
};