window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
var URL = "/lasf/asr";
// var URL = "http://10.100.216.59:8080/lasf/asr";
var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var over = 0;

var liid = 0;
var firstup = true;
$(function () {
    loadTop("product");
});


var worker = null;

var accountid = window.localStorage.getItem('accountid');
var lenkey = window.localStorage.getItem('lenkey');
var secrkey = window.localStorage.getItem('secrkey');
function sendBlob(blob) {
    worker.postMessage(
        {
            buffer: blob,
            over: over,
            lenkey: lenkey,
            secrkey: secrkey
        });
}
function updateStatus(status) {
    var statusP = document.getElementById("status");
    var statusP2 = document.getElementById("status2");
    var data = "";
    var data2 = "";
    var final = "";
    var html = "";

    try {
        var s = JSON.parse(status);
        if (s.errorcode === 1) {
            data = s.errormessage
        } else {

            data2 = s.rawText;
//          console.info("liid:" + liid);
            if (firstup) {
                $("#status2").append("<span id='liid_" + liid + "'>" + data2 + "</span>");
                 
                firstup = false;
            }
            if (data2.length > 0) {
                var liidselect = document.getElementById("liid_" + liid);
                $("#liid_" + liid).text(data2);
                $("#liid_" + liid).css("color","#74797acc");

                if (s.rawType == 'final') {
                	$("#liid_" + liid).css("color","#000000");
                    liid++;
                    $("#status2").append("<span id='liid_" + liid + "'></span>");
                }
            }

 
			if(Math.abs(statusP2.scrollHeight-statusP2.scrollTop-statusP2.clientHeight)<23){
				statusP2.scrollTop = statusP2.scrollHeight;
				
			}    
            
            if (typeof data == 'undefined') {
                data = '没听清楚，请点击麦克风后再说一次';
            }
        }

    } catch (e) {
        data = '没听清楚，请点击麦克风后再说一次';
    }
    statusP.innerHTML = data;


}

var buff=[];
function gotBuffers(buffers) {
    var canvas = document.getElementById("wavedisplay");
    var cancontext = canvas.getContext('2d');
    var viz = document.getElementById("viz");
    canvas.width = viz.offsetWidth;
    cancontext.clearRect(100,0,canvas.width,canvas.height);  
    $(window).resize(function () {
        canvas.width = viz.offsetWidth;
        drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);
        audioRecorder.exportMonoWAV(sendBlob);
    });
    for(var i=0;i<buffers[0].length;i++){
    	var buf=buff.push(buffers[0][i]);
    }  
	buff=buff.slice(-100000);

    drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buff);
    audioRecorder.exportMonoWAV(sendBlob);
}

var time1 = "";
var timers = null;
var hour,minute,second;//时 分 秒
	hour=minute=second=0;//初始化
var millisecond=0;//毫秒
var int;
function toggleRecording(e) {
    var accountid = window.localStorage.getItem('accountid');
    if (accountid == "" || accountid == null || accountid.length == 0) {
        var statusP = document.getElementById("status");
        statusP.innerHTML = "<a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    var img_btn = document.getElementById('record');

    if (e.classList.contains("recording")) {
        clearInterval(time1);
        window.clearInterval(int);
        window.clearInterval(timers);
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        over++;
        audioRecorder.getBuffers(gotBuffers);
        img_btn.src = 'images/voice_btn_1.png';
        $('.product-picture .pulse1').css("display", "none");
        $('.product-picture .pulse').css("display", "none");
//      console.info("stop over:" + over);
    } else {
    	buff.length = 0;
    	window.clearInterval(int);
	    millisecond=hour=minute=second=0;
	    document.getElementById('timetext').value='00:00:00';	
	    int=setInterval(timer,1000);	 
	    function zero(n){
			return n=n<10?'0'+n:n;
		}
	    function timer()//计时
	    {
          second=second+1;
	      if(second>=60)
	      {
	        second=0;
	        minute=minute+1;
	      }
	  
	      if(minute>=60)
	      {
	        minute=0;
	        hour=hour+1;
	      }	      
	      document.getElementById('timetext').value=zero(hour)+':'+zero(minute)+':'+zero(second);
	  
	    }
    	
       window.clearInterval(timers);	
        e.classList.add("recording");
//      $("#status2").empty();
        over = 0;
        worker = new Worker("js/audioSend.js");
        worker.onmessage = function (e) {
//          console.info("worker.onmessage" + e.data);
            updateStatus(e.data);
            if (over == 1 && worker) {
                worker.terminate();
            }
        };
        function record() {
            if (!audioRecorder) {
                return;
            }
            audioRecorder.clear();
            audioRecorder.record();
            setTimeout(send, 450);
            function send() {
                if (over != 1) {
                    audioRecorder.getBuffers(gotBuffers);
                }
            }
        }

        record();
        time1 = setInterval(record, 500);
        $(".prompt").css("display","none");
        $('.product-picture .pulse').css("display", "block");
        $('.product-picture .pulse1').css("display", "block");
        var statusP = document.getElementById("status");
        statusP.innerHTML = '请说话';

        document.getElementById("wavedisplay").style.display = "block";
    }


}


function convertToMono(input) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);
    input.connect(splitter);
    splitter.connect(merger, 0, 0);
    splitter.connect(merger, 0, 1);
    return merger;
}


