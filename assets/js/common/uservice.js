var checkList=[]
$('#userver-loading').hide()
if(localStorage.getItem('us') == 1 || localStorage.getItem('us') == 2){
    checkList.push(localStorage.getItem('us'))
    if(localStorage.getItem('us') == 1){
        $('.asrcheck').attr("checked","checked")
        $('.asrcheck').attr("disabled","true")
        $('.span1').css('display','block')
        $('.span2').css('display','none')
    }
    if(localStorage.getItem('us') == 2){
        $('.ttscheck').attr("checked","checked")
        $('.ttscheck').attr("disabled","true")
        $('.span1').css('display','none')
        $('.span2').css('display','block')
    }
}else if(localStorage.getItem('us') == 3){
    checkList.push('1','2')
    $('.asrcheck').attr("checked","checked")
    $('.ttscheck').attr("checked","checked")
    $('.asrcheck').attr("disabled","true")
    $('.ttscheck').attr("disabled","true")
    $('.sub-btn').attr('disabled','true')
    $('.span1').css('display','block')
    $('.span2').css('display','block')
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
        $.ajax({
          type:"POST",
            url:proURL+'/web/updUserService',
            data:{
                t:window.localStorage.getItem('token'),
                lid:$.base64.decode(window.localStorage.getItem('acd')),
                language:localStorage.getItem('ehiI18n.Language') == 'zh' || 'null' || '' ? 'chinese': 'english',
                userService:checkArr
            },
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
                    })
                }if(res.status == 101){
                    localStorage.removeItem('token')
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
                localStorage.removeItem('token')
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
    $.ajax({
        type:"POST",
        url:proURL+'/userinfo',
        data:{
            username:window.localStorage.getItem('un'),
            lenovoid:$.base64.decode(window.localStorage.getItem('acd')),
            t:localStorage.getItem('token')
        },
        dataType:"json",
        headers: {
            "channel" : "cloudasr"
        },
        success:function(res){
            if(res.errorcode != 1024){
                $('#ak').html(res.lenovokey)
                $('#sk').html(res.secretkey)
                $('#totalASRAmount').html(res.totalASRAmount)
                $('#totalTTSAmount').html(res.totalTTSAmount)
                $('#remainASRAmount').html(res.remainASRAmount)
                $('#remainTTSAmount').html(res.remainTTSAmount)
            }else{
                localStorage.removeItem('token')
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