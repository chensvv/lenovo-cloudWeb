var chunkInfo;
var rec;
var urlInfo = 'https://voice.lenovo.com/lasf/cloudasr'
var ixid
var pidx = 1
var over = 0
var accountid = $.base64.decode(window.localStorage.getItem('acd'))
var accountidd = window.localStorage.getItem('acd')
var lenkey = $.base64.decode(window.localStorage.getItem('lk'))
var secrkey = $.base64.decode(window.localStorage.getItem('sk'))
var hour, minute, second; //时 分 秒
hour = minute = second = 0; //初始化
var millisecond = 0; //毫秒
var int;
var lang;
var samp;

function toggleRecording(e) {
    $('#record').attr('src', './images/Mic-act.png')
    var con = document.getElementsByClassName('content_box')[0]
    if (accountidd == "" || accountidd == null || accountidd.length == 0) {
        var statusP = document.getElementById("status");
        statusP.innerHTML = "<a onclick=\'user_login()\' target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    var img_btn = document.getElementById('record');
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        window.clearInterval(int);
        over++
        rec.stop()
        sendEnd()
        $('.product-picture .pulse1').css("display", "none");
        $('.product-picture .pulse').css("display", "none");
        img_btn.src = 'images/Mic-nor.png';
        $('#langSel').attr('disabled',false)
        $('#sampSel').attr('disabled',false)
        millisecond = hour = minute = second = 0;
        document.getElementById('timetext').value = '00:00:00';
        pidx = 1
    } else {
        e.classList.add("recording");
        $('#langSel').attr('disabled',true)
        $('#sampSel').attr('disabled',true)
        int = setInterval(timer, 1000);
        over = 0
        ixid = new Date().getTime();
        recd()
        document.getElementById("dis_none").style.display = 'none';
        con.classList.add('con_box')
        $('.content_box').css({"padding":"50px 130px"})
        $('.arrow_right').css("display","none")
        $(".content_font").css("display", "block");
        $('.product-picture .pulse').css("display", "block");
        $('.product-picture .pulse1').css("display", "block");
        setInterval(function(){
            var ph = $('.prompt').height()
            var th = $('#txt-f').height()
            if(th >=ph){
                $('.prompt').scrollTop(9999999)
            }
        }, 250)
    }
}

$(function () {
    window.clearInterval(int);
    millisecond = hour = minute = second = 0;
    document.getElementById('timetext').value = '00:00:00';
    lang = $('#langSel').find('option:selected').val()
    samp = $('#sampSel').find('option:selected').val()
    $('#langSel').change(function(){
        lang = $('#langSel').find('option:selected').val()
    })
    $('#sampSel').change(function(){
        samp = $('#sampSel').find('option:selected').val()
    })
})

function user_login(){
    var urlHref = window.location.href
    window.localStorage.setItem('returnurl',urlHref)
    window.location.href = "../login/login.html";
}

function recd() {
    rec = Recorder({
        type: "wav",
        bitRate: 16,
        sampleRate: samp,
        bufferSize: 4096,
        onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate) {
            chunkInfo = Recorder.SampleData(buffers, bufferSampleRate, rec.set.sampleRate, chunkInfo);
            var buf = chunkInfo.data
            if (pidx == 1) {
                var buf2 = [];
                if(samp == '8000'){
                    buf2.unshift(1, 0, 0, 0);
                }else{
                    buf2.unshift(5, 0, 0, 0);
                }
                var buf4 = new Int16Array(buf2);
            } else {
                var buf4 = buf;
            }
            // var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
            //     "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=iat&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            //     "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over +
            //     "&rsts=0" +
            //     "&spts=0&fpts=0&cpts=0&lrts=0&n2lang="+lang;
            var data = new FormData()
            data.append("scene ", 'long');
            data.append("language ", lang);
            data.append("sample ", '1');
            data.append("audioFormat", 'pcm_'+samp+'_16bit_sample');
            data.append("sessionid", ixid);
            data.append("packageid", pidx++);
            data.append("over", over);
            data.append("voice-data", new Blob([buf4]));
            axios.post(urlInfo, data,{
                headers:{
                    'channel': 'cloudasr',
                    'lenovokey':lenkey,
                    'secretkey': secrkey
                }
            }).then(function (res) {
                    if(typeof(res.data.errormessage) == "string"){
                        document.getElementById('txt-f').innerHTML = res.data.errormessage
                        rec.close()
                        window.clearInterval(int)
                    }else{
                        document.getElementById('txt-f').innerHTML = res.data.rawText
                    }
                    
            }).catch(function (error) {
                document.getElementById('txt-f').innerHTML = '服务器错误，请稍后重试'
            })
            
        }
    });
    rec.open(function () {
        //开始录音
        chunkInfo = null
        rec.start();

    }, function (msg, isUserNotAllow) {
        //用户拒绝了权限或浏览器不支持
        document.getElementById('txt-f').innerHTML = (isUserNotAllow ? "用户拒绝了权限，" : "") + "无法录音:" + msg;
        if(!document.getElementById('txt-f').innerHTML.indexOf('无法录音')>-1){
            window.clearInterval(int);
            rec.close()
        }
    });
    
}
function timer() { //计时
    second = second + 1;
    if (second >= 60) {
        second = 0;
        minute = minute + 1;
    }
    if (minute >= 60) {
        minute = 0;
        hour = hour + 1;
    }
    document.getElementById('timetext').value = zero(hour) + ':' + zero(minute) + ':' + zero(second);
}
function zero(n) {
    return n = n < 10 ? '0' + n : n;
}

function sendEnd(){
    // var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
    //     "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=iat&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
    //     "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over +
    //     "&rsts=0" +
    //     "&spts=0&fpts=0&cpts=0&lrts=0&n2lang="+lang;
            var data = new FormData()
            data.append("scene ", 'long');
            data.append("language ", lang);
            data.append("sample ", '1');
            data.append("audioFormat", 'pcm_'+samp+'_16bit_sample');
            data.append("sessionid", ixid);
            data.append("packageid", pidx++);
            data.append("over", over);
            data.append("voice-data", new Blob([chunkInfo.data]));
            axios.post(urlInfo, data,{
                headers:{
                    'channel': 'cloudasr',
                    'lenovokey':lenkey,
                    'secretkey': secrkey
                }
            }).then(function (res) {
                    
            }).catch(function (error) {
                console.log(error)
            })
}



        