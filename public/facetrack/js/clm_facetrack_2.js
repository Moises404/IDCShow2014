
	var firebaseRef = 'https://facemask.firebaseio.com/';

	var vid = document.getElementById('videoel');
	var overlay = document.getElementById('overlay');
	var overlayCC = overlay.getContext('2d');
	var psrElement = document.getElementById('percentage');
	var ctrack = new clm.tracker({useWebGL : true});
	var lefteye = document.getElementById('leftmask');
	var newlcy, newlcx,curscore;
	var maxframes = 5;
	var imgstream=new Array(maxframes);
	var fullstream=new Array(maxframes); //only latest completed capture
	var playback = document.getElementById('recorded');
	var i=0,p=-1;
	var fps = 30;
	var n = 0, potential, recording, playingfull;
	
	width = 400;
	height = 300;
	
	ctrack.init(pModel);
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.getElementById('container').appendChild( stats.domElement );
	
	function enablestart() {
		var startbutton = document.getElementById('startbutton');
		startbutton.value = "start";
		startbutton.disabled = null;
	}
	
	var insertAltVideo = function(video) {
		if (supports_video()) {
			if (supports_ogg_theora_video()) {
				video.src = "./media/cap12_edit.ogv";
			} else if (supports_h264_baseline_video()) {
				video.src = "./media/cap12_edit.mp4";
			} else {
				return false;
			}
			//video.play();
			return true;
		} else return false;
	}
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

	// check for camerasupport
	if (navigator.getUserMedia) {
		// set up stream
		var videoSelector = {video : true};
		if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
			var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
			if (chromeVersion < 20) {
				videoSelector = "video";
			}
		};
	
		navigator.getUserMedia(videoSelector, function( stream ) {
			if (vid.mozCaptureStream) {
				vid.mozSrcObject = stream;
			} else {
				vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
			}
			vid.play();
		}, function(code) {
			alert("h"+code);
			insertAltVideo(vid);
			document.getElementById('gum').className = "hide";
			document.getElementById('nogum').className = "nohide";
			//alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
		});
	} else {
		insertAltVideo(vid);
		document.getElementById('gum').className = "hide";
		document.getElementById('nogum').className = "nohide";
		alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
	}

	vid.addEventListener('canplay', enablestart, false);
	
	function startVideo() {
		// start tracking
		ctrack.start(vid);
		window.setInterval(record,2500);
		// start loop to draw face
		drawLoop();
	}
	
	
	function drawLoop() {
	
		requestAnimFrame(drawLoop);
			
		overlayCC.clearRect(0, 0, width, height);
		overlayCC.drawImage(vid, 0, 0, width, height);
					
		if (ctrack.getCurrentPosition()) {
		ctrack.draw(overlay);
		//console.log(i+++' '+overlay.toDataURL());	
			centerpos=ctrack.getCurrentPosition()[62];
			newlcx = (1 - (centerpos[0]/400)).toFixed(3); //x values are 1 - val because x 0 origin is top right
			newlcy = (centerpos[1]/600).toFixed(3);
			lefteye.setAttribute('cx', newlcx);
			lefteye.setAttribute('cy', newlcy);
			
		curscore = ctrack.getScore().toFixed(4)
		psrElement.innerHTML = "Score : " + curscore;

		if (n!=0&&(curscore < .75||n>=maxframes)) //lower score threshold
		{
			if(potential) window.clearTimeout(potential);
			if(recording) window.clearInterval(recording);
			if(n>=maxframes)
			{
				console.log('complete set');
				window.clearInterval(playingfull);
				p=0;
				fullstream=null;
				fullstream=imgstream;
				//console.log(fullstream);
				playingfull=window.setInterval(playfull,1000/fps);
				//send to firebase

				handleFileSelect(imgstream);
			}
			else console.log('incomplete set');
			n=0;
			console.log('done');
		}
		}
	}
	
	function record() {
		if ((curscore > .7)&&(n==0)) 
		{
			console.log('recording'+n);
			
			  potential = window.setTimeout(function(){
			  	recording=window.setInterval(function(){
			  		//console.log(n);
					imgstream[n]=overlay.toDataURL();
					n++;
				},1000/fps)
			  }, 1000);
		}
	}
	
	function playfull() {
		if (p>= 0)
		{
			if(p>=maxframes) p=0;
			playback.src=fullstream[p++];
		}
	}

	//send array of image dataURLs to firebase
	function handleFileSelect(listOfImages) {
	  	var gifID = Math.floor(Math.random()*100000000);
	  	//var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(listOfImages));
	  	var f = new Firebase(firebaseRef  + 'pano/' + gifID);
	  	f.set(listOfImages);
	}

	
	// update stats on every iteration
	document.addEventListener('clmtrackrIteration', function(event) {
		stats.update();
	}, false);
