var lenkey = $.base64.decode(window.localStorage.getItem('lk'));
var secrkey = $.base64.decode(window.localStorage.getItem('sk'));
var username = window.localStorage.getItem('token');
var urlInfo = proURL +'/cloudasr';
var img_btn = document.getElementById('record')
var $selectSamp = $("#selectSamp");
var $selectLang = $("#selectLang");
var path = ''
// var uri = 'ws://10.110.148.59:8080/lasf/wsasr/'
var uri = 'wss://voice.lenovomm.com/website/webSocket/'
var rt = ''
var firstup = true
var rec
var chunkInfo
var pidx = 1
var statu = 0
$selectSamp.goSelectInput({
    height: 25,
    width: 70
});
$selectLang.goSelectInput({
    height: 25,
    width: 70
});
function toggleRecording(e){
    
    if (username == "" || username == null) {
        $('#statusU').css('display','block')
        return;
    }
    if (e.classList.contains("recording")) {
        e.classList.remove("recording");
        ws.send(new Blob([ ]))
        recStop()
    }else{
        if(localStorage.getItem('us') == 1 || localStorage.getItem('us') == 3){
            e.classList.add("recording");
            // $('.result-box').css('display','none')
            getIxid(e)
        }else{
            Swal.fire({
                text: i18n.get('service_not_open'),
                showCancelButton: true,
                allowOutsideClick:false,
                allowEscapeKey:false,
                reverseButtons:true,
                width:'16em',
                confirmButtonColor: '#94cb82',
                cancelButtonColor: '#d33',
                confirmButtonText: i18n.get('go_to_open'),
                cancelButtonText:i18n.get('cancel')
            }).then((result) => {
                if (result.isConfirmed) {
                  window.location.href = '../product/recognise.html'
                }
            })
        }
        
    }
}

