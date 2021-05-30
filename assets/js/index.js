window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  var canvas = document.getElementById("canvas");
  canvas.addEventListener('click', on_canvas_click, false);
  canvas.addEventListener("mousedown",function(event){seeking=true,seek(event)});
  canvas.addEventListener("mouseup", function(){seeking=false});
  function on_canvas_click(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    // ... x,y are the click coordinates relative to the
    // canvas itself
    console.log(x)
  }
  function seek(event){
    if(seeking){
      canvas.value = event.clientX - canvas.offsetLeft;
      console.log(canvas.value)
      console.log(audio.duration,"Audio duration");
      var seekto = audio.duration * (canvas.value/1500);
      console.log(seekto)
      audio.currentTime=seekto;
    }
  }

  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 2048;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    console.log(dataArray)
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = "#FF0000"; 
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};