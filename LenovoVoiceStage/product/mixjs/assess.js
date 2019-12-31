


var accountid = window.localStorage.getItem('accountid');
var lenkey = window.localStorage.getItem('lenkey');
var secrkey = window.localStorage.getItem('secrkey');
var chunkInfo;
var rec;
var ixid = new Date().getTime();
var URL = 'http://m.voice.lenovomm.com/evaluate_read'
function record(e){
    if (accountid == "" || accountid == null || accountid.length == 0) {
        var statusP = document.getElementById("status");
        statusP.innerHTML = "<a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        console.log(111)
        recStop()
    } else {
        e.classList.add("recording");
        console.log(222)
        recStart();
    }
}
recOpen()
function recOpen(success){
    rec=Recorder({
        type:"wav",sampleRate:16000,bitRate:16 
    });

    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    rec.open(function(){//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        
        success&&success();
    },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
    });
};
/**开始录音**/
function recStart(){//打开了录音后才能进行start、stop调用
    rec.start();
};
function recStop(){
    rec.stop(function(blob,duration){
        // console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
        rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        rec=null;
        console.log(document.getElementById('text').innerHTML)
        // blob.arrayBuffer().then(function(arr){console.log(new Uint8Array(arr))})
        var params = "ixid="+ixid+"&uid=30323575&text="+document.getElementById('text').innerHTML+
                    "&datatype=1&pidx=1&over=1&token=1111111111&source=1"
        var data = new FormData()
        data.append("data",params)
        data.append("audio",blob)
        axios.post(URL,data,{
            headers:{
                // 'content-type': 'multipart/form-data',
                'lenovokey':lenkey,
                'secretkey': secrkey
            }
        }).then(res=>{
            console.log(res)
        })
    },function(msg){
        console.log("录音失败:"+msg);
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
    });
};
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