(function(window) {
  var URL_SERVER = 'https://localhost:9005';
  var socket = io.connect(URL_SERVER);
  // socket.on('message', function(data) {
  //   alert(data);
  // });

  var stream = ss.createStream();
  ss(socket).emit('client-stream-request', stream);


  var recording = false;
  window.startRecording = function() {
    recording = true;
  }
  window.stopRecording = function() {
    recording = false;
    stream.end();
  }
  function convertFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);
    while (l--) {
      buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
    }
    return buf.buffer;
  }

  navigator.getUserMedia({audio:true}, success, function(e) {
    alert('Error capturing audio.');
  });

  function success(e) {
    audioContext = window.AudioContext || window.webkitAudioContext;
    context = new audioContext();

    // the sample rate is in context.sampleRate
    audioInput = context.createMediaStreamSource(e);

    var bufferSize = 2048;
    recorder = context.createScriptProcessor(bufferSize, 1, 1);

    recorder.onaudioprocess = function(e){
      if(!recording) return;
      console.log ('recording');
      var left = e.inputBuffer.getChannelData(0);
      stream.write(new ss.Buffer(convertFloat32ToInt16(left)));
    }

    audioInput.connect(recorder)
    recorder.connect(context.destination); 
  }

  // c.onaudioprocess = function(o) 
  // {
  // var input = o.inputBuffer.getChannelData(0);

  //     stream1.write( new ss.Buffer( convertFloat32ToInt16( input ) ));

  // }

  // var client = new BinaryClient('ws://localhost:9001');

  // client.on('open', function() {
  //   window.Stream = client.createStream();

  //   if (!navigator.getUserMedia)
  //     navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
  //   navigator.mozGetUserMedia || navigator.msGetUserMedia;

  //   if (navigator.getUserMedia) {
  //     navigator.getUserMedia({audio:true}, success, function(e) {
  //       alert('Error capturing audio.');
  //     });
  //   } else alert('getUserMedia not supported in this browser.');

  //   var recording = false;

  //   window.startRecording = function() {
  //     recording = true;
  //   }

  //   window.stopRecording = function() {
  //     recording = false;
  //     window.Stream.end();
  //   }

  //   function success(e) {
  //     audioContext = window.AudioContext || window.webkitAudioContext;
  //     context = new audioContext();

  //     // the sample rate is in context.sampleRate
  //     audioInput = context.createMediaStreamSource(e);

  //     var bufferSize = 2048;
  //     recorder = context.createScriptProcessor(bufferSize, 1, 1);

  //     recorder.onaudioprocess = function(e){
  //       if(!recording) return;
  //       console.log ('recording');
  //       var left = e.inputBuffer.getChannelData(0);
  //       window.Stream.write(convertoFloat32ToInt16(left));
  //     }

  //     audioInput.connect(recorder)
  //     recorder.connect(context.destination); 
  //   }

  //   function convertoFloat32ToInt16(buffer) {
  //     var l = buffer.length;
  //     var buf = new Int16Array(l)

  //     while (l--) {
  //       buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
  //     }
  //     return buf.buffer
  //   }
  // });
})(this);
