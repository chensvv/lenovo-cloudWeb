$(function () {
    loadTop("product");
});

var chunkInfo;
var rec;
var URL = 'https://voice.lenovo.com/lasf/cloudasr'
var ixid = new Date().getTime();
var pidx = 1
var over = 0
var flag = true
var chunkEnd
var accountid = window.localStorage.getItem('accountid');
var lenkey = window.localStorage.getItem('lenkey');
var secrkey = window.localStorage.getItem('secrkey');
var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
if (!user) {
    $('html,body').css({"min-width": "1200px"})
    $('html,body').css({"min-height": "685px"})
}
var hour, minute, second; //时 分 秒
hour = minute = second = 0; //初始化
var millisecond = 0; //毫秒
var int;
function toggleRecording(e) {
    $('#record').attr('src', './images/Mic-act.png')
    var con = document.getElementsByClassName('content_box')[0]
    var accountid = window.localStorage.getItem('accountid');
    if (accountid == "" || accountid == null || accountid.length == 0) {
        var statusP = document.getElementById("status");
        statusP.innerHTML = "<a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    var img_btn = document.getElementById('record');
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        window.clearInterval(int);
        over++
        rec.close()
        sendEnd()
        $('.product-picture .pulse1').css("display", "none");
        $('.product-picture .pulse').css("display", "none");
        img_btn.src = 'images/Mic-nor.png';
    } else {
        e.classList.add("recording");
        millisecond = hour = minute = second = 0;
        document.getElementById('timetext').value = '00:00:00';
        int = setInterval(timer, 1000);
        over = 0
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
})

function recd() {
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
                buf2.unshift(5, 0, 0, 0);
                var buf4 = new Int16Array(buf2);
            } else {
                var buf4 = buf;
            }
            var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
                "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=iat&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
                "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over +
                "&rsts=0" +
                "&spts=0&fpts=0&cpts=0&lrts=0";
            var data = new FormData()
            data.append("param-data", params);
            data.append("voice-data", new Blob([buf4]));
            axios.post(URL, data,{
                headers:{
                    'channel': 'cloudasr',
                    'lenovokey':lenkey,
                    'secretkey': secrkey
                }
            }).then(function (res) {
                    if(typeof(res.data.errormessage) == "string"){
                        document.getElementById('txt-f').innerHTML = res.data.errormessage
                        rec.stop()
                        window.clearInterval(int)
                    }else{
                        document.getElementById('txt-f').innerHTML = res.data.rawText
                    }
                    
            }).catch(function (error) {
                console.log(error)
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
function LenovoIdSyncLoginState(lenovoid_wust) {
    _club_login_status = true;
    take_st_login = true;
    $.ajax({
        type: "get",
        url: urlhead + "/lasf/logininfo",
        headers: {
            'channel': 'cloudasr'
        },
        data: "securekey=" + lenovoid_wust,
        dataType: 'json',
        success: function (data) {
            if (typeof (data) == 'undefined')
                var data = {
                    'status': 'error'
                };
            if (data.status == 'success') {
                window.localStorage.setItem('secretkey', data.secretkey);
                window.localStorage.setItem('accountid', data.AccountID);
                window.localStorage.setItem('lenovoname', data.name);
                window.localStorage.setItem('Username', data.Username);
            } else if (data.status == 'failed') {
                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
            } else if (data.status == 'error') {

            }
        }
    });
}

function sendEnd(){
    var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
        "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=iat&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
        "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over +
        "&rsts=0" +
        "&spts=0&fpts=0&cpts=0&lrts=0"
        var data = new FormData()
            data.append("param-data", params);
            data.append("voice-data", new Blob([chunkInfo.data]));
            axios.post(URL, data,{
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



        