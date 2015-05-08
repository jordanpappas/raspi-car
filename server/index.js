var cluster = require('cluster');
var sio = require('socket.io');
var http = require('http');
var url = require('url');

var redis = require('redis').createClient;
var redisio = require('socket.io-redis');

var workers = 4;
var port = process.env.PORT || 3000;

if (cluster.isMaster) {
  var worker;
  
  for (var x = 0; x < workers; x++) {
    worker = cluster.fork();
    console.info('forked Worker #' + worker.id);
  }

  cluster.on('exit', function(worker, code, signal) {
    console.info('Worker #' + worker.id + ' died');
  });
}

if (cluster.isWorker) {
  var server = require('./httpServer');
  var io = sio(server, { 'transports': ['websocket'] });

  server.listen(port);
  
  console.log('control namespace on /control');
  console.log('video namespace on /video');

  // redis
  var redisURL = url.parse(process.env.REDISCLOUD_URL);
  var rhost = redisURL.hostname || 'localhost';
  var rport = redisURL.port     || '6379';
  
  var pub = redis(rport, rhost, { detect_buffers: true, no_ready_check: true });
  var sub = redis(rport, rhost, { detect_buffers: true, no_ready_check: true });

  pub.auth(redisURL.auth.split(":")[1]);
  sub.auth(redisURL.auth.split(":")[1]);

  io.adapter(redisio({
    pubClient: pub,
    subClient: sub
  }));

  // control server
  var control = io.of('/control');

  control.on('connection', function(socket) {

    socket.on('send', function(id, msg, data) {
      data = data || ' ';

      if (!id) {
        socket.emit('err', "no id specified.");
        return;
      }
      
      if (!msg) {
        socket.emit('err', "no msg specified.");
        return;
      }

      control.in(id).emit(msg, data);
    });

    socket.on('sync', function(id) {
      if (!id) {
        socket.emit('err', "no id specified.");
        return;
      }

      socket.join(id);
    });
  });

  // video server
  var video = io.of('/video');

  video.on('connection', function(socket) {
    socket.on('sync', function(id) {
      socket.join(id);
    });

    socket.on('frame', function(id, img) {
      socket.broadcast.to(id).emit(
        'state', img.toString('base64')
      );
    });
  });
}