function socket (e) {
    ws = new WebSocket(path)
    ws.onopen = function(){
        console.log('ws已连接')
        recOpen()
    }
    ws.onerror = function(error){
        Swal.fire({
            text:i18n.get('server_error'),
            confirmButtonText: i18n.get('confirm'),
            confirmButtonColor: '#94cb82'
        })
        recStop()
    }
    ws.onmessage = function(data){
        let res = JSON.parse(data.data)
        // console.log(res.rawType+':'+res.rawText)
        if(typeof(res.errormessage) == "string"){
            e.classList.remove("recording");
            statu = 1
            recStop()
            ws.close()
            Swal.fire({
                text:res.errormessage,
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }else{
            statu = 0
            // rt = res.rawText
            if(firstup){
                firstup = false;
            }
            // if (rt.length > 0) {
                if (res.rawType == 'final') {
                    ws.close()
                    $('#statusD').css('display','none')
                    $('.result-box').css('display','block')
                    $('#allDur').html(res.allDur)
                    $('#asrDur').html(res.asrDur)
                    $('#asrVersion').html(res.asrVersion)
                    $('#confidence').html(res.confidence)
                    $('#desc').html(res.desc)
                    $('#nConf').html(res.nConf)
                    $('#nText').html(res.nText)
                    $('#nlpVersion').html(res.nlpVersion)
                    $('#rawText').html(res.rawText)
                    $('#result').html(res.result)
                    $('#status').html(res.status)
                    // $('#time').html(res.time)
                    $('.result-input').val(res.rawText)
                    
                }
            // }
            
        }
    },
    ws.onclose = function(){
        console.log('closed')
    }
}

function getIxid(e){
    $.ajax({
        url:proURL+'/gensessionid',
        type:'post',
        success:function(res){
            // var params = {
            //     username:$.base64.encode(localStorage.getItem('un')),
            //     lenovokey:localStorage.getItem('lk'),
            //     secretkey:localStorage.getItem('sk'),
            //     sessionid:res,
            //     language:$selectLang.val(),
            //     scene:'short',
            //     over:'0',
            //     packageid:"1",
            //     sample:"1",
            //     audioFormat:`pcm_${$selectSamp.val()}_16bit_sample`
            // }
            path = `${uri}${$.base64.encode(localStorage.getItem('un'))}/${localStorage.getItem('lk')}/${localStorage.getItem('sk')}/${res}/${$selectLang.val()}/pcm_${$selectSamp.val()}_16bit_sample/cmd`
            // path = `${uri}${$.base64.encode(JSON.stringify(params))}`
            socket(e)
        }
    })
    
}

function recOpen(success){
    rec=Recorder({
        type: "wav",
        bitRate: 16,
        sampleRate: $selectSamp.val(),
        bufferSize: 4096,
        onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){
            wave.input(buffers[buffers.length-1],powerLevel,bufferSampleRate);//输入音频数据，更新显示波形
            chunkInfo = Recorder.SampleData(buffers, bufferSampleRate, rec.set.sampleRate, chunkInfo);
            let buf = chunkInfo.data
            if (pidx == 1) {
                let buf2 = [];
                if($selectSamp.val() == '8000'){
                    buf2.unshift(1, 0, 0, 0);
                }else{
                    buf2.unshift(5, 0, 0, 0);
                }
                var buf4 = new Int16Array(buf2);
                pidx++
            } else {
                var buf4 = buf;
            }
            ws.send(new Blob([buf4]))
        }
    });

    //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
    rec.open(function(){//打开麦克风授权获得相关资源
        //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        chunkInfo = null
        $('.hint-sp-left').css("display","none");
        $('.result-box').css('display','none')
        $('.viz').css('display','block');
        $('#statusP').css('display','block')
        img_btn.src = '../../img/audiomain/Mic-act.png'
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
        // dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
        // console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg);
        // alert("无法录音:"+msg)
        Swal.fire({
            text:msg,
            confirmButtonText: i18n.get('confirm'),
            confirmButtonColor: '#94cb82'
        })
    });
}

/**开始录音**/
function recStart(){//打开了录音后才能进行start、stop调用
    
};
function recStop(){
    rec.stop(function(blob,duration){
        if(statu != 1){
            $('#statusP').css('display','none')
            $('#statusD').css('display','block')
            $('.viz').css('display','none');
            img_btn.src = '../../img/audiomain/Mic-nor.png'
            // console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
            // ws.close()
            rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
            rec=null;
        }else{
            $('#statusP').css('display','none')
            $('#statusD').css('display','none')
            $('.viz').css('display','none');
            $('.hint-sp-left').css("display","block");
            img_btn.src = '../../img/audiomain/Mic-nor.png'
            // console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
            // ws.close()
            rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
            rec=null;
        }
        
        // var reader = new FileReader();
        // reader.readAsArrayBuffer(blob, 'utf-8');
        // reader.onload = function (e) {
        //     var buf = new Uint16Array(reader.result);
        //     var buf2=[];
        //     Object.assign(buf2,buf);
        //     if($selectSamp.val() == '8000'){
        //         buf2.unshift(1, 0, 0, 0);
        //     }else{
        //         buf2.unshift(5, 0, 0, 0);
        //     }
        //     // buf2.unshift(5,0,0,0);
        //     var buf4=new Uint16Array(buf2);
        //     console.log(buf4)
        //     ws.send(new Blob([buf4]))
            // ws.close()
            // var formData = new FormData();
            // var ixid  = new Date().getTime();
            // formData.append("scene", 'short');
            // formData.append("language", $selectLang.val());
            // formData.append("sample", '1');
            // formData.append("audioFormat", 'pcm_'+$selectSamp.val()+'_16bit_sample');
            // formData.append("sessionid", ixid);
            // formData.append("packageid", "1");
            // formData.append("over", "1");
            // formData.append("voice-data", new Blob([buf4]));
            // $.ajax({
            //     url:urlInfo,
            //     type:'post',
            //     data:formData,
            //     headers:{
            //         'channel':'cloudasr',
            //         'lenovokey':lenkey,
            //         'secretkey': secrkey
            //     },
            //     processData: false,
            //     contentType: false,
            //     success:(res)=>{
            //         $('#statusD').css('display','none')
            //         $('.result-box').css('display','block')
            //         $('#allDur').html(res.allDur)
            //         $('#asrDur').html(res.asrDur)
            //         $('#asrVersion').html(res.asrVersion)
            //         $('#confidence').html(res.confidence)
            //         $('#desc').html(res.desc)
            //         $('#nConf').html(res.nConf)
            //         $('#nText').html(res.nText)
            //         $('#nlpVersion').html(res.nlpVersion)
            //         $('#rawText').html(res.rawText)
            //         $('#result').html(res.result)
            //         $('#status').html(res.status)
            //         $('#time').html(res.time)
            //         $('.result-input').val(res.rawText)
            //     },
            //     error:function(){
            //         Swal.fire({
            //             text:i18n.get('server_error'),
            //             confirmButtonText: i18n.get('confirm'),
            //             confirmButtonColor: '#94cb82'
            //         })
            //     }
            // })
        // }
    },function(msg){
        ws.close()
        rec.close();//可以通过stop方法的第3个参数来自动调用close
        rec=null;
        Swal.fire({
            text:msg,
            confirmButtonText: i18n.get('confirm'),
            confirmButtonColor: '#94cb82'
        })
    });
};

$(".result-input").bind("keypress",function(event){
    if(event.keyCode == "13"){
        var $val=$(".result-input").val();
        $.ajax({
            type:"post",
            url:proURL+"/nlp",
            data:{"uid":"466543","vdm":"music","cmd":$val,"app":"kk"},	           
            success:function(data){
                $('#pre').html('queryText:'+data.queryText)
                // $("#json").html('"'+"result"+'"：'+syntaxHighlight(data));
            }
        });
    }
})