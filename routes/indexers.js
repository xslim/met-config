var mongoose = require('mongoose');

//var db = mongoose.connection; 

var EI = mongoose.model('Indexer', { 
  url:       { type: String, default: '' },
  added:     { type: Date, default: Date.now },
});


function check_err(err, res) {
  if (err) {
    console.log(err);
    res(err).code(404);
    return true;
  }
  return false;
}

function nextWS(req, res) {
  EI.findOne().sort('added')
  .exec(function(err, ws){
    if (check_err(err, res)) {  return; }
    if (!ws) {
      ws = new EI();
      ws.url = 'localhost';
      ws.save(function (err) {
        //console.log('Saving');
        //console.log(err)
        if (err) {
          res(err);
          return;
        }
        res(ws.url);
      });
    } else {
      res(ws.url);
    }
  });
  
}

var wsp = '/indexers'
var rConfig = {cors: true};

function xroute(method, path, handler) {
  return {
    method: method,
    path: wsp+path,
    config: {
      cors: true,
      handler: handler
    }
  };
}

module.exports = [
  xroute('GET', '/next', nextWS),
];
