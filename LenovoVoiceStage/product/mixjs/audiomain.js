var lenkey = $.base64.decode(window.localStorage.getItem('lk'));
var secrkey = $.base64.decode(window.localStorage.getItem('sk'));
var accountidd = window.localStorage.getItem('acd');
var lang
var samp
var urlInfo = urlhead +'/lasf/cloudasr';
$(function () {
   //修改nlp结果
   $(".update").bind("keypress",function(event){
		if(event.keyCode == "13"){
            var $val=$(".update").val();
            $.ajax({
                type:"post",
                url:urlhead+"/lasf/nlp",
                data:{"uid":"466543","vdm":"music","cmd":$val,"app":"kk"},	           
                success:function(data){
                    $("#json").html('"'+"result"+'"：'+syntaxHighlight(data));
                }
            });
        }
    })
    lang = $('#langSel').find('option:selected').val()
    samp = $('#sampSel').find('option:selected').val()
    $('#langSel').change(function(){
        lang = $('#langSel').find('option:selected').val()
    })
    $('#sampSel').change(function(){
        samp = $('#sampSel').find('option:selected').val()
    })
});

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
    document.getElementById("stutsP").style.display="block";
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('#updateBtn').css('display','block')
    }
    var data = "";
    try {
        if (status.errorcode === 1) {
            data = status.errormessage
        } else {
            data = status.rawText;
            if(typeof data =='undefined'){
                data = '没听清楚，请点击麦克风后再说一次';
            }
        }
    }catch(e){
        data = '没听清楚，请点击麦克风后再说一次';
    }
    $("#statusD").css("display","none");
    $("#stutsP span").css("display",'inline-block');
	$('#json').html(syntaxHighlight(status));
	$('pre').slideDown(500);
	$("#json .string").next(".key").css("color","red");
	$(".update").val(status.rawText);
    $(".upd").css("display","block");
}

function user_login(){
    var urlHref = window.location.href
    window.localStorage.setItem('returnurl',urlHref);
    window.location.href = "../login/login.html";
}

function toggleRecording( e ) {
    $(".right_div_box").css({"display":"inline-block"});
    $('.left_div_box').css({"display":"none"});
    if (accountidd=="" || accountidd==null||accountidd.length == 0) {
        $('#statusU').css('display','block')
        return;
    }

    var img_btn = document.getElementById('record');
    if (e.classList.contains("recording")) {
        img_btn.src = 'images/Mic-nor.png';
        // stop recording
        e.classList.remove("recording");
        $('#statusP').css('display','none')
        $('#statusD').css('display','block')
        $('.viz').css('display','none');
        recStop();
        $('#langSel').attr('disabled',false)
        $('#sampSel').attr('disabled',false)
    } else {
        // start recording
        e.classList.add("recording");
        $('#langSel').attr('disabled',true)
        $('#sampSel').attr('disabled',true)
        $('pre').hide();
        $(".upd").css("display","none");
        $(".shu").css("display","none");
        $('.viz').css('display','block');
        $('#statusP').css('display','block')
        document.getElementById("stutsP").style.display="none";
        img_btn.src = 'images/Mic-act.png';
        recOpen();
        //Avatar数据统计
         avatarnum();
    }
}

function recOpen(success){
    console.log(samp)
    rec=Recorder({
        type:"wav",sampleRate:samp,bitRate:16 ,
        onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){
            wave.input(buffers[buffers.length-1],powerLevel,bufferSampleRate);//输入音频数据，更新显示波形
        }
    });

    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    rec.open(function(){//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        wave=Recorder.WaveView({
            elem:".viz" //自动显示到dom，并以此dom大小为显示大小
                //或者配置显示大小，手动把waveviewObj.elem显示到别的地方
            // ,width:300 //显示宽度
            // ,height:50 //显示高度
            
            //以上配置二选一
            
            ,scale:2 //缩放系数，应为正整数，使用2(3? no!)倍宽高进行绘制，避免移动端绘制模糊
            ,speed:8 //移动速度系数，越大越快
            
            ,lineWidth:3 //线条基础粗细
                    
            //渐变色配置：[位置，css颜色，...] 位置: 取值0.0-1.0之间
            ,linear1:[0,"rgba(150,96,238,1)",0.2,"rgba(170,79,249,1)",1,"rgba(53,199,253,1)"] //线条渐变色1，从左到右
            ,linear2:[0,"rgba(209,130,255,0.6)",1,"rgba(53,199,255,0.6)"] //线条渐变色2，从左到右
            ,linearBg:[0,"rgba(255,255,255,0.2)",1,"rgba(54,197,252,0.2)"] //背景渐变色，从上到下
        });
        rec.start() //此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        success&&success();
    },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        // console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
        alert("无法录音:"+msg)
    });
};
/**开始录音**/
function recStart(){//打开了录音后才能进行start、stop调用
    
};
function recStop(){
    rec.stop(function(blob,duration){
        // console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
        rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        rec=null;
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob, 'utf-8');
        reader.onload = function (e) {
            var buf = new Uint16Array(reader.result);
            var buf2=[];
            Object.assign(buf2,buf);
            if(samp == '8000'){
                buf2.unshift(1, 0, 0, 0);
            }else{
                buf2.unshift(5, 0, 0, 0);
            }
            // buf2.unshift(5,0,0,0);
            var buf4=new Uint16Array(buf2);
            var formData = new FormData();
            var ixid  = new Date().getTime();
            // var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.0.0&did=83102d26aaca24ba&uid=30323575" +
            //     "&stm=0&key=a&ssm=true&vdm=music&rvr=&sce=cmd&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            //     "&dev=lenovo.rt.urc.lv.develop&ixid="+ixid+"&pidx=1&over=1&rsts=0" +
            //     "&spts=0&fpts=0&cpts=0&lrts=0&n2lang="+lang;
            formData.append("scene", 'short');
            formData.append("language", lang);
            formData.append("sample", '1');
            formData.append("audioFormat", 'pcm_'+samp+'_16bit_sample');
            formData.append("sessionid", ixid);
            formData.append("packageid", "1");
            formData.append("over", "1");
            formData.append("voice-data", new Blob([buf4]));
            axios.post(urlInfo,formData,{
                headers:{
                    'channel':'cloudasr',
                    'lenovokey':lenkey,
                    'secretkey': secrkey
                }
            }).then(res=>{
                updateStatus(res.data)
            }).catch(err=>{
                document.getElementById("status").innerHTML = '服务器错误，请稍后重试'
            })
        }
    },function(msg){
        alert("录音失败:"+msg);
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
    });
};

