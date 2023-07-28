
$('#userver-loading').hide()
let lenovokey
let secretkey
let vehilenovokey
let vehisecretkey

function lide(){
    var checkList=[]
    if(window.localStorage.getItem('us') == 1 || window.localStorage.getItem('us') == 2){
        checkList.push(window.localStorage.getItem('us'))
        if(window.localStorage.getItem('us') == 1){
            $('.asrcheck').attr("checked","checked")
            $('.asrcheck').attr("disabled","true")
            $('.ttsakimg').css('display','none')
            $('.ttsskimg').css('display','none')
            $('.asrakimg').css('display','inline-block')
            $('.asrskimg').css('display','inline-block')
            $('.asrpro').css('display','flex')
            $('#channel').attr("readonly","readonly")
        }
        if(window.localStorage.getItem('us') == 2){
            $('.ttscheck').attr("checked","checked")
            $('.ttscheck').attr("disabled","true")
            $('.asrakimg').css('display','none')
            $('.asrskimg').css('display','none')
            $('.ttsakimg').css('display','inline-block')
            $('.ttsskimg').css('display','inline-block')
            $('.ttspro').css('display','flex')
            $('#channel').attr("readonly","readonly")
        }
    }else if(window.localStorage.getItem('us') == 3){
        checkList.push('1','2')
        
        $('.asrcheck').attr("checked","checked")
        $('.ttscheck').attr("checked","checked")
        $('.asrcheck').attr("disabled","true")
        $('.ttscheck').attr("disabled","true")
        $('#channel').attr("readonly","readonly")
        $('.asrakimg').css('display','inline-block')
        $('.asrskimg').css('display','inline-block')
        $('.ttsakimg').css('display','inline-block')
        $('.ttsskimg').css('display','inline-block')
        $('.asrpro').css('display','flex')
        $('.ttspro').css('display','flex')
    }else{
        $('#channel').removeAttr("readonly")
        $('.asrakimg').css('display','none')
        $('.asrskimg').css('display','none')
        $('.ttsakimg').css('display','none')
        $('.ttsskimg').css('display','none')
    }
    if(window.localStorage.getItem('hasVehicle') == 'true'){
        $('#channel').attr("readonly","readonly")
        $('.vehicheck').attr("checked","checked")
        $('.vehicheck').attr("disabled","true")
        $('.vehipro').css('display','flex')
    }else{
        $('.vehipro').css('display','none')
    }
    if(window.localStorage.getItem('hasVehicle') == 'true' && window.localStorage.getItem('us') == 3){
        $('.sub-btn').attr('disabled','disabled')
    }else{
        $('.sub-btn').removeAttr('disabled','disabled')
    }
}

