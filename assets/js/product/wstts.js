
var testAllPcm,testSampleRate,testInfo;
var testType,testDecode,testTransform;
var ws;
var uri = 'wss://voice.lenovomm.com/website/wscloudtts/';
// var uri = 'ws://10.110.148.57:8085/lasf/wscloudtts/'
// var uri = 'ws://10.110.148.57:8085/vehicle/wscloudtts/'
var n = 0;
var accountid = window.localStorage.getItem('acd')
$('#tts-loading').hide()
var startMp3=function(){
	testType="wav";
	testDecode=true;
	testTransform=function(pcm,sampleRate,True,False){
		True(pcm,sampleRate);
	};
	start();
};


var stream;
var start=function(){
	if(stream){
		stop();
	}
	
	socket()
	testAllPcm=[];
	testInfo={};
	
	stream=Recorder.BufferStreamPlayer({
		decode:testDecode //传输过来的不是pcm就需要开启解码
		,onInputError:function(errMsg, inputIndex){
			console.log("第"+inputIndex+"次的音频片段input输入出错: "+errMsg,1);
		}
		,onUpdateTime:function(){
				(stream.isStop?'<span style="color:red">已停止</span>':
				stream.isPause?'<span style="color:#aaa">已暂停</span>':
				stream.isPlayEnd?'<span style="color:#fa0">已完成...</span>'
								:'<span style="color:#0b1">播放中...</span>')
		}
		,onPlayEnd:function(){
			if(!stream.isStop){
				$('.voice-play').css('display','block')
				$('.voice-pause').css('display','none')
				console.log('没有可播放的数据了，缓冲中 或者 已播放完成');
			};
		}
		,transform:function(pcm,sampleRate,True,False){
			testTransform(pcm,sampleRate,function(pcm,sampleRate){
				True(pcm,sampleRate);
				
				testSampleRate=sampleRate;
				testAllPcm.push(pcm);//另存一份 结束时转成一个完整音频 对比接收到的数据音质
			},False);
		}
		
	});
	
	stream.start(function(){
		console.log("stream已打开["+testType+"]，正在播放中",2);
		// recStart();//调用Recorder连接到这个stream进行可视化绘制
	},function(err){
		console.log("开始失败："+err,1);
	});
	
};
var stop=function(){
	ws.onclose();
	
	if(stream){
		stream.stop();
	}
	stream=0;
	$('.voice-play').css('display','block')
	$('.voice-pause').css('display','none')
	console.log("已结束");
	
	//生成一份完整的音频，对比音质
	var oldType=testType;
	var data=Recorder.SampleData(testAllPcm,testSampleRate,testSampleRate);
	var recMock=Recorder({type:"mp3",sampleRate:testSampleRate});
	recMock.mock(data.data,testSampleRate);
	recMock.stop(function(blob,duration){
		// const blobs = new Blob([blob], { type: 'audio/mp3' });
		// const url = URL.createObjectURL(blobs);
		
		// // console.log(sourceBuffer)
		// // 创建链接
		// const link = document.createElement('a');
		// link.href = url;
		// link.download = 'filename.mp3';
		// document.body.appendChild(link);
		// link.click();
		// document.body.removeChild(link);
		// console.log(blob,duration,recMock,"接收到的所有"+oldType+"数据生成的完整文件");
	});
};



var pause=function(){
	if(stream){
		stream.pause();
		$('.voice-play').css('display','block')
		$('.voice-pause').css('display','none')
		console.log("已暂停播放");
		
	}
};
var resume=function(){
	if(stream){
		stream.resume();
		$('.voice-play').css('display','none')
		$('.voice-pause').css('display','block')
		console.log("已恢复播放");
	}
};

//实时的接收到了音频片段文件，通过input方法输入到流里面
var receiveAudioChunk=function(arrayBuffer){
	if(stream && !testInfo.receivePause){
		testInfo.count=(testInfo.count||0)+1;
		var allSize=testInfo.allSize=(testInfo.allSize||0)+arrayBuffer.byteLength;
		if(allSize<1024*900){
			allSize=(allSize/1024).toFixed(2)+"KB";
		}else{
			allSize=(allSize/1024/1024).toFixed(2)+"MB";
		};
		
		// $(".receiveInfo").append(""
		// 	+"<p>"+format(Date.parse(new Date()))+"第"+testInfo.count+"次收到"+testType+"片段"+arrayBuffer.byteLength+"字节"
		// 	+"，共收到"+allSize+"</p>")
			// +(stream.set.realtime?"，实时模式":"，非实时模式");
			// console.log(bufferArray)
			stream.input(arrayBuffer);
	}
};
var receivePause=function(){
	console.log("已暂停接收，发送过来的数据全部丢弃");
	testInfo.receivePause=1;
};
var receiveResume=function(){
	console.log("已恢复接收");
	testInfo.receivePause=0;
};

function socket(){
	var wsServer = `${uri}${accountid}/${document.getElementById('myrange').value}/${document.getElementById('myvol').value}/${document.getElementById('mypitch').value}/xxxx/${$('#seletype .active')[0].id}/${accountid}/token/${new Date().getTime()}/cloudasr/${localStorage.getItem('lk')}/${localStorage.getItem('sk')}`
	ws = new WebSocket(wsServer);
	ws.binaryType = 'arraybuffer'; //arraybuffer
	ws.onopen = function (evt) {
		WS_Open(evt)

	};
	ws.onclose = function (evt) {
		WS_Close(evt)
	};
	ws.onmessage = function (evt) {
		WS_OnMessage(evt)
	};
	ws.onerror = function (evt) {
		WS_error(evt)
	};
}




/************WebSocket实时接收到音频片段**************/
var WS_OnMessage=function(e){
	var data=e.data;
	if(e.data.byteLength !=0){
		if(data instanceof ArrayBuffer) {
			//binary message
			receiveAudioChunk(data);
		}
	}
	
};
var WS_Open=function(){
	console.log("Connected to WebSocket server.");
		var mess = document.getElementById("textarea").value;
		// for(var i = 0; i<mess.length;i++){
		// 	console.log(mess[i])
			ws.send(BASE64.encode(mess));
		// }
		
};
var WS_Close=function(){
	console.log('closed')
};
var WS_error = function(evt) {
	console.log('Error occured: ' + evt.data);
	Swal.fire({
		text:$.i18n.prop('server_error'),
		confirmButtonText: $.i18n.prop('confirm'),
		confirmButtonColor: '#94cb82'
	})
}

function random(){
    let arrList = ['前方150米，请在道路尽头左转，进入后厂村路。','前面还有27名等候人员排队','两岸猿声啼不住，轻舟已过万重山','白日依山尽，黄河入海流。欲穷千里目，更上一层楼。']
    n = n + 1;
    if(n == arrList.length){
        n = 0;
    }
    $('#textarea').val(arrList[n])
}
function setShowLength(obj, maxlength, id) {
	var rem = maxlength - obj.value.length; 
	if (rem < 0){ 
		rem = 0; 
	} 
	$('#number').html(rem) 
}