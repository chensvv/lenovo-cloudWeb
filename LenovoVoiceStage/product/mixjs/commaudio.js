$(function () {
    loadTop("product");   
});

function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);
    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}


function updateAnalysers(time) {
	if(!analyserContext) {
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
			gradient = analyserContext.createLinearGradient(110,228,187, .1);
		gradient.addColorStop(1, '#3399ff');
		gradient.addColorStop(0.5, '#3399ff');
		gradient.addColorStop(0, '#f00');
		// var cwidth = canvasWidth;
		// var cheight = canvasHeight - 2;
		// var capYPositionArray = [];
		analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
		analyserContext.fillStyle = 'rgba(124,238,187,1)';
		    //  analyserContext.lineCap = 'round';
		// var multiplier = analyserNode.frequencyBinCount / numBars;

		function draw() {
			analyserNode.getByteFrequencyData(freqByteData);
			analyserContext.fillRect(0, -100, canvasWidth, canvasHeight);

			analyserContext.lineWidth = 1;

            // 波纹颜色
			analyserContext.strokeStyle = '#fff';

			analyserContext.beginPath();

			analyserContext.moveTo(0, 0);
			analyserContext.lineTo(2000, 0);
			analyserContext.stroke();
			analyserContext.moveTo(0, 0);
			var sliceWidth = canvasWidth * 10 / analyserNode.frequencyBinCount / 4;
			var x = 0;
			for(var i = 0; i < analyserNode.fftSize; i++) {
				var v = freqByteData[i] / 70;
				var y = v * canvasHeight / 4;
				var aa = Math.floor(x);
				if(aa % 2 == 0) {

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
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

function gotStream(stream) {
    var audioContext = new AudioContext();
    inputPoint = audioContext.createGain();
    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}
function getUserMedia(constrains,success,error){
    if(navigator.mediaDevices.getUserMedia){
        //最新标准API
        navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia){
        //webkit内核浏览器
        navigator.webkitGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.mozGetUserMedia){
        //Firefox浏览器
        navagator.mozGetUserMedia(constrains).then(success).catch(error);
    } else if (navigator.getUserMedia){
        //旧版API
        navigator.getUserMedia(constrains).then(success).catch(error);
	}
}

function initAudio() {
	if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
        //调用用户媒体设备，访问摄像头
            getUserMedia({
                audio:true
            },gotStream,error);
        } else {
            alert("你的浏览器不支持访问用户媒体设备");
        }
}
function error(error){
	console.log('访问媒体设备失败：',error.name,error.message)
}

window.addEventListener('load', initAudio );
function LenovoIdSyncLoginState(lenovoid_wust) {
    _club_login_status = true;
    take_st_login = true;
    $.ajax({
            type:"get",
            url:urlhead+"/lasf/logininfo",
            headers:{
                'channel':'cloudasr'
            },
            data:"securekey="+lenovoid_wust,
            dataType:'json',
            success:function(data){
                if (typeof(data) == 'undefined')
            var data = {
                'status': 'error'
            };
            if (data.status == 'success') {
                window.localStorage.setItem('secretkey',data.secretkey);
                window.localStorage.setItem('accountid',data.AccountID);
                window.localStorage.setItem('lenovoname',data.name);
                window.localStorage.setItem('Username',data.Username);
                //window.location.reload();
            } else if (data.status == 'failed') {
//	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html';
                   window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
            } else if (data.status == 'error') {

            }
            }
       });
}




//Avatar数据统计

$(function(){
    var Username = window.localStorage.getItem('Username');
	var accountid = window.localStorage.getItem('accountid');
	var lenkey=null;
	var secrkey=null;
	$.ajax({
		type:"POST",
		url:urlhead+"/lasf/userinfo",
		headers: {  
			"channel" : "cloudasr"
        },
        data:{"username":Username,"lenovoid":accountid},
		success:function(data){
			lenkey=data.lenovokey;
			secrkey=data.secretkey;		
			var aa=window.localStorage.setItem('lenkey',lenkey);
			var bb=window.localStorage.setItem('secrkey',secrkey);
		}
		
	});
	
})
