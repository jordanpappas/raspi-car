var left  = document.getElementById('left');
var right = document.getElementById('right');

var forward = document.getElementById('forward');
var reverse = document.getElementById('reverse');

var slideHandle = document.getElementsByClassName('range-handle')[0];

var btncolor = "teal";

var ID = ''
while (ID == '' || (ID != null && ID.length > 25)) {
  ID = window.prompt('Enter Your car\'s channel ID');
}

var socket = io.connect('http://picontrol2.herokuapp.com/control', { 'transports': ['websocket'] });

socket.on('connect', function(data) {
  socket.emit('sync', ID);
});

// forward
forward.addEventListener('touchstart', function() {
  forward.style.backgroundColor = btncolor;
  socket.emit('send', ID, 'forward');
});

forward.addEventListener('touchend', function() {
  forward.style.backgroundColor = "transparent";
  socket.emit('send', ID, 'stop');
});


// reverse
reverse.addEventListener('touchstart', function() {
  reverse.style.backgroundColor = btncolor;
  socket.emit('send', ID, 'reverse');
});

reverse.addEventListener('touchend', function() {
  reverse.style.backgroundColor = "transparent";
  socket.emit('send', ID, 'stop');
});


// left
left.addEventListener('touchstart', function() {
  left.style.backgroundColor = btncolor;
  socket.emit('send', ID, 'left');
});

left.addEventListener('touchend', function() {
  left.style.backgroundColor = "transparent";
  socket.emit('send', ID, 'neutral');
});


// right
right.addEventListener('touchstart', function() {
  right.style.backgroundColor = btncolor;
  socket.emit('send', ID, 'right');
});

right.addEventListener('touchend', function() {
  right.style.backgroundColor = "transparent";
  socket.emit('send', ID, 'neutral');
});


slideHandle.addEventListener('touchend', function() {
  socket.emit('send', 'speed', speed.value);
});

slideHandle.addEventListener('mouseup', function() {
  socket.emit('send', 'speed', speed.value);
});

// prevent mobile users from scrolling
document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });