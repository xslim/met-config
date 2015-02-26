var mongoose = require('mongoose');

//var db = mongoose.connection; 

var WS = mongoose.model('Website', { 
  url: String,
  depth: Number, 
  topn: Number,
  regex: String,
  site: String,
  locked: Boolean,
  indexName: String,
  added: { type: Date, default: Date.now },
  updated: { type: Date },
  started: { type: Date },
});


function check_err(err, res) {
  if (err) {
    console.log(err);
    res(err).code(404);
    return true;
  }
  return false;
}

function newWS(req, res) {
  var ws = new WS();
  ws.save(function (err) {
    if (err) {
      res(err);
      return;
    }
    res(ws._id)
  });
}

function nextWS(req, res) {
  var nextId = "123";
  res(nextId);
}

function getWS(req, res) {
  var id = req.params.id;
  WS.findOne(id, function(err, ws){
    if (check_err(err, res)) {  return; }
    var code = (ws) ? 200 : 404;
    res(ws).code(code);
  });
}

var wsp = '/websites'
module.exports = [
    { method: 'POST', path: wsp+'/new', handler: newWS },
    { method: 'GET', path: wsp+'/next', handler: nextWS },
    { method: 'GET', path: wsp+'/{id}', handler: getWS }
];
