var chunkInfo;
var rec;
var path = ''
// var uri = 'wss://voice.lenovomm.com/website/wscloudasr/'
var uri = 'wss://voice.lenovomm.com/website/webSocket/'
// var uri = 'ws://10.110.148.57:8084/lasf/webSocket/'
var ws
var ixid
var pidx = 1
var over = 0
var accountid = $.base64.decode(window.localStorage.getItem('acd'))
var username = $.base64.decode(window.localStorage.getItem('token'))
var lenkey = $.base64.decode(window.localStorage.getItem('lk'))
var secrkey = $.base64.decode(window.localStorage.getItem('sk'))
var userToken = window.localStorage.getItem('token')
var h = 0,m = 0,s = 0,ms = 0,time = 0 //定时器
var str = '00:00:00'
var times = ''
var rt = ''
var firstup = true
var liid = 0
var statu = 0
var img_btn = document.getElementById('record')

function toggleRecording(e){
    if (userToken == "" || userToken == null) {
        Swal.fire({
            text: $.i18n.prop('firstLogin'),
            showCancelButton: true,
            allowOutsideClick:false,
            allowEscapeKey:false,
            reverseButtons:true,
            width:'16em',
            confirmButtonColor: '#94cb82',
            cancelButtonColor: '#d33',
            confirmButtonText: $.i18n.prop('confirm'),
            cancelButtonText:$.i18n.prop('cancel')
        }).then((result) => {
            if (result.isConfirmed) {
                var url = window.location.href
                window.localStorage.setItem('returnurl',url)
                window.location.href = '../login/login.html'
            }
        })
    }else{
        if (e.classList.contains("recordm")) {
            e.classList.remove("recordm");
            over++
            ws.send(new Blob([ ]))
            recStop(e)
            timerReset()
            ws.close()
            pidx = 1
        }else{
            e.classList.add("recordm");
            if(localStorage.getItem('us') == 1 || localStorage.getItem('us') == 3){
                
                getIxid(e)
            }else{
                Swal.fire({
                    text: $.i18n.prop('service_not_open'),
                    showCancelButton: true,
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    reverseButtons:true,
                    width:'16em',
                    confirmButtonColor: '#94cb82',
                    cancelButtonColor: '#d33',
                    confirmButtonText: $.i18n.prop('go_to_open'),
                    cancelButtonText:$.i18n.prop('cancel')
                }).then((result) => {
                    if (result.isConfirmed) {
                      window.location.href = '../user/uservice.html'
                    }
                })
            }
        }
    }
    
}

function socket () {
    ws = new WebSocket(path)
    ws.onopen = function(){
        // console.log('ws已连接')
        over = 0
        recOpen()
    }
    ws.onerror = function(error){
        timerReset()
        Swal.fire({
            text:$.i18n.prop('server_error'),
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
        recStop()
    }
    ws.onmessage = function(data){
        let res = JSON.parse(data.data)
        if(res.errorcode == 1){
            statu = 1
            recStop()
            ws.close()
            timerReset()
            Swal.fire({
                text:res.errormessage,
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }else if(res.status == 'failed'){
            statu = 1
            recStop()
            ws.close()
            timerReset()
            Swal.fire({
                text:$.i18n.prop('syserr'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }else{
            statu = 0
            rt = res.rawText
            if(firstup){
                $('#txt-f').html('')
                $("#txt-f").append("<span class='li_id' id='liid_" + liid + "'>" + rt + "</span>");
                firstup = false;
            }
            if (rt.length > 0) {
                $("#liid_" + liid).text(rt);
                if (res.rawType == 'final') {
                    $("#liid_" + liid).css("color","#000000");
                    liid++;
                    $("#txt-f").append("<span class='li_id' id='liid_" + liid + "'></span>");
                }
            }
            
        }
    },
    ws.onclose = function(){
        // console.log('closed')
        timerReset()
    }
}

function getIxid(){
    $.ajax({
        url:proURL+'/gensessionid',
        type:'post',
        success:function(res){
            var ixids = String(res)
            // path = `${uri}${$.base64.encode(JSON.stringify(params))}`
            path = `${uri}${localStorage.getItem('un')}/${localStorage.getItem('lk')}/${localStorage.getItem('sk')}/${res}/chinese/pcm_16000_16bit_sample/long`
            socket()
        }
    })
    
}

function recOpen(){
    rec = Recorder({
        type: "wav",
        bitRate: 16,
        sampleRate: 16000,
        bufferSize: 4096,
        onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate) {
            chunkInfo = Recorder.SampleData(buffers, bufferSampleRate, rec.set.sampleRate, chunkInfo);
            var buf = chunkInfo.data
            if (pidx == 1) {
                var buf2 = [];
                    buf2.unshift(5, 0, 0, 0, ...buf);
                var buf4 = new Int16Array(buf2);
                pidx++
            } else {
                var buf4 = buf;
            }
            ws.send(new Blob([buf4]))
        }
    });
    rec.open(function () {
        //开始录音
        chunkInfo = null
        rec.start()
        if(statu == 0){
            $('.hint-sp-left').css('display','none')
            $('.mic').css('display','none')
            $('.result-box').css('display','block')
            $('.line-box').css("display","inline-block");
            $('.record-btn').addClass('recording')
            $('.mic-btn').html($.i18n.prop('stop'))
            timerStart()
        }
    }, function (msg, isUserNotAllow) {
        //用户拒绝了权限或浏览器不支持
        $('#record').removeClass('recordm')
        $('.line-box').css("display","none");
        $('.mic').css('display','inline-block')
        $('.record-btn').removeClass('recording')
        $('.mic-btn').html($.i18n.prop('start'))
        timerReset()
        rec.close()
        ws.close()
        Swal.fire({
            text:msg,
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
        
    });
}
function recStop(){
    rec.stop(function(blob,duration){
        // console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
        ws.close()
        rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        // rec=null;
        $('#record').removeClass('recordm')
        $('.line-box').css("display","none");
        $('.mic').css('display','inline-block')
        $('.record-btn').removeClass('recording')
        $('.mic-btn').html($.i18n.prop('start'))
        pidx = 1
        over = 0
        rt = ''
        liid = 0
        firstup = true
        console.log(firstup)
        timerReset()
        if(statu == 1){
            $('.hint-sp-left').css('display','block')
            $('.result-box').css('display','none')
            
        }
    },function(msg){
        ws.close()
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
        Swal.fire({
            text:msg,
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
    });
}

function timerStart(){  //开始
    time=setInterval(timer,50);
}

function timerStop(){  //暂停
    clearInterval(time);
}
function timerReset(){  //重置
    clearInterval(time);
    h=0;
    m=0;
    ms=0;
    s=0;
    $('.long-timer').html("00:00:00")
}
function timer(){              //定义计时函数
    ms=ms+50;        //毫秒
    if(ms>=1000){
        ms=0;
        s=s+1;        //秒
    }
    if(s>=60){
        s=0;
        m=m+1;       //分钟
    }
    if(m>=60){
        m=0;
        h=h+1;        //小时
    }
    $('.long-timer').html(toDub(h)+":"+toDub(m)+":"+toDub(s))
    //统计共看了多少秒
    times=s + m*60 + h*3600 ;
}
function toDub(n){  //补0操作
    if(n<10){
        return "0"+n;
    }else {
        return ""+n;
    }
}