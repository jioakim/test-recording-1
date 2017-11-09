var fs = require('fs');
var https = require('https');
var express = require('express');
var wav = require('wav');
var ss = require('socket.io-stream');

var app = express();

var options = {
  key: fs.readFileSync('./thesis-selfsignedkey.pem'),
  cert: fs.readFileSync('./thesis-selfsignedcrt.pem')
};

var outFile = 'demo.wav';
var serverPort = 9005;

var server = https.createServer(options, app);

var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('new connection');
  var fileWriter = new wav.FileWriter(outFile, {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });
  ss(socket).on('client-stream-request', function(stream){
    console.log('abc');
    stream.pipe(fileWriter);
  });
  //socket.emit('message', 'TESSSST');
});

server.listen(serverPort, function(){
  console.log('HTTPS server up and running at %s port', serverPort);
});