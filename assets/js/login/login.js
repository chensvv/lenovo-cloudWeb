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
    $('#login-loading').hide()
    $('#reg-loading').hide()
    if(localStorage.getItem('ehiI18n.Language') == 'zh' || localStorage.getItem('ehiI18n.Language') == '' || localStorage.getItem('ehiI18n.Language') == null || localStorage.getItem('ehiI18n.Language') == undefined){
        $('.trans').attr('src','../assets/img/trans2.png')
      }else{
        $('.trans').attr('src','../assets/img/trans.png')
      }
})(jQuery)
$('#loginBtn').click(function(){
    
    var ferrer = document.referrer
    var username = $("#login-username").val()
    var password = $.base64.encode($('#login-password').val())

    if(username == ''){
        $('.login-username-empty').html(i18n.get('username_empty'))
    }else if(password == ''){
        $('.login-password-empty').html(i18n.get('password_empty'))
    }else{
        $('#login-loading').show()
        $('#loginBtn').attr('disabled','ture')
        $.ajax({
            url:proURL+'/web/login',
            type:'post',
            dataType:'json',
            data:{u:username,p:password,language:localStorage.getItem('ehiI18n.Language') == 'zh' || '' ? 'chinese': 'english'},
            success:function(res){
                $('#login-loading').hide()
                $('#loginBtn').removeAttr('disabled','disabled')
                if(res.status == 0){
                    window.localStorage.setItem('acd',$.base64.encode(res.lenovoId))
                    window.localStorage.setItem('lk',$.base64.encode(res.lenovoKey))
                    window.localStorage.setItem('sk',$.base64.encode(res.secretKey))
                    window.localStorage.setItem('p', $.base64.encode($.base64.encode($('#login-password').val())))
                    window.localStorage.setItem('un',res.userName)
                    window.localStorage.setItem('token',res.token)
                    window.localStorage.setItem('us',res.userService)
                    window.localStorage.setItem('ms',res.meetingService)
                    // var param = {
                    //     'acd':$.base64.encode(res.lenovoId),
                    //     'lk':$.base64.encode(res.lenovoKey),
                    //     'sk':$.base64.encode(res.secretKey),
                    //     'p':$.base64.encode($('#login-password').val()),
                    //     'un':res.userName,
                    //     'token':res.token,
                    //     'us':res.userService,
                    //     'ms':res.meetingService
                    // }
                    // window.localStorage.setItem('data',JSON.stringify(param))
                    if(window.localStorage.getItem('returnurl') != null){
                        window.location.href = window.localStorage.getItem('returnurl')
                    }else{
                        window.location.href = '../welcome/index.html'
                    }
                    window.localStorage.removeItem('returnurl')
                }else{
                    Swal.fire({
                        toast: true,
                        icon:'warning',
                        position: 'top-end',
                        background:'#fff3cd',
                        text: res.description,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            },
            error:function(err){
                $('#login-loading').hide()
                $('#loginBtn').removeAttr('disabled','disabled')
                Swal.fire({
                    text:i18n.get('server_error'),
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
    }
})

$('#regbtn').click(function(){
    var checkVal
    if($('#asrcheck').is(":checked") == true && $('#ttscheck').is(":checked") == true){
        checkVal = 3
    }else if($('#asrcheck').is(":checked") == false && $('#ttscheck').is(":checked") == false){
        checkVal = 0
    }else{
        if($('#asrcheck').is(":checked") == true && $('#ttscheck').is(":checked") == false){
            checkVal = 1
        }
        if($('#asrcheck').is(":checked") == false && $('#ttscheck').is(":checked") == true){
            checkVal = 2
        }
    }
    $('#reg-loading').show()
    $('#regbtn').attr('disabled','true')
    $.ajax({
        url:proURL+'/web/register',
        type:'post',
        dataType:'json',
        data:{
            u:$('#reg-email').val(),
            phone:$('#reg-phone').val(),
            username:$('#reg-name').val(),
            company:$('#reg-company').val(),
            dept:$('#reg-dep').val(),
            userService:checkVal,
            p:$.base64.encode($('#reg-password').val()),
            language:localStorage.getItem('ehiI18n.Language') == 'zh' || '' ? 'chinese': 'english'
        },
        success:function(res){
            $('#reg-loading').hide()
            $('#regbtn').removeAttr('disabled','disabled')
            if(res.status == 0){
                Swal.fire({
                    toast: true,
                    icon:'success',
                    position: 'top-end',
                    background:'#d4edda',
                    text: res.message,
                    showConfirmButton: false,
                    timer: 2000
                })
                // var param = {
                //     'acd':$.base64.encode(res.lenovoId),
                //     'lk':$.base64.encode(res.lenovoKey),
                //     'sk':$.base64.encode(res.secretKey),
                //     'p':$.base64.encode($('#reg-password').val()),
                //     'un':res.userName,
                //     'token':res.token,
                //     'us':res.userService,
                //     'ms':res.meetingService
                // }
                // window.localStorage.setItem('data',JSON.stringify(param))

                window.localStorage.setItem('acd',$.base64.encode(res.lenovoId))
                window.localStorage.setItem('lk',$.base64.encode(res.lenovoKey))
                window.localStorage.setItem('sk',$.base64.encode(res.secretKey))
                window.localStorage.setItem('p', $.base64.encode($.base64.encode($('#reg-password').val())))
                window.localStorage.setItem('un',res.userName)
                window.localStorage.setItem('token',res.token)
                window.localStorage.setItem('us',res.userService)
                window.localStorage.setItem('ms',res.meetingService)
                if(window.localStorage.getItem('returnurl') != null){
                    window.location.href = window.localStorage.getItem('returnurl')
                }else{
                    window.location.href = '../welcome/index.html'
                }
                window.localStorage.removeItem('returnurl')
            }else{
                Swal.fire({
                    toast: true,
                    icon:'warning',
                    position: 'top-end',
                    background:'#fff3cd',
                    text: res.error,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        error:function(err){
            $('#reg-loading').hide()
            $('#regbtn').removeAttr('disabled','disabled')
            Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
})

$('#login-username').on('input',function(){
    if($("#login-username").val() != ''){
        $('.login-username-empty').html('')
    }
})
$('#login-password').on('input',function(){
    if($("#login-password").val() != ''){
        $('.login-password-empty').html('')
    }
})

$('#nextbtn').on('click',function(){
    if(regEmail() && regPhone() && regPwd() && regCheckpwd()){
        $('#mustInfo').css('display','none')
        $('#basicInfo').css('display','block')
    }else{
        return false
    }
})

$('#prevbtn').on('click',function(){
        $('#mustInfo').css('display','block')
        $('#basicInfo').css('display','none')
})

$('#prevbtnm').on('click',function(){
    $('#basicInfo').css('display','block')
    $('#serviceInfo').css('display','none')
})

$('#nextbtnm').on('click',function(){
    if(getStyle(document.getElementById('dep'), 'display') == 'none'){
        if(regName() && regCompany()){
            $('#basicInfo').css('display','none')
            $('#serviceInfo').css('display','block')
        }else{
            return false
        }
    }else{
        if(regName() && regCompany() && regDep()){
            $('#basicInfo').css('display','none')
            $('#serviceInfo').css('display','block')
        }else{
            return false
        }
    }
})
    
    
function regEmail(){
    var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var emailVal = $('#reg-email').val()
    if(emailVal == ''){
        $('.reg-email-error').html(i18n.get('email_empty'))
        return false
    }else if(!emailReg.test(emailVal)){
        $('.reg-email-error').html(i18n.get('email_error'))
        return false
    }else{
        $('.reg-email-error').html('')
        return true
    }
}

function regPhone(){
    var phoneReg = /^1[0-9]{10}$/
    var phoneVal = $('#reg-phone').val()
    if(phoneVal == ''){
        $('.reg-phone-error').html(i18n.get('phone_empty'))
        return false
    }else if(!phoneReg.test(phoneVal)){
        $('.reg-phone-error').html(i18n.get('phone_error'))
        return false
    }else{
        $('.reg-phone-error').html('')
        return true
    }
}

function regPwd(){
    var passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z~.'!@#￥$%^&*()+-_=:]{8,}$/
    var pwdVal = $('#reg-password').val()
    if(pwdVal == ''){
        $('.reg-password-error').html(i18n.get('password_empty'))
        return false
    }else if(!passwordReg.test(pwdVal)){
        $('.reg-password-error').html(i18n.get('password_error'))
        return false
    }else{
        $('.reg-password-error').html('')
        return true
    }
}

function regCheckpwd(){
    if($('#reg-checkpwd').val() === $('#reg-password').val()){
        return true
    }else{
        $('.reg-checkpwd-error').html(i18n.get('checkpwd_error'))
        return false
    }
}

function regName(){
    var beReg = /^\S+$/;
    if($('#reg-name').val() == ''){
        $('.reg-name-error').html(i18n.get('name_error'))
        return false
    }else if(!beReg.test($('#reg-name').val())){
        $('.reg-name-error').html(i18n.get('be_error'))
        return false
    }else{
        return true
    }
}

function regCompany(){
    var beReg = /^\S+$/;
    if($('#reg-company').val() == ''){
        $('.reg-company-error').html(i18n.get('company_error'))
        return false
    }else if(!beReg.test($('#reg-company').val())){
        $('.reg-company-error').html(i18n.get('be_error'))
        return false
    }else{
        return true
    }
}

function regDep(){
    var beReg = /^\S+$/;
    if($('#reg-dep').val() == ''){
        $('.reg-dep-error').html(i18n.get('dep_error'))
        return false
    }else if(!beReg.test($('#reg-dep').val())){
        $('.reg-dep-error').html(i18n.get('be_error'))
        return false
    }else{
        return true
    }
}

function isShowdep(){
    var panyVal = $('#reg-company').val()
    if(panyVal.indexOf('联想') != -1 || panyVal.indexOf('Lenovo') != -1 || panyVal.indexOf('lenovo') != -1){
        $('#dep').css('display','block')
    }else{
        $('#dep').css('display','none')
    }
}

function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
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
  