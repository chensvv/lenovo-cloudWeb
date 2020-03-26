


var accountid = $.base64.decode(window.localStorage.getItem('acd'));
var lenkey = $.base64.decode(window.localStorage.getItem('lk'));
var secrkey = $.base64.decode(window.localStorage.getItem('sk'));
var accountidd = window.localStorage.getItem('acd')
var chunkInfo;
var rec;
var ixid = new Date().getTime();
var URL = 'https://voice.lenovomm.com/xxzz/evaluate_read'
function record(e){
    if (accountidd == "" || accountidd == null || accountidd.length == 0) {
        var statusP = document.getElementById("text");
        statusP.innerHTML = "<a href=\"../login/login.html\" target=\"_self\" id='lenovo-user-name'>请先登录</a>";
        return;
    }
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        document.getElementById('ret').innerHTML = '点我录音'
        $('#nextPage').attr('disabled',false)
        recStop()
    } else {
        e.classList.add("recording");
        recOpen()
    }
}
function recOpen(success){
    rec=Recorder({
        type:"wav",sampleRate:16000,bitRate:16 
    });

    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    rec.open(function(){//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        rec.start() //此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
        document.getElementById('ret').innerHTML = '录音中<dot>...</dot>'
        $('#nextPage').attr('disabled',true)
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
        // rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
        rec=null;
        // console.log(document.getElementById('text').innerHTML)
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
            document.getElementById('fluency').innerHTML = res.data.fluent_score
            document.getElementById('integrity').innerHTML = res.data.integrity
            document.getElementById('degree').innerHTML = res.data.precision
            document.getElementById('score').innerHTML = res.data.overall
        })
    },function(msg){
        alert("录音失败:"+msg);
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
    });
};