function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
        analyserContext.translate(0.5, canvasHeight / 2 + 0.5);
    }

    // 分析器在这里绘制代码
    {
        var SPACING = 1;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
        var capHeight = 20;
        var capStyle = '#FFFFFF',
            gradient = analyserContext.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#3399ff');
        gradient.addColorStop(0.5, '#3399ff');
        gradient.addColorStop(0, '#f00');
        var cwidth = canvasWidth;
        var cheight = canvasHeight - 2;
        var capYPositionArray = [];
        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#FFFFFF';
        //      analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        function draw() {
            analyserNode.getByteFrequencyData(freqByteData);
            analyserContext.fillRect(0, -100, canvasWidth, canvasHeight);

            analyserContext.lineWidth = 1;

            analyserContext.strokeStyle = '#3399ff';

            analyserContext.beginPath();

            analyserContext.moveTo(0, 0);
            analyserContext.lineTo(2000, 0);
            analyserContext.stroke();
            analyserContext.moveTo(0, 0);
            var sliceWidth = canvasWidth * 10 / analyserNode.frequencyBinCount / 4;
            var x = 0;
            for (var i = 0; i < analyserNode.fftSize; i++) {
                var v = freqByteData[i] / 70;
                var y = v * canvasHeight / 4;
                var aa = Math.floor(x);
                if (aa % 2 == 0) {

                    analyserContext.lineTo(aa, -y)
                } else {
                    analyserContext.lineTo(aa, y);
                }
                x += sliceWidth;
            }
            analyserContext.stroke();
        };

        draw();

    }

    rafID = window.requestAnimationFrame(updateAnalysers);
}


function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono(realAudioInput);
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);

    audioRecorder = new Recorder(inputPoint);

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect(zeroGain);
    zeroGain.connect(audioContext.destination);
    updateAnalysers();
}

function initAudio() {
    if (!navigator.getUserMedia)
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
        navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            }
        }, gotStream, function (e) {
            alert('未检测到声音');
//          console.log(e);
        });
}

window.addEventListener('load', initAudio);


function LenovoIdSyncLoginState(lenovoid_wust) {
    _club_login_status = true;
    take_st_login = true;
    jQuery.get('/lasf/logininfo', {
        'securekey': lenovoid_wust
    }, function (data) {
        if (typeof(data) == 'undefined')
            var data = {
                'status': 'error'
            };
        if (data.status == 'success') {
            document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
            window.localStorage.setItem('secretkey', data.secretkey);
            window.localStorage.setItem('accountid', data.AccountID);
            window.localStorage.setItem('lenovoname', data.name);
            window.localStorage.setItem('Username', data.Username);
            //window.location.reload();
        } else if (data.status == 'failed') {
            window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
        } else if (data.status == 'error') {

        }
    }, 'json');
}





$(function(){
    	window.clearInterval(int);
	    millisecond=hour=minute=second=0;
	    document.getElementById('timetext').value='00:00:00';
    	var Username = window.localStorage.getItem('Username');
		var accountid = window.localStorage.getItem('accountid');
		var lenkey=null;
		var secrkey=null;
		$.ajax({
			type:"POST",
			url:"/lasf/userinfo",
			headers: {  
				"channel" : "cloudasr"
            }, 
			data:{"username":Username,"lenovoid":accountid},
			async : false,
			success:function(data){
				 lenkey=data.lenovokey;
				 secrkey=data.secretkey;	
				 
				 var aa=window.localStorage.setItem('lenkey',lenkey);
				 var bb=window.localStorage.setItem('secrkey',secrkey);
			}			
		});
})