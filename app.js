const express = require('express');
const Planner = require('./planner.js');

const app = express();

app.get('/', function (req, res) {
  sendDocument(res);
});

const server = app.listen(3000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('DayPlanner app listening at http://%s:%s', host, port);
});

const sendDocument = function (res) {
  const date = new Date();

  const planner = new Planner(date);

  planner.open(res);

  planner.renderTodo();
  planner.newPage();
  planner.renderNotes();

  planner.close();
};
