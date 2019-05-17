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
var over = 0;

var liid = 0;
var firstup = true;



var worker = null;
var urlheader = urlhead+"/lasf/asr";
var accountid = window.localStorage.getItem('accountid');
var lenkey = window.localStorage.getItem('lenkey');
var secrkey = window.localStorage.getItem('secrkey');
var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
if(!user){
    $('html,body').css({"min-width":"1200px"})
	$('html,body').css({"min-height":"685px"})
}

function sendBlob(blob) {
    console.log(blob)
    worker.postMessage(
        {
        	urlheader:urlheader,
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
            if (firstup) {
                $("#status2").append("<span class='li_id' id='liid_" + liid + "'>" + data2 + "</span>");
                 
                firstup = false;
            }
            if (data2.length > 0) {
                var liidselect = document.getElementById("liid_" + liid);
                $("#liid_" + liid).text(data2);
                $("#liid_" + liid).css("color","#74797acc");

                if (s.rawType == 'final') {
                	$("#liid_" + liid).css("color","#000000");
                    liid++;
                    $("#status2").append("<span class='li_id' id='liid_" + liid + "'></span>");
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
    $('#record').attr('src','./images/Mic-act.png')
    var con = document.getElementsByClassName('content_box')[0]
    
    var accountid = window.localStorage.getItem('accountid');
    if (accountid == "" || accountid == null || accountid.length == 0) {
        var statusP = document.getElementById("status");
        statusP.innerHTML = "<a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    var img_btn = document.getElementById('record');
    if (e.classList.contains("recording")) {
    	audioRecorder.stop();
    	e.classList.remove("recording");
        clearInterval(time1);
        window.clearInterval(int);
        window.clearInterval(timers);       
        $('.product-picture .pulse1').css("display", "none");
        $('.product-picture .pulse').css("display", "none");    
        over++;
        audioRecorder.getBuffers(gotBuffers);
        img_btn.src = 'images/Mic-nor.png';
        
    } else {
    	if (!audioRecorder)
            return;
        e.classList.add("recording");
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
     $(".content_font").css("display","block");
        over = 0;
        worker = new Worker("mixjs/audioSend.js");
        worker.onmessage = function (e) {
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

        time1 = setInterval(record, 470);   
        // $(".prompt").css("display","none");
        $('.product-picture .pulse').css("display", "block");
        $('.product-picture .pulse1').css("display", "block");
        var statusP = document.getElementById("status");
        statusP.innerHTML = '请说话';
        if(statusP.innerHTML = '请说话'){
            document.getElementById("dis_none").style.display = 'none';
            con.classList.add('con_box')
            $('.content_box').css({"padding":"50px 130px"})
            $('.arrow_right').css("display","none")
        }
        
        // document.getElementById("wavedisplay").style.display = "block";
    }
}


$(function(){
    	window.clearInterval(int);
	    millisecond=hour=minute=second=0;
	    document.getElementById('timetext').value='00:00:00';
})