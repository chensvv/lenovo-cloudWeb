var arrList = ["They often create amazing things from simple ideas.",
"Welcome to the show.",
"China's space technology has advanced quickly in less than sixty years.",
"Two films have also been made of the story.",
'Without the hard work of all the great scientists in the programme, we would never have succeeded.']
var lenkey = $.base64.decode(window.localStorage.getItem('lk'));
var secrkey = $.base64.decode(window.localStorage.getItem('sk'));
var n = 0
var username = $.base64.decode(window.localStorage.getItem('token'))
var channelval = $.base64.decode(window.localStorage.getItem('ch'))
var userToken = window.localStorage.getItem('token')
var box = document.getElementById('voice-btn');
var chunkInfo;
var rec;

function record(e){
    if (userToken == "" || userToken == null) {
        Swal.fire({
            text: $.i18n.prop('logTimeOut'),
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
        return;
    }
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        $('.line-box').css('display','none')
        $('.mic').css('display','inline-block')
        $('#voice-btn').removeClass('ass-recording')
        $('.mic-btn').html($.i18n.prop('startvoice'));
        recStop()
    } else {
        e.classList.add("recording");
        $('.mic-btn').html($.i18n.prop('stopvoice'))
        $('.mic').css('display','none')
        $('.line-box').css("display","inline-block");
        $('#voice-btn').addClass('ass-recording')
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
        
        success&&success();
    },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        // console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
        $('.line-box').css('display','none')
        $('.mic').css('display','inline-block')
        $('#voice-btn').removeClass('ass-recording')
        $('.mic-btn').html($.i18n.prop('startvoice'));
        $('#voice-btn').removeClass('recording')
        Swal.fire({
            text:msg,
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
        
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
        $('#assload').css('display','block')
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob, 'utf-8');
        reader.onload = function (e) {
            var buf = new Uint16Array(reader.result);
            var buf2=[];
            Object.assign(buf2,buf);
            buf2.unshift(5,0,0,0);
            var buf4=new Uint16Array(buf2);
            var data = new FormData()
            var ixid  = new Date().getTime();
            data.append('ixid',ixid)
            data.append('uid','30323575')
            data.append('text',$('.voice-main').text())
            data.append('datatype','1')
            data.append('pidx','1')
            data.append('over','1')
            data.append('token','1111111111')
            data.append('source','1')
            data.append('dtp','lenovo%2FleSumsung%2Fandroid')
            data.append('ver','1.0.0')
            data.append('did','83102d26aaca24ba')
            data.append('stm','0')
            data.append('key','a')
            data.append('ssm','true')
            data.append('vdm','music')
            data.append('rvr','')
            data.append('sce','cmd')
            data.append('ntt','wifi')
            data.append('aue','speex-wb%3B7')
            data.append('auf','audio%2FL16%3Brate%3D16000')
            data.append('dev','lenovo.rt.urc.lv.develop')
            data.append('pidx','1')
            data.append('over','1')
            data.append('rsts','0')
            data.append('spts','0')
            data.append('fpts','0')
            data.append('cpts','0')
            data.append('lrts','0')
            data.append("voicedata",new Blob([buf4]))

            $.ajax({
                url:sdkurl+'/xxzz/evaluate_read',
                type:'post',
                data:data,
                headers:{
                    'channel':'cloudasr',
                    'lenovokey':lenkey,
                    'secretkey': secrkey
                },
                processData: false,
                contentType: false,
                success:function(res){
                    $('#assload').css('display','none')
                    $('#fluency').html(res.fluent_score)
                    $('#integrity').html(res.integrity)
                    $('#degree').html(res.overall_pronunciation)
                    $('#score').html(res.overall)
                },
                error:function(){
                    $('#assload').css('display','none')
                    Swal.fire({
                        text:$.i18n.prop('server_error'),
                        confirmButtonText: $.i18n.prop('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
            })
        }


        
    },function(msg){
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
        Swal.fire({
            text:msg,
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
    });
};

$('.voice-header').on('click',function(){
    n = n + 1;
    if(n == arrList.length){
        n = 0;
    }
    $('.header-title').html(n+1)
    $('.voice-main').html(arrList[n])
})