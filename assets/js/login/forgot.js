

!(function($){
    function aos_init() {
        AOS.init({
          duration: 1000,
          once: true
        });
    }
    $(window).on('load', function() {
        aos_init();
    });
    $('#stepone-loading').hide()
    $('#steptwo-loading').hide()
})(jQuery)

var c = 60
function oneSteps(){
    var checkParams = {
        u:$('#forgot-username').val(),
        code:$('#code').val(),
        p:"",
        language:"",
        username:"",
        phone:"",
        company:"",
        dept:"",
        lid:"",
        t:"",
        opwd:"",
        pwd:"",
        lenovoid:"",
        userService:"",
        imgCode:"",
        ucode:"",
        channel:"",
        vehicle:""
    }
    var stringParams = JSON.stringify(checkParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
    checkParams.sign = md5(stringParams)
    $('#stepone-loading').show()
    $('#stepone').attr('disabled','disabled')
    $.ajax({
        url:proURL+'/web/checkingcode',
        type:'post',
        dataType:'json',
        data:checkParams,
        success:function(res){
            $('#stepone-loading').hide()
            $('#stepone').removeAttr('disabled','disabled')
            if(res.status == 0){
                $('.ac').addClass('active')
                $('.ac').siblings('.content').removeClass('active')
            }else{
                Swal.fire({
                    text:res.error,
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
            
        },
        error:function(){
            $('#stepone-loading').hide()
            $('#stepone').removeAttr('disabled','disabled')
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
    
}

function twoSteps(){
    if(newPass() && checkNewpass()){
        $('#steptwo-loading').show()
        $('#steptwo').attr('disabled','disabled')
        var pwdParams = {
            u:$('#forgot-username').val(),
            code:$('#code').val(),
            pwd:$.base64.encode($('#forgot-password').val()),
            p:"",
            language:"",
            username:"",
            phone:"",
            company:"",
            dept:"",
            lid:"",
            t:"",
            opwd:"",
            lenovoid:"",
            userService:"",
            imgCode:"",
            ucode:"",
            channel:"",
            vehicle:""
        }
        var stringParams = JSON.stringify(pwdParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        pwdParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/resetpwd',
            type:'post',
            dataType:'json',
            data:pwdParams,
            success:function(res){
                console.log(res)
                $('#steptwo-loading').hide()
                $('#steptwo').removeAttr('disabled','disabled')
                if(res.status == 0){
                    $('.tc').addClass('active')
                    $('.tc').siblings('.content').removeClass('active')
                }else{
                    Swal.fire({
                        text:res.error,
                        confirmButtonText: $.i18n.prop('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
                
            },
            error:function(){
                $('#steptwo-loading').hide()
                $('#steptwo').removeAttr('disabled','disabled')
                Swal.fire({
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
    }else{
        return false
    }
    
}

function finishSteps(){

}

function newPass(){
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/
    var pwdVal = $('#forgot-password').val()
    if(pwdVal == ''){
        $('.forgot-password-error').html($.i18n.prop('password_empty'))
        return false
    }else if(!passwordReg.test(pwdVal)){
        $('.forgot-password-error').html($.i18n.prop('password_error'))
        return false
    }else{
        $('.forgot-password-error').html('')
        return true
    }
}
function checkNewpass(){
    if($('#checkpass').val() === $('#forgot-password').val()){
        return true
    }else{
        $('.forgot-password-check').html($.i18n.prop('checkpwd_error'))
        return false
    }
}
$('#forgot-password').on('input', function(){
    if($("#forgot-password").val() != ''){
        $('.forgot-password-error').html('')
    }
})
$('#checkpass').on('input', function(){
    if($("#checkpass").val() != ''){
        $('.forgot-password-check').html('')
    }
})

function getCode(){
    $('.code-btn').css('pointer-events','none')
    var emailParams = {
        u:$('#forgot-username').val(),
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
            code:"",
            pwd:"",
            p:"",
            username:"",
            phone:"",
            company:"",
            dept:"",
            lid:"",
            t:"",
            opwd:"",
            lenovoid:"",
            userService:"",
            imgCode:"",
            ucode:"",
            channel:"",
            vehicle:""
    }
    var stringParams = JSON.stringify(emailParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        emailParams.sign = md5(stringParams)
    $.ajax({
        url:proURL+'/web/email',
        type:'post',
        dataType:'json',
        data:emailParams,
        success:function(res){
            if(res.status == 0){
                timer()
                Swal.fire({
                    text:res.message,
                    icon:'success',
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }else{
                $('.code-btn').css('pointer-events','auto')
                Swal.fire({
                    text:res.error,
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
            
        },
        error:function(){
            $('.code-btn').css('pointer-events','auto')
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
}

function timer() {
    if (c == 0) {    
        $('.code-btn').css('pointer-events','auto')        
        $('.code-btn').html($.i18n.prop('pass_get_code'))
        c = 60;
    } else {
        $('.code-btn').html(` ${c} s`)
        c--;
        setTimeout(function() {
    	  timer()
        }, 1000)
    }
}