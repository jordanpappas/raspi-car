/*
 * Car Client Code
 */

var exec = require('child_process').exec;
var io   = require('socket.io-client');
var pwm  = require('pi-blaster.js');
var gpio = require('r-pi-gpio');

var _ID = process.argv[2] || 'jordan123';
var _ss = process.argv[3] || 'http://picontrol2.herokuapp.com/control';

// motor
var ma = gpio.createOutput(27);
var mb = gpio.createOutput(22);
var mp = 17;

var speed = 0.50;

// servo 
var sp = 25;


init();
//setInterval(getBattery, 5000);


/*
 * House keeping
 */

function init() {
  stop();
}

function onExit() {
  onDisconnect();
  process.exit();
}

process.on('SIGINT', onExit); // ctrl+c event


/*
 * Control Functions
 */

function forward() {
  stop();
  ma(false);
  mb(true);
  pwm.setPwm(mp, speed);
}

function reverse() {
  stop();
  ma(true);
  mb(false);
  pwm.setPwm(mp, speed);
}

function stop() {
  pwm.setPwm(mp, 0.0);
  ma(false);
  mb(false);
}

function setSpeed(s) {
  speed = parseFloat(s)/100 || speed;
}

function left()    { pwm.setPwm(sp, 0.15); }
function right()   { pwm.setPwm(sp, 0.24); }
function neutral() { pwm.setPwm(sp, 0.20); }

function stopServo() { pwm.setPwm(sp, 0.0); }

/*
 * Helpers
 */

function onConnect() {
  socket.emit('sync', _ID);
  console.log('Connected to ' + _ID);
  console.log('ctrl+c to quit');
}

function onDisconnect() {
  console.log('Disconnected from server'.);
}

function shutdownPi() {
  exec('shutdown -h now', function(err, stdout, stderr) {
    if (err) throw err;
    console.log(stdout);
  });
}

/*
function getBattery() {
  if (batteryLow()) {
    socket.emit('send', _ID, 'batterylow');
    shutdownPi();
  }
}
*/


/*
 * Socket.io client
 */

var socket = io(_ss, {transports: ['websocket']});

socket.on('connect', onConnect);
socket.on('disconnect', onDisconnect);

socket.on('forward', forward);
socket.on('reverse', reverse);
socket.on('stop', stop);

socket.on('neutral', neutral);
socket.on('right', right);
socket.on('left', left);

socket.on('speed', setSpeed);

socket.on('shutdown', shutdownPi);