// function handleClick(val){
//     $('#exampleModal').modal('show')
//     if(val == 'asr'){
//         $('.ifasr').css('display','block')
//         $('.iftts').css('display','none')
//     }else{
//         $('.ifasr').css('display','none')
//         $('.iftts').css('display','block')
//     }
// }
function submit(){
    $('#userver-loading').show()
    $('.sub-btn').attr('disabled','disabled')
    var checkArr
        if($('.asrcheck').is(":checked") == true && $('.ttscheck').is(":checked") == true){
            checkArr = 3
        }else if($('.asrcheck').is(":checked") == false && $('.ttscheck').is(":checked") == false){
            checkArr = 0
        }else{
            if($('.asrcheck').is(":checked") == true && $('.ttscheck').is(":checked") == false){
                checkArr = 1
            }
            if($('.asrcheck').is(":checked") == false && $('.ttscheck').is(":checked") == true){
                checkArr = 2
            }
        }
        var params = {
            t:$.base64.decode(window.localStorage.getItem('token')),
            lid:$.base64.decode(localStorage.getItem('acd')),
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined || '' ? 'chinese': 'english',
            userService:checkArr,
            hasVehicle:$('.vehicheck').is(":checked") == true ? '1' : '0',
            u:"",
            p:"",
            username:"",
            phone:"",
            company:"",
            dept:"",
            opwd:"",
            pwd:"",
            lenovoid:"",
            code:"",
            imgCode:"",
            ucode:"",
            vehicle:"",
            channel:$('#channel').val()
        }
        var stringParams = JSON.stringify(params,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        params.sign = md5(stringParams)
        $.ajax({
          type:"POST",
            url:proURL+'/web/updUserService',
            data:params,
          dataType:"json",
          headers: {
                "channel" : "cloudasr"
           },
          success:function(res){
            $('#userver-loading').hide()
            $('.sub-btn').removeAttr('disabled','disabled')
            if(res.errorcode != 1024){
                if(res.status == 0){
                    window.localStorage.setItem('us',checkArr)
                    Swal.fire({
                        text:res.error,
                        confirmButtonText: $.i18n.prop('confirm'),
                        confirmButtonColor: '#94cb82'
                    }).then((result)=>{
                        if(result.isConfirmed){
                            lide()
                            getUserInfo()
                        }
                    })
                } else if(res.status == 101){
                    window.localStorage.clear();
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
                      }).then((result)=>{
                        if (result.isConfirmed) {
                          var url = window.location.href
                          window.localStorage.setItem('returnurl',url)
                          window.location.href = '../login/login.html'
                        }
                      })
                }else{
                    Swal.fire({
                        text:res.error,
                        confirmButtonText: $.i18n.prop('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
            }else{
                window.localStorage.clear();
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
                  }).then((result)=>{
                    if (result.isConfirmed) {
                      var url = window.location.href
                      window.localStorage.setItem('returnurl',url)
                      window.location.href = '../login/login.html'
                    }
                  })
            }
        },error:function(err){
            $('#userver-loading').hide()
            $('.sub-btn').removeAttr('disabled','disabled')
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    });
}
getUserInfo()
function getUserInfo(){
    var infoParams = {
        username:$.base64.decode(window.localStorage.getItem('un')),
        lenovoid:$.base64.decode(window.localStorage.getItem('acd')),
        t:$.base64.decode(window.localStorage.getItem('token')),
        u:"",
        p:"",
        language:"",
        phone:"",
        company:"",
        dept:"",
        lid:"",
        opwd:"",
        pwd:"",
        userService:"",
        code:"",
        imgCode:"",
        ucode:"",
        channel:"",
        vehicle:""
      }
      var stringParams = JSON.stringify(infoParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
      
      infoParams.sign = md5(stringParams)
    $.ajax({
        type:"POST",
        url:proURL+'/userinfo',
        data:infoParams,
        dataType:"json",
        headers: {
            "channel" : "cloudasr"
        },
        success:function(res){
            if(res.errorcode != 1024){
                window.localStorage.setItem('ch',$.base64.encode(res.channel))
                window.localStorage.setItem('us',res.userService)
                window.localStorage.setItem('hasVehicle',res.hasVehicle)
                lenovokey = res.lenovokey
                secretkey = res.secretkey
                vehilenovokey = res.vehicleLenovokey
                vehisecretkey = res.vehicleSecretkey
                $('.vehiak').html(res.vehicleLenovokey != undefined ? hideStr(vehilenovokey) : '--')
                $('.vehisk').html(res.vehicleSecretkey != undefined ? hideStr(vehisecretkey) : '--')
                $('.asrak').html(res.userService == '3' || res.userService == '1' ? hideStr(lenovokey) : '--')
                $('.asrsk').html(res.userService == '3' || res.userService == '1' ? hideStr(secretkey) : '--')
                $('.ttsak').html(res.userService == '3' || res.userService == '2' ? hideStr(lenovokey) : '--')
                $('.ttssk').html(res.userService == '3' || res.userService == '2' ? hideStr(secretkey) : '--')
                $('#channel').val(res.channel)
                $('#body-num').html($('#channel').val().length)
                $('.totalASRAmount').html(res.totalASRAmount <= -99 ? '无限次' : res.totalASRAmount)
                $('.totalTTSAmount').html(res.totalTTSAmount <= -99 ? '无限次' : res.totalTTSAmount)
                $('.remainASRAmount').html(res.remainASRAmount <= -99 ? '无限次' : res.remainASRAmount)
                $('.remainTTSAmount').html(res.remainTTSAmount <= -99 ? '无限次' : res.remainTTSAmount)
                $('.vehiTotalTTS').html(res.vehicleTotalTTSAmount <= -99 ? '无限次' : res.vehicleTotalTTSAmount)
                $('.vehiRemainASR').html(res.vehicleRemainASRAmount <= -99 ? '无限次' : res.vehicleRemainASRAmount)
                $('.vehiTotalASR').html(res.vehicleTotalASRAmount <= -99 ? '无限次' : res.vehicleTotalASRAmount)
                $('.vehiRemainTTS').html(res.vehicleRemainTTSAmount <= -99 ? '无限次' : res.vehicleRemainTTSAmount)
                lide()
            }else{
                window.localStorage.clear();
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
                  }).then((result)=>{
                    if (result.isConfirmed) {
                      var url = window.location.href
                      window.localStorage.setItem('returnurl',url)
                      window.location.href = '../login/login.html'
                    }
                  })
            }
        },error:function(err){
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
}

$('#channel').bind("input propertychange", function(){
    $('#body-num').html($('#channel').val().length)
})
function hideStr(str){
    return str.substring(0,6) + "******"
}
let asrak = document.getElementById('asrak')
let asrsk = document.getElementById('asrsk')
let ttsak = document.getElementById('ttsak')
let ttssk = document.getElementById('ttssk')
let vehiak = document.getElementById('vehiak')
let vehisk = document.getElementById('vehisk')
let asrakbtn = document.getElementById('asrakshow')
let asrskbtn = document.getElementById('asrskshow')
let ttsakbtn = document.getElementById('ttsakshow')
let ttsskbtn = document.getElementById('ttsskshow')
let vehiakbtn = document.getElementById('vehiakshow')
let vehiskbtn = document.getElementById('vehiskshow')

asrakbtn.onclick = function(){
    asrak.innerHTML = asrak.innerHTML === hideStr(lenovokey) ? lenovokey : hideStr(lenovokey)
    asrakbtn.innerHTML = asrak.innerHTML === hideStr(lenovokey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}
asrskbtn.onclick = function(){
    asrsk.innerHTML = asrsk.innerHTML === hideStr(secretkey) ? secretkey : hideStr(secretkey)
    asrskbtn.innerHTML = asrsk.innerHTML === hideStr(secretkey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}
ttsakbtn.onclick = function(){
    ttsak.innerHTML = ttsak.innerHTML === hideStr(lenovokey) ? lenovokey : hideStr(lenovokey)
    ttsakbtn.innerHTML = ttsak.innerHTML === hideStr(lenovokey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}
ttsskbtn.onclick = function(){
    ttssk.innerHTML = ttssk.innerHTML === hideStr(secretkey) ? secretkey : hideStr(secretkey)
    ttsskbtn.innerHTML = ttssk.innerHTML === hideStr(secretkey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}
vehiakbtn.onclick = function(){
    vehiak.innerHTML = vehiak.innerHTML === hideStr(vehilenovokey) ? vehilenovokey : hideStr(vehilenovokey)
    vehiakbtn.innerHTML = vehiak.innerHTML === hideStr(vehilenovokey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}
vehiskbtn.onclick = function(){
    vehisk.innerHTML = vehisk.innerHTML === hideStr(vehisecretkey) ? vehisecretkey : hideStr(vehisecretkey)
    vehiskbtn.innerHTML = vehisk.innerHTML === hideStr(vehisecretkey) ? '<img src="../assets/img/show.png">' : '<img src="../assets/img/hide.png">'
}