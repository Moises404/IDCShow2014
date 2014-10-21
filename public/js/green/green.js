var doc = document;
var video = doc.getElementById("video");
var hCanvas = doc.getElementById("hCanvas");
var dCanvas = doc.getElementById("dCanvas");
var hContext = hCanvas.getContext("2d");
var dContext = dCanvas.getContext("2d");
var vendorUrl = window.URL || window.webkitURl;

    navigator.getMedia = navigator.getUserMedia || 
    navigator.webkitGetUserMedia || 
    navigator.mozGetUserMedia || 
    navigator.msGetUserMedia;

    navigator.getMedia({
        video: true,
        audio: false
    }, function (stream) {
        video.src = vendorUrl.createObjectURL(stream);

        console.log('play')
        video.play();
    }, function (error) {
        // an error occured
        // error.code
    });


    // video.addEventListener('loadeddata', function () {
    //     hCanvas.setAttribute('width', video.offsetWidth);
    //     dCanvas.setAttribute('width', video.offsetWidth);
    //     hCanvas.setAttribute('height', video.offsetHeight);
    //     dCanvas.setAttribute('height', video.offsetHeight);
    // }, false);

    video.addEventListener('loadeddata', function () {
        hCanvas.setAttribute('width', '640px');
        dCanvas.setAttribute('width', '640px');
        hCanvas.setAttribute('height','440px');
        dCanvas.setAttribute('height', '440px');
    }, false);




    video.addEventListener('loadeddata', function () {
        console.log(video.videoWidth)
        runAnalysis();

        console.log('loadedddata')
    });

var runAnalysis = function () {
    if (video.paused || video.ended) {
        return;
    }
    frameFix();
    if (window.requestAnimationFrame) {
        requestAnimationFrame(runAnalysis);
    } else {
        setTimeout(runAnalysis, 0);
    }
};

var frameFix = function () {

    console.log(video, video.videoWidth, video.videoHeight)
    hContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    var frame = hContext.getImageData(0, 0, video.videoWidth, video.videoHeight),
        data = frame.data,
        length = data.length,
        i;

    for (i = 0; i < length; i += 4)

        if ((data[i] < val2 && data[i] > val1 ) && (data[i+1] < val4 && data[i+1] > val3) && (data[i+2] < val6 && data[i+2] > val5)) data[i + 3] = 0;

    dContext.putImageData(frame, 0, 0);
};