
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

$(function () {
   loadTop("product");
   //修改nlp结果
   $(".subdate").click(function(){
		var $val=$(".update").val();
		$.ajax({
			type:"get",
			url:"/lasf/nlp",
			data:{"uid":"466543","vdm":"music","cmd":$val,"app":"kk"},	           
			success:function(data){
				console.log(data);
				$("#json").html('"'+"result"+'"：'+syntaxHighlight(data));
			}
		});
	})
});


function sendBlob(blob) {
    var URL = "/lasf/asr";
	var reader = new FileReader();
    reader.readAsArrayBuffer(blob, 'utf-8');
    reader.onload = function (e) {
        var buf = new  Uint16Array(reader.result);
        var buf2=[5,0,0,0];
        var buf4=new Uint16Array(buf.length+4);
            buf4[0]=5;
            buf4[1]=0;
            buf4[2]=0;
            buf4[3]=0;
        for(i=0;i<buf.length;i++){
            buf4[i+4]=buf[i];
        }
         
        var formData = new FormData();
        var ixid  = new Date().getTime();
        var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.0.0&did=83102d26aaca24ba&uid=30323575" +
            "&stm=0&key=a&ssm=true&vdm=music&rvr=&sce=cmd&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            "&dev=lenovo.rt.urc.lv.develop&ixid="+ixid+"&pidx=1&over=1&rsts=0" +
            "&spts=0&fpts=0&cpts=0&lrts=0";
        formData.append("param-data", params);
        formData.append("voice-data", new Blob([buf4]));
        console.log(new Blob([buf4]));
        var request = new XMLHttpRequest();
        request.open("POST", URL);
        request.onreadystatechange=function() {
           updateStatus(request.responseText);
        };
        
		var accountid = window.localStorage.getItem('accountid');
		var lenkey = window.localStorage.getItem('lenkey');
		var secrkey = window.localStorage.getItem('secrkey');

        request.setRequestHeader('channel','cloudasr');
        request.setRequestHeader('lenovokey',lenkey);
        request.setRequestHeader('secretkey',secrkey);
                 
//      request.setRequestHeader('lenovoid',window.localStorage.getItem('accountid'));
//      request.setRequestHeader('secretkey',window.localStorage.getItem('secretkey'));

        request.send(formData);
    }
}

//封装json数据显示方法
function syntaxHighlight(json) {
	    if (typeof json != 'string') {
	        json = JSON.stringify(json, undefined, 2);
	    }
	    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
	    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
	        var cls = 'number';
	        if (/^"rawText/.test(match)) {
	            cls = 'string';
	        }else if(/"[\u4e00-\u9fa5]/.test(match)){
	        	 cls = 'key';
	        } else if (/true|false/.test(match)) {
	            cls = 'boolean';
	        } else if (/null/.test(match)) {
	            cls = 'null';
	        }
	        return '<span class="' + cls + '">' + match + '</span>';
	    });
}


function updateStatus(status) {
    var statusP = document.getElementById( "status" );
    var data = "";
    try {
        var s = JSON.parse(status);
        if (s.errorcode === 1) {
            data = s.errormessage
        } else {
            data = s.rawText;
            if(typeof data =='undefined'){
                data = '没听清楚，请点击麦克风后再说一次';
            }
        }
    }catch(e){
        data = '没听清楚，请点击麦克风后再说一次';
    }
//  statusP.innerHTML = data;

    $("#status").html("识别结果：");
    
	
	$('#json').html(syntaxHighlight(s));
	$('pre').slideDown(500);
	$("#json .string").next(".key").css("color","red");
	$(".update").val(s.rawText);
	$(".upd").css("display","block");
}


function gotBuffers( buffers ) {
    var canvas = document.getElementById( "wavedisplay" );
    var cancontext=canvas.getContext('2d');  
    var viz = document.getElementById( "viz" );
   canvas.width=viz.offsetWidth;	 
    $(window).resize(function() {
    	canvas.width=viz.offsetWidth;
	    drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
	});
	drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );
    audioRecorder.exportMonoWAV( sendBlob );
    
}



function toggleRecording( e ) {
    var accountid = window.localStorage.getItem('accountid');
    if (accountid=="" || accountid==null||accountid.length == 0) {
        var statusP = document.getElementById( "status" );
        statusP.innerHTML = "<a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }

    var img_btn = document.getElementById('record');
    var statusP = document.getElementById( "status" );
    if (e.classList.contains("recording")) {
        // stop recording
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers( gotBuffers );
        statusP.innerHTML = '正在识别语音......';
        img_btn.src = 'images/voice_btn_1.png';
        $('.product-picture .pulse1').css("display","none");
         $('.product-picture .pulse').css("display","none");
        
        document.getElementById("analyser").style.display="none";
        document.getElementById("wavedisplay").style.display="block";
        
    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        //Avatar数据统计
        avatarnum();
        audioRecorder.clear();
        audioRecorder.record();
//      $("#json").html("");
        $('pre').hide();
        $(".upd").css("display","none");
//      img_btn.src = 'images/voice_btn_2.png';
        $('.product-picture .pulse').css("display","block");
        $('.product-picture .pulse1').css("display","block");  
        $(".shu").css("display","none")
        statusP.innerHTML = '请说话';
        document.getElementById("analyser").style.display="block";
        document.getElementById("wavedisplay").style.display="none";
    }
}



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
        jQuery.get('/lasf/logininfo', {
            'securekey': lenovoid_wust
        }, function(data) {
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
        }, 'json');
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
//  Avatar.push(['track', document.getElementById('record'), {parser: clickLink1, args: ['Username', 'accountid']}]);	
    Avatar.push(['track', ['Clickvoice', 'voice', '语音识别点击', {Username:Username, accountid:accountid, arg3:0, arg4:0, arg5:0}, 0]]);

    
    function clickfile(evt, target){
			return ['Clickpage3', 'files', '文档页面点击', {arg1:0, arg2:0, arg3:0, arg4:0, arg5:0}, 0];
	}
	Avatar.push(['register', document.getElementById('third'), clickfile]);
}