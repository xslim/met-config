var Hapi = require('hapi');
var Good = require('good');
var fs = require('fs');
var env = require('node-env-file');

var mongoose = require('mongoose');


if (fs.existsSync(__dirname + '/.env' )) {
  env(__dirname + '/.env')
}

var mongo_uri = process.env.MONGOLAB_URI || 'mongodb://localhost/test'
mongoose.connect(mongo_uri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//GLOBAL.db = db;

var sOptions = {
  minimal: true,
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  },
  routes: { cors: true }
};

var server = new Hapi.Server();
var port = process.env.PORT || 3000; 
server.connection({ port: port});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route(require('./routes/websites'));
server.route(require('./routes/indexers'));

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            args:[{ log: '*', response: '*' }]
            //args: [{ log: ['error', 'medium'] }]
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }
    
    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
