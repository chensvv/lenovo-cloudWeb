window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
//var audioContext = new AudioContext();
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
var recIndex = 0;
var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)

$(function () {
   //修改nlp结果
   $(".update").bind("keypress",function(event){
		if(event.keyCode == "13"){
            var $val=$(".update").val();
            $.ajax({
                type:"get",
                url:urlhead+"/lasf/nlp",
                data:{"uid":"466543","vdm":"music","cmd":$val,"app":"kk"},	           
                success:function(data){
                    $("#json").html('"'+"result"+'"：'+syntaxHighlight(data));
                }
            });
        }
    })
   
    var win_h=$(window).height();
    // console.log(win_h)
	window.addEventListener('resize',function(){
		if($(window).height()<win_h){
            $(".realtime-btn").hide()
		}else{
			$(".realtime-btn").show()
		}
	})
});
function updateBtn(){
    var $val=$(".update").val();
    $.ajax({
        type:"get",
        url:urlhead+"/lasf/nlp",
        data:{"uid":"466543","vdm":"music","cmd":$val,"app":"kk"},	           
        success:function(data){
            $("#json").html('"'+"result"+'"：'+syntaxHighlight(data));
        }
    });
}

function sendBlob(blob) {
    var URL = urlhead+"/lasf/asr";
	var reader = new FileReader();
    reader.readAsArrayBuffer(blob, 'utf-8');
    reader.onload = function (e) {
        var buf = new Uint16Array(reader.result);
        var buf2=[]; 
        Object.assign(buf2,buf);
        buf2.unshift(5,0,0,0);
        var buf4=new Uint16Array(buf2);
        var formData = new FormData();
        var ixid  = new Date().getTime();
        var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.0.0&did=83102d26aaca24ba&uid=30323575" +
            "&stm=0&key=a&ssm=true&vdm=music&rvr=&sce=cmd&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            "&dev=lenovo.rt.urc.lv.develop&ixid="+ixid+"&pidx=1&over=1&rsts=0" +
            "&spts=0&fpts=0&cpts=0&lrts=0";
        formData.append("param-data", params);
        formData.append("voice-data", new Blob([buf4]));
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
    var btn=$("<input type='button' id='updateBtn' onclick='updateBtn()' value='修改'>");
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
    $("#status").html("识别结果");
    $("#status").css({"display":"none"});
    $("#stutsP").html("识别结果");
    if(user){
        $("#stutsP").append(btn)
    }
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
    $(".right_div_box").css({"display":"inline-block"})
    $('.left_div_box').css({"display":"none"})
    // $('#record').attr('src','./images/Mic-act.png')
    // console.log('22222222')
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
        // console.log("1111111")
        audioRecorder.stop();
        e.classList.remove("recording");
        audioRecorder.getBuffers( gotBuffers );
        statusP.innerHTML = '正在识别语音......';
        // img_btn.src = 'images/Mic-act.png';
        // $('.product-picture .pulse1').css("display","none");
        //  $('.product-picture .pulse').css("display","none");
        
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
        // $('.product-picture .pulse').css("display","block");
        // $('.product-picture .pulse1').css("display","block");  
        $(".shu").css("display","none")
        statusP.innerHTML = '请说话';
        img_btn.src = 'images/Mic-act.png';
        document.getElementById("analyser").style.display="block";
        document.getElementById("wavedisplay").style.display="none";
    }
}





