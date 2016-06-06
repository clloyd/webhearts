var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mustacheExpress = require('mustache-express');
var uuid = require('uuid');


app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

server.listen(9000);

app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});


function genClickDispatcher() {

  var listeners = [];

  function register(callback) {
    listeners.push(callback);
    console.log(listeners)
  }

  function remove(callback) {
    var index = array.indexOf(callback);

    if (index > -1) {
      array.splice(index, 1);
    }
  }

  function trigger(data) {
    listeners.forEach(function(callback) {
      callback(data)
    });
  }

  return {
    register: register,
    remove: remove,
    trigger: trigger
  }
}

var dispatcher = genClickDispatcher();

io.on('connection', function (socket) {

  var currentUrl = undefined;
  var id = uuid.v4()

  var clickCallback = function(data) {
    if (data.triggerId !== id && currentUrl === data.url) {
      socket.emit('TRIGGER_HEART', data);
    }
  }.bind(this)

  socket.on('ID_RES', function (data) {
    currentUrl = data.url;
    dispatcher.register(clickCallback);
  });

  socket.on('CLICK', function(data) {
    console.log(data)
    dispatcher.trigger(data);
  })

  socket.emit('ID_REQ', {id: id});
});
