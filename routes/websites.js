var mongoose = require('mongoose');

//var db = mongoose.connection; 

var WS = mongoose.model('Website', { 
  url:       { type: String, default: '' },
  depth:     { type: Number, default: 2 }, 
  topn:      { type: Number, default: 50 },
  regex:     { type: String, default: '' },
  category:  { type: String, default: 'website' },
  added:     { type: Date, default: Date.now },
  updated:   { type: Date },
  locked:    { type: Date },
  data: {
    base:         { type: String, default: '' },
    url:          { type: String, default: '' },
    title:        { type: String, default: '' },
    price:        { type: String, default: '' },
    description:  { type: String, default: '' },
  }
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
  var ws = new WS(req.payload);
  ws.save(function (err) {
    if (err) {
      res(err);
      return;
    }
    res(ws._id)
  });
}

function elasticConfig() {
  return {
    host: 'http://elastic-kalapun.rhcloud.com:80',
    version: '0.90'
  }
}


function nextWS(req, res, lock) {
  var days = 3;
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate()-days);

  WS.findOne().or([{ updated: {$lt: cutoff} }, {updated: ''}])
  .exec(function(err, ws){
    if (check_err(err, res)) {  return; }
    if (lock) {
      //console.log('Will lock ' + ws._id);
      ws.locked = new Date();
      ws.save(function (err) {
        //console.log('Saving');
        //console.log(err)
        if (err) {
          res(err);
          return;
        }
        ws = ws.toObject();
        ws.elastic = elasticConfig();
        res(ws);
      });
    } else {
      ws = ws.toObject();
      ws.elastic = elasticConfig();
      res(ws);
    }
  });
  
}

function nextWSlock(req, res) {
  nextWS(req, res, true);
}

function listWS(req, res) {
  WS.find().limit(25).sort('added').select('url added locked updated')
  .exec(function(err, ws){
    if (check_err(err, res)) {  return; }
    res(ws);
  });
}

function deleteWS(req, res) {
  var id = req.params.id;

  WS.remove({ _id: id }, function(err, ws){
    if (check_err(err, res)) {  return; }
    var code = (ws) ? 200 : 404;
    res(ws).code(code);
  });
}


function unlockWS(req, res) {
  var id = req.params.id;
  WS.findById(id, function(err, ws){
    if (check_err(err, res)) {  return; }
    ws.locked = '';
    ws.updated = new Date();
    ws.save(function (err) {
        if (err) {
          res(err);
          return;
        }
        res(ws);
      });
  });
}

function getWS(req, res) {
  var id = req.params.id;
  console.log('Searching by: '+id);
  WS.findById(id, function(err, ws){
    if (check_err(err, res)) {  return; }
    var code = (ws) ? 200 : 404;
    console.log('Returning: '+ws._id);
    res(ws).code(code);
  });
}

function updateWS(req, res) {
  //console.log(req.payload);
  if (!req.payload) { res().code(404); return; }
  var id = req.params.id;
  WS.findByIdAndUpdate(id, { $set: req.payload }, function(err, ws){
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
var rConfig = {cors: true};

function xroute(method, path, handler) {
  return {
    method: method,
    path: '/websites'+path,
    config: {
      cors: true,
      handler: handler
    }
  };
}

module.exports = [
  xroute('GET', '', listWS),
  xroute('GET', '/{id}', getWS),
  xroute(['POST', 'OPTIONS'], '/{id}', updateWS),
  xroute(['POST', 'OPTIONS'], '/', newWS),
  xroute('DELETE', '/{id}', deleteWS),
  xroute('GET', '/next', nextWS),
  xroute('POST', '/next', nextWSlock),
  xroute('POST', '/{id}/unlock', unlockWS),
  xroute('POST', '/purge', purgeWS),
];
