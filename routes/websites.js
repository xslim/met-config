var mongoose = require('mongoose');

//var db = mongoose.connection; 

var WS = mongoose.model('Website', { 
  url:       { type: String, default: '' },
  depth:     { type: Number, default: 2 }, 
  topn:      { type: Number, default: 50 },
  regex:     { type: String, default: '' },
  indexName: { type: String, default: 'website' },
  added:     { type: Date, default: Date.now },
  updated:   { type: Date },
  locked:    { type: Date },
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
  console.log(req.payload);
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

function nextWSlock(req, res) {
  var nextId = "123";
  res(nextId);
}

function listWS(req, res) {
  WS.find().limit(25).sort('added').select('url added locked updated')
  .exec(function(err, ws){
    if (check_err(err, res)) {  return; }
    res(ws);
  });
}

function getWS(req, res) {
  var id = req.params.id;
  WS.findOne(id, function(err, ws){
    if (check_err(err, res)) {  return; }
    var code = (ws) ? 200 : 404;
    res(ws).code(code);
  });
}

function purgeWS(req, res) {
  WS.remove({ url: '' }, function(err, ws){
    if (check_err(err, res)) {  return; }
    var code = (ws) ? 200 : 404;
    res(ws).code(code);
  });
}

var wsp = '/websites'
module.exports = [
    { method: 'GET', path: wsp, handler: listWS },
    { method: 'POST', path: wsp+'/new', handler: newWS },
    { method: 'GET', path: wsp+'/next', handler: nextWS },
    { method: 'POST', path: wsp+'/next', handler: nextWSlock },
    { method: 'POST', path: wsp+'/purge', handler: purgeWS },
    { method: 'GET', path: wsp+'/{id}', handler: getWS }
];
