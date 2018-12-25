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

function initAudio() {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia  || navigator.msGetUserMedia;
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
        }, gotStream, function(e) {
            alert('未检测到声音');
        });
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
	                document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
	                window.localStorage.setItem('secretkey',data.secretkey);
	                window.localStorage.setItem('accountid',data.AccountID);
	                window.localStorage.setItem('lenovoname',data.name);
	                window.localStorage.setItem('Username',data.Username);
	                //window.location.reload();
	            } else if (data.status == 'failed') {
	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
	            } else if (data.status == 'error') {
	
	            }
	   	 	}
	   	});
    }


//Avatar数据统计
function avatarnum(){
   	var accountid = window.localStorage.getItem('accountid');
    var Username = window.localStorage.getItem('Username');		
    var scriptTag = document.createElement('script');
			scriptTag.type = 'text/javascript';
			scriptTag.async = true;
			scriptTag.src = '../common/js/avatar.js';
			var head= document.getElementsByTagName('head')[0] || document.documentElement;
			head.insertBefore(scriptTag, head.firstChild);			
			var avatar = window.Avatar = window.Avatar || [];
			avatar.push({
			    appKey: '5C9E6O46H2ZJ', // appkey
			    pageId: 'two',		// 页面标识
			    channel: 'webvoice2',		// 设置渠道
			    versionName: '1.2', // 设置版本
                versionCode: '01',	// 设置版本号
			    init: function(){

				}
			});
    function clickLink1(evt, target, arg1, arg2){
		return ['Clickvoice', 'voice', '语音识别点击', {arg1:0, arg2:0, arg3:0, arg4:0, arg5:0}, 0];
	}
	Avatar.push(['register', document.getElementById('record'), clickLink1]);
    Avatar.push(['track', ['Clickvoice', 'voice', '语音识别点击', {Username:Username, accountid:accountid, arg3:0, arg4:0, arg5:0}, 0]]);

    
    function clickfile(evt, target){
			return ['Clickpage3', 'files', '文档页面点击', {arg1:0, arg2:0, arg3:0, arg4:0, arg5:0}, 0];
	}
	Avatar.push(['register', document.getElementById('third'), clickfile]);
}


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