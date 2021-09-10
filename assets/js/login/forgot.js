let i18n = new EhiI18n('../lan/',()=>{
    //获取当前语言
    // console.log(`当前语言${i18n.getLanguage()}`)
    //从语言中获取值,可在Js获取的时候使用
    // console.log(i18n.get('login_username'))
  })

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
    if(localStorage.getItem('ehiI18n.Language') == 'zh' || localStorage.getItem('ehiI18n.Language') == '' || localStorage.getItem('ehiI18n.Language') == null || localStorage.getItem('ehiI18n.Language') == undefined){
        $('.trans').attr('src','../assets/img/trans2.png')
    }else{
        $('.trans').attr('src','../assets/img/trans.png')
    }
})(jQuery)

var c = 60
function oneSteps(){
    $('#stepone-loading').show()
    $('#stepone').attr('disabled','disabled')
    $.ajax({
        url:proURL+'/web/checkingcode',
        type:'post',
        dataType:'json',
        data:{
            u:$('#forgot-username').val(),
            code:$('#code').val()
        },
        success:function(res){
            $('#stepone-loading').hide()
            $('#stepone').removeAttr('disabled','disabled')
            if(res.status == 0){
                $('.ac').addClass('active')
                $('.ac').siblings('.content').removeClass('active')
            }else{
                Swal.fire({
                    text:res.error,
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
            
        },
        error:function(){
            $('#stepone-loading').hide()
            $('#stepone').removeAttr('disabled','disabled')
            Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
    
}

function twoSteps(){
    if(newPass() && checkNewpass()){
        $('#steptwo-loading').show()
        $('#steptwo').attr('disabled','disabled')
        $.ajax({
            url:proURL+'/web/resetpwd',
            type:'post',
            dataType:'json',
            data:{
                u:$('#forgot-username').val(),
                code:$('#code').val(),
                pwd:$.base64.encode($('#forgot-password').val())
            },
            success:function(res){
                $('#steptwo-loading').hide()
                $('#steptwo').removeAttr('disabled','disabled')
                if(res.status == 0){
                    $('.tc').addClass('active')
                    $('.tc').siblings('.content').removeClass('active')
                }else{
                    Swal.fire({
                        text:res.error,
                        confirmButtonText: i18n.get('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
                
            },
            error:function(){
                $('#steptwo-loading').hide()
                $('#steptwo').removeAttr('disabled','disabled')
                Swal.fire({
                    text:i18n.get('server_error'),
                    confirmButtonText: i18n.get('confirm'),
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
    var passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~.'!@#￥$%^&*()+-_=:]{8,}$/
    var pwdVal = $('#forgot-password').val()
    if(pwdVal == ''){
        $('.forgot-password-error').html(i18n.get('password_empty'))
        return false
    }else if(!passwordReg.test(pwdVal)){
        $('.forgot-password-error').html(i18n.get('password_error'))
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
        $('.forgot-password-check').html(i18n.get('checkpwd_error'))
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
    $.ajax({
        url:proURL+'/web/email',
        type:'post',
        dataType:'json',
        data:{
            u:$('#forgot-username').val(),
            language:localStorage.getItem('ehiI18n.Language') == 'zh' || '' ? 'chinese': 'english'
        },
        success:function(res){
            if(res.status == 0){
                timer()
                Swal.fire({
                    text:res.message,
                    icon:'success',
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }else{
                $('.code-btn').css('pointer-events','auto')
                Swal.fire({
                    text:res.error,
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
            
        },
        error:function(){
            $('.code-btn').css('pointer-events','auto')
            Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
}

function timer() {
    if (c == 0) {    
        $('.code-btn').css('pointer-events','auto')        
        $('.code-btn').html(i18n.get('pass_get_code'))
        c = 60;
    } else {
        $('.code-btn').html(` ${c} s`)
        c--;
        setTimeout(function() {
    	  timer()
        }, 1000)
    }
}


function isLang(){
    if(localStorage.getItem('ehiI18n.Language') == 'zh' || localStorage.getItem('ehiI18n.Language') == '' || localStorage.getItem('ehiI18n.Language') == null || localStorage.getItem('ehiI18n.Language') == undefined){
        i18n.setLanguage('us')
        $('.trans').attr('src','../assets/img/trans.png')
        // console.log("en===============")
      }else if(localStorage.getItem('ehiI18n.Language') == 'us'){
        i18n.setLanguage('zh')
        $('.trans').attr('src','../assets/img/trans2.png')
        // console.log("中文===============")
      }
  }