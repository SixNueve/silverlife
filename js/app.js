URL = window.URL || window.webkitURL;
var gumStream; 			
var rec; 			
var input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
	console.log("recordButton clicked");
    var constraints = { audio: true, video:false }
	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
		audioContext = new AudioContext();
		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1})
		rec.record()

		console.log("Recording started");
		document.getElementById("recordButton").style.display = "none";
		document.getElementById("quest1").style.display = "block";
		document.getElementById("bout1").style.display = "block";
		document.getElementById("rec").style.display = "block";
		document.getElementById("instructions").style.display = "none";
      var player1 = document.querySelector('#audioPlayer1');
   	  player1.play();
	}).catch(function(err) {
    	recordButton.disabled = false;
    	stopButton.disabled = true;
    	pauseButton.disabled = true
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;
	pauseButton.innerHTML="Pause";
	rec.stop();
	document.getElementById("quest10").style.display = "none";
	document.getElementById("stopButton").style.display = "none";
	document.getElementById("rec").style.display = "none";
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	var filename = new Date().toISOString();
	au.controls = true;
	au.src = url;
	link.href = url;
	link.download = filename+".wav";
	link.innerHTML = "Save to disk";
	var upload = document.createElement('a');
	upload.href="#";
	upload.id='upload';
	upload.innerHTML = "Suite";
	upload.addEventListener("click", function(event){
		  document.getElementById("instructions2").style.display = "block";
		  document.getElementById("upload").style.display = "none";
		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
		          console.log("Server returned: ",e.target.responseText);
		          document.getElementById("final").style.display = "block";
		      }
		  };
		  var fd=new FormData();
		  fd.append("audio_data",blob, filename);
		  xhr.open("POST","upload.php",true);
		  xhr.send(fd);
	})
	li.appendChild(document.createTextNode (" "))
	li.appendChild(upload)
	recordingsList.appendChild(li);
}