var n = 0
var accountid = window.localStorage.getItem('acd')
var lenkey = $.base64.decode(window.localStorage.getItem('lk'))
var secrkey = $.base64.decode(window.localStorage.getItem('sk'))
var username = $.base64.decode(window.localStorage.getItem('token'))
var channelval = $.base64.decode(window.localStorage.getItem('ch'))
var userToken = window.localStorage.getItem('token')
var bgm = document.getElementById('bgMusic')
var uri = 'wss://voice.lenovomm.com/website/wscloudtts/'
// var uri = 'ws://10.110.148.57:8085/lasf/wscloudtts/'
// var uri = 'ws://10.110.148.57:8085/vehicle/wscloudtts/'
var rangeval
var ws
var aBlob
var files = []
$('#tts-loading').hide()

function voicePlay(){
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
    }else if($('#textarea').val() == ''){
        Swal.fire({
          text:$.i18n.prop('inputText'),
          confirmButtonText: $.i18n.prop('confirm'),
          confirmButtonColor: '#94cb82'
        })
    }else if(window.navigator.userAgent.indexOf("MSIE")>=1) {
        Swal.fire({
          text:"此浏览器不支持音频播放",
          confirmButtonText: $.i18n.prop('confirm'),
          confirmButtonColor: '#94cb82'
        })
    }else{
        if(localStorage.getItem('us') == 2 || localStorage.getItem('us') == 3){
          
            // getData()
            // if(ws.readyState != 1){
            //   Swal.fire({
            //     text:$.i18n.prop('server_error'),
            //     confirmButtonText: $.i18n.prop('confirm'),
            //     confirmButtonColor: '#94cb82'
            //   })
            // }else{
              files = []
              socket()
              
              
            // }
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

function voicePause(){
    bgm.pause()
}
function voiceKeep(){
    bgm.play()
}

bgm.addEventListener('ended', function () {
    $('.voice-play').css('display','inline-block')
    $('.voice-pause').css('display','none')
    $('.voice-keep').css('display','none')
}, false);
bgm.addEventListener('playing', function () {
    $('.voice-play').css('display','none')
    $('.voice-keep').css('display','none')
    $('.voice-pause').css('display','inline-block')
}, false);
bgm.addEventListener('pause', function () {
    $('.voice-play').css('display','none')
    $('.voice-pause').css('display','none')
    $('.voice-keep').css('display','inline-block')
}, false);
bgm.addEventListener('canplaythrough', function(){
    bgm.play()
})
function myrange(event){
  // var myx = document.getElementById('myrange').value
  console.log("speed:"+event.target.value)
  $('#speedVal').html(event.target.value)
  // bgm.playbackRate = myx == 1.5 ? myx = 2 : myx;
}


function densityInput (event) {
  // console.log("volume:"+event.target.value);
  $('#volVal').html(event.target.value)
  // bgm.volume = event.target.value
}

function mypitch (event) {
  // console.log("volume:"+event.target.value);
  $('#pitchVal').html(event.target.value)
  // bgm.volume = event.target.value
}

function OnPropChanged (event) {
  if (event.propertyName.toLowerCase () == "value") {
      // console.log(event.srcElement.value);
  }
}

$("#seletype li").click(function(e) {
  $(this).siblings('li').removeClass('active');  // 删除其他兄弟元素的样式
  $(this).addClass('active');                            // 添加当前元素的样式
});

// function volbtn(id){
//   var node=document.getElementById(id);

//   if(node.style.display=="block"){
//       node.style.display="none";
//   }else{
//       node.style.display="block";
//   }
// }

// function rangbtn(id){
//   var node=document.getElementById(id);

//   if(node.style.display=="block"){
//       node.style.display="none";
//   }else{
//       node.style.display="block";
//   }
// }

// document.onclick = function(event){
//   if(document.getElementById('myvol').style.display == "block" && event.target.className != "bx bxs-volume-full"){
//     $('.myv').css('display','none')
//   }
//   if(document.getElementById('myrange').style.display == "block" && event.target.className != "rate"){
//     $('.myr').css('display','none')
//   }
// }

// 阻止事件冒泡
// document.getElementById('myvol').addEventListener("click",function(event){
//   var event = event || window.event;
//   var target = event.target || event.srcElement;
//   event.stopPropagation();
// })

// document.getElementById('myrange').addEventListener("click",function(event){
//   var event = event || window.event;
//   var target = event.target || event.srcElement;
//   event.stopPropagation();
// })
// socket()
// console.log(ws)

function socket (e) {
  // /wscloudtts/{user}/{speed}/{volume}/{pitch}/{audioType}/{speaker}/{t1}/{token}/{t2}/{channel}/{lenovokey}/{secretkey}
  var path = `${uri}${accountid}/${document.getElementById('myrange').value}/${document.getElementById('myvol').value}/${document.getElementById('mypitch').value}/xxxx/${$('#seletype .active')[0].id}/${accountid}/token/${new Date().getTime()}/cloudasr/${localStorage.getItem('lk')}/${localStorage.getItem('sk')}`
  ws = new WebSocket(path)
  ws.onopen = function(){
      console.log('ws已连接')
      $('#tts-loading').show()
      $('.voice-play').css('display','none')
      $('.voice-pause').css('display','none')
      $('.voice-keep').css('display','none')
      ws.send(BASE64.encode($('#textarea').val()))
  }
  ws.onerror = function(error){
      Swal.fire({
          text:$.i18n.prop('server_error'),
          confirmButtonText: $.i18n.prop('confirm'),
          confirmButtonColor: '#94cb82'
      })
  }
  ws.onmessage = function(res){
    if(typeof(res.data) == 'object'){
      if(res.data.size !=0){
        files.push(res.data)
      }else{
        $('#tts-loading').hide()
        $('.voice-play').css('display','none')
        $('.voice-pause').css('display','block')
        aBlob = new Blob(files)
        bgm.src = URL.createObjectURL(aBlob);
      }
    }else{
      $('#tts-loading').hide()
      $('.voice-play').css('display','block')
      $('.voice-pause').css('display','none')
      Swal.fire({
        text:$.i18n.prop('server_error'),
        confirmButtonText: $.i18n.prop('confirm'),
        confirmButtonColor: '#94cb82'
      })
    }
  },
  ws.onclose = function(){
      console.log('closed')
  }
}


function getData(){
    var req = new XMLHttpRequest();
    var formData = 'text='+encodeURI($('#textarea').val())+'&user='+accountid+
                  '&speed='+document.getElementById('myrange').value+
                  '&volume='+document.getElementById('myvol').value+
                  '&pitch='+document.getElementById('mypitch').value+
                  '&speaker='+$('#seletype .active')[0].id
    req.open("POST", proURL+'/cloudtts', true); // grab our audio file
    req.setRequestHeader('channel', 'cloudasr')
    req.setRequestHeader('lenovokey',lenkey)
    req.setRequestHeader('secretkey',secrkey)
    req.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    req.responseType = "arraybuffer";   // needs to be specific type to work
    req.overrideMimeType('text/xml; charset = utf-8')
    req.onload = function() {
      $('#tts-loading').hide()
        //根据pcm文件 填写 sampleRateTmp【采样率】（16000） 和sampleBits【采样精度】（16） channelCount【声道】（单声道1，双声道2）
        // var fileResult = addWavHeader(req.response,16000,16,1);
        // var blob = new Blob([fileResult], {type:'autio/wav'});
        var blob = new Blob([req.response]);
        var reader = new FileReader();
        reader.readAsText(blob, 'utf-8');
        reader.onload = function (e) {
          let str = reader.result
          if(str.length < 200 && str.length > 1){
            Swal.fire({
              text:str.split('error=')[1],
              confirmButtonText: $.i18n.prop('confirm'),
              confirmButtonColor: '#94cb82'
            })
            $('.voice-play').css('display','block')
            $('.voice-pause').css('display','none')
          }else if(str.length == 0 || str == ''){
            Swal.fire({
              text:'请稍后重试！',
              confirmButtonText: $.i18n.prop('confirm'),
              confirmButtonColor: '#94cb82'
            })
            $('.voice-play').css('display','block')
            $('.voice-pause').css('display','none')
          }else{
            $('.voice-play').css('display','none')
            $('.voice-pause').css('display','block')
            bgm.src = URL.createObjectURL(blob);
            // bgm.playbackRate = rangeval
          }
        }
    }
    req.onerror = function(){
      Swal.fire({
          text:$.i18n.prop('server_error'),
          confirmButtonText: $.i18n.prop('confirm'),
          confirmButtonColor: '#94cb82'
      })
    }
    req.send(formData);
}

const addWavHeader = function (samples, sampleRateTmp, sampleBits, channelCount) {
    let dataLength = samples.byteLength
    /* 新的buffer类，预留 44 bytes 的　heaer 空间 */
    let buffer = new ArrayBuffer(44 + dataLength)
    /* 转为 Dataview, 利用 API 来填充字节 */
    let view = new DataView(buffer)
    /* 定义一个内部函数，以 big end 数据格式填充字符串至 DataView */
    function writeString (view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
   
    let offset = 0
    /* ChunkID, 4 bytes,  资源交换文件标识符 */
    writeString(view, offset, 'RIFF'); offset += 4
    /* ChunkSize, 4 bytes, 下个地址开始到文件尾总字节数,即文件大小-8 */
    view.setUint32(offset, /* 32 */ 36 + dataLength, true); offset += 4
    /* Format, 4 bytes, WAV文件标志 */
    writeString(view, offset, 'WAVE'); offset += 4
    /* Subchunk1 ID, 4 bytes, 波形格式标志 */
    writeString(view, offset, 'fmt '); offset += 4
    /* Subchunk1 Size, 4 bytes, 过滤字节,一般为 0x10 = 16 */
    view.setUint32(offset, 16, true); offset += 4
    /* Audio Format, 2 bytes, 格式类别 (PCM形式采样数据) */
    view.setUint16(offset, 1, true); offset += 2
    /* Num Channels, 2 bytes,  通道数 */
    view.setUint16(offset, channelCount, true); offset += 2
    /* SampleRate, 4 bytes, 采样率,每秒样本数,表示每个通道的播放速度 */
    view.setUint32(offset, sampleRateTmp, true); offset += 4
    /* ByteRate, 4 bytes, 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
    view.setUint32(offset, sampleRateTmp * channelCount * (sampleBits / 8), true); offset += 4
    /* BlockAlign, 2 bytes, 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
    view.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2
    /* BitsPerSample, 2 bytes, 每样本数据位数 */
    view.setUint16(offset, sampleBits, true); offset += 2
    /* Subchunk2 ID, 4 bytes, 数据标识符 */
    writeString(view, offset, 'data'); offset += 4
    /* Subchunk2 Size, 4 bytes, 采样数据总数,即数据总大小-44 */
    view.setUint32(offset, dataLength, true); offset += 4
   
    /* 数据流需要以大端的方式存储，定义不同采样比特的 API */
    function floatTo32BitPCM (output, offset, input) {
      input = new Int32Array(input)
      for (let i = 0; i < input.length; i++, offset += 4) {
        output.setInt32(offset, input[i], true)
      }
    }
    function floatTo16BitPCM (output, offset, input) {
      input = new Int16Array(input)
      for (let i = 0; i < input.length; i++, offset += 2) {
        output.setInt16(offset, input[i], true)
      }
    }
    function floatTo8BitPCM (output, offset, input) {
      input = new Int8Array(input)
      for (let i = 0; i < input.length; i++, offset++) {
        output.setInt8(offset, input[i], true)
      }
    }
    if (sampleBits == 16) {
      floatTo16BitPCM(view, 44, samples)
    } else if (sampleBits == 8) {
      floatTo8BitPCM(view, 44, samples)
    } else {
      floatTo32BitPCM(view, 44, samples)
    }
    return view.buffer
  }
  

function random(){
    let arrList = ['前方150米，请在道路尽头左转，进入后厂村路。','前面还有27名等候人员排队','两岸猿声啼不住，轻舟已过万重山','白日依山尽，黄河入海流。欲穷千里目，更上一层楼。']
    n = n + 1;
    if(n == arrList.length){
        n = 0;
    }
    $('#textarea').val(arrList[n])
}
function setShowLength(obj, maxlength, id) {
	var rem = maxlength - obj.value.length; 
	if (rem < 0){ 
		rem = 0; 
	} 
	$('#number').html(rem) 
}
