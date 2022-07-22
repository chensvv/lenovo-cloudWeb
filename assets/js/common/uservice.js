
$('#userver-loading').hide()
lide()
function lide(){
    var checkList=[]
    if(window.localStorage.getItem('us') == 1 || window.localStorage.getItem('us') == 2){
        checkList.push(window.localStorage.getItem('us'))
        if(window.localStorage.getItem('us') == 1){
            $('.asrcheck').attr("checked","checked")
            $('.asrcheck').attr("disabled","true")
            $('.span1').css('display','block')
            $('.span2').css('display','none')
        }
        if(window.localStorage.getItem('us') == 2){
            $('.ttscheck').attr("checked","checked")
            $('.ttscheck').attr("disabled","true")
            $('.span1').css('display','none')
            $('.span2').css('display','block')
        }
    }else if(window.localStorage.getItem('us') == 3){
        checkList.push('1','2')
        $('.asrcheck').attr("checked","checked")
        $('.ttscheck').attr("checked","checked")
        $('.asrcheck').attr("disabled","true")
        $('.ttscheck').attr("disabled","true")
        $('.span1').css('display','block')
        $('.span2').css('display','block')
    }else{
        $('.span1').css('display','none')
        $('.span2').css('display','none')
    }
}

function handleClick(val){
    $('#exampleModal').modal('show')
    if(val == 'asr'){
        $('.ifasr').css('display','block')
        $('.iftts').css('display','none')
    }else{
        $('.ifasr').css('display','none')
        $('.iftts').css('display','block')
    }
}

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
            lid:$.base64.decode(window.localStorage.getItem('acd')),
            language:window.localStorage.getItem('ehiI18n.Language') == 'zh' || 'null' || '' ? 'chinese': 'english',
            userService:checkArr,
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
            channel:$('#channel').val()
        }
        var stringParams = JSON.stringify(params,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        console.log(stringParams)
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
                        confirmButtonText: i18n.get('confirm'),
                        confirmButtonColor: '#94cb82'
                    }).then((result)=>{
                        if(result.isConfirmed){
                            lide()
                        }
                    })
                } else if(res.status == 101){
                    window.localStorage.clear();
                    Swal.fire({
                        text: i18n.get('logTimeOut'),
                        showCancelButton: false,
                        allowOutsideClick:false,
                        allowEscapeKey:false,
                        reverseButtons:true,
                        width:'16em',
                        confirmButtonColor: '#94cb82',
                        confirmButtonText: i18n.get('confirm'),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var url = window.location.href
                            window.localStorage.setItem('returnurl',url)
                            window.location.href = '../login/login.html'
                        }
                    })
                }else{
                    Swal.fire({
                        text:res.error,
                        confirmButtonText: i18n.get('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
            }else{
                window.localStorage.clear();
                Swal.fire({
                    text: i18n.get('logTimeOut'),
                    showCancelButton: false,
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    reverseButtons:true,
                    width:'16em',
                    confirmButtonColor: '#94cb82',
                    confirmButtonText: i18n.get('confirm'),
                }).then((result) => {
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
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
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
        channel:""
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
                $('#ak').html(res.lenovokey)
                $('#sk').html(res.secretkey)
                $('#channel').val(res.channel)
                $('#body-num').html($('#channel').val().length)
                $('#totalASRAmount').html(res.totalASRAmount == '-99' ? '无限次' : res.totalASRAmount)
                $('#totalTTSAmount').html(res.totalTTSAmount == '-99' ? '无限次' : res.totalTTSAmount)
                $('#remainASRAmount').html(res.remainASRAmount == '-99' ? '无限次' : res.remainASRAmount)
                $('#remainTTSAmount').html(res.remainTTSAmount == '-99' ? '无限次' : res.remainTTSAmount)
            }else{
                window.localStorage.clear();
                Swal.fire({
                    text: i18n.get('logTimeOut'),
                    showCancelButton: false,
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    reverseButtons:true,
                    width:'16em',
                    confirmButtonColor: '#94cb82',
                    confirmButtonText: i18n.get('confirm'),
                }).then((result) => {
                    if (result.isConfirmed) {
                    var url = window.location.href
                    window.localStorage.setItem('returnurl',url)
                    window.location.href = '../login/login.html'
                    }
                })
            }
        },error:function(err){
            Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    });
}

$('#channel').bind("input propertychange", function(){
    $('#body-num').html($('#channel').val().length)
})