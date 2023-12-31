$('#reset-loading').hide()
function regPwd(){
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/
    var pwdVal = $('#reg-password').val()
    if(pwdVal == ''){
        $('.reg-password-error').html($.i18n.prop('password_empty'))
        return false
    }else if(!passwordReg.test(pwdVal)){
        $('.reg-password-error').html($.i18n.prop('password_error'))
        return false
    }else{
        $('.reg-password-error').html('')
        return true
    }
}

$('#reg-password').on('input',function(){
    if($("#reg-password").val() != ''){
        $('.reg-password-error').html('')
    }
})

function regCheckpwd(){
    if($('#reg-checkpwd').val() === $('#reg-password').val()){
        return true
    }else{
        $('.reg-checkpwd-error').html($.i18n.prop('checkpwd_error'))
        return false
    }
}
$('#reg-checkpwd').on('input',function(){
    if($("#reg-checkpwd").val() != ''){
        $('.reg-checkpwd-error').html('')
    }
})


$('.reset-btn').click(function(){
    if(regPwd() && regCheckpwd()){
        $('#reset-loading').show()
        $('.reset-btn').attr('disabled','disabled')
        var regParams = {
            lid:$.base64.decode(localStorage.getItem('acd')),
            t:$.base64.decode(localStorage.getItem('token')),
            pwd:$.base64.encode($('#reg-password').val()),
            u:"",
            p:"",
            language:"",
            username:"",
            phone:"",
            company:"",
            dept:"",
            opwd:"",
            lenovoid:"",
            userService:"",
            code:"",
            imgCode:"",
            ucode:"",
            channel:"",
            vehicle:""
        }
        var stringParams = JSON.stringify(regParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        regParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/setpwd',
            type:'post',
            dataType:'json',
            data:regParams,
            success:function(res){
                $('#reset-loading').hide()
                $('.reset-btn').removeAttr('disabled','disabled')
                if(res.status == 0){
                    localStorage.clear();
                    Swal.fire({
                        text: $.i18n.prop('check_success'),
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
                        }else{
                            $('.user').css("display","none")
                            $('.login-reg').css("display","block")
                        }
                      })
                }else{
                    localStorage.clear();
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
                        }else{

                        }
                      })
                }
            },
            error:function(){
                $('#reset-loading').hide()
                $('.reset-btn').removeAttr('disabled','disabled')
                Swal.fire({
                    allowOutsideClick:false,
                    allowEscapeKey:false,
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
    }
})