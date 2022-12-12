
  var c = 60
  var reguuid
  var loginuuid
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
})(jQuery)
$('a[data-toggle="tab"]').on('hidden.bs.tab', function (event) {
    // event.target // newly activated tab
    // event.relatedTarget // previous active tab
    console.log(event.target.id)
    if(event.target.id = 'nav-profile-tab'){
        $('#nav-profile input').val('')
        $('.error-tooltip').html('')
        $('.error-tooltip').siblings().css('border-color','')
        $('.reg-code-btn').siblings().css('border-color','')
    }
  })
  console.log(getCookies(document.cookie))
$('#loginBtn').click(function(){
    
    var username = $("#login-username").val()
    var password = $.base64.encode($('#login-password').val())

    if(username == ''){
        $('.login-username-empty').html($.i18n.prop('username_empty'))
        $('.login-username-empty').siblings().css('border-color','#dc3545')
    }else if(password == ''){
        $('.login-password-empty').html($.i18n.prop('password_empty'))
        $('.login-password-empty').siblings().css('border-color','#dc3545')
    }else{
        $('#login-loading').show()
        $('#loginBtn').attr('disabled','ture')
        var loginParams = {
            u:username,
            p:password,
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
            imgCode:$('#login-img-code').val(),
            ucode:loginuuid,
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
            code:"",
            channel:""
        }
        var stringParams = JSON.stringify(loginParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        loginParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/login',
            type:'post',
            dataType:'json',
            data:loginParams,
            success:function(res){
                $('#login-loading').hide()
                $('#loginBtn').removeAttr('disabled','disabled')
                if(res.status == 0){
                    window.localStorage.setItem('acd',$.base64.encode(res.lenovoId))
                    window.localStorage.setItem('lk',$.base64.encode(res.lenovoKey))
                    window.localStorage.setItem('sk',$.base64.encode(res.secretKey))
                    window.localStorage.setItem('p', $.base64.encode($.base64.encode($('#login-password').val())))
                    window.localStorage.setItem('un',$.base64.encode(res.userName))
                    window.localStorage.setItem('token',$.base64.encode(res.token))
                    window.localStorage.setItem('us',res.userService)
                    window.localStorage.setItem('ms',res.meetingService)
                    window.localStorage.setItem('ch',$.base64.encode(res.channel))
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
                    getLoginImgCode()
                    Swal.fire({
                        toast: true,
                        icon:'warning',
                        position: 'top-end',
                        background:'#fff3cd',
                        text: res.description,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            },
            error:function(err){
                getLoginImgCode()
                $('#login-loading').hide()
                $('#loginBtn').removeAttr('disabled','disabled')
                Swal.fire({
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
    }
})

$('#regbtn').click(function(){
        $('#reg-loading').show()
        $('#regbtn').attr('disabled','true')
        var regParams = {
            u:$('#reg-email').val(),
            phone:$('#reg-phone').val(),
            username:$('#reg-name').val(),
            company:$('#reg-company').val(),
            dept:$('#reg-dep').val(),
            userService:"",
            p:$.base64.encode($('#reg-password').val()),
            code:$('#reg-code').val(),
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
            imgCode:$('#reg-img-code').val(),
            ucode:reguuid,
            lid:"",
            t:"",
            opwd:"",
            pwd:"",
            lenovoid:"",
            channel:""
        }
        var stringParams = JSON.stringify(regParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')

        regParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/register',
            type:'post',
            dataType:'json',
            data:regParams,
            success:function(res){
                console.log(res)
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
                        timer: 3000
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

                    setTimeout(()=>{
                        window.localStorage.setItem('acd',$.base64.encode(res.lenovoId))
                        window.localStorage.setItem('lk',$.base64.encode(res.lenovoKey))
                        window.localStorage.setItem('sk',$.base64.encode(res.secretKey))
                        window.localStorage.setItem('p', $.base64.encode($.base64.encode($('#reg-password').val())))
                        window.localStorage.setItem('un',$.base64.encode(res.userName))
                        window.localStorage.setItem('token',$.base64.encode(res.token))
                        window.localStorage.setItem('us',res.userService)
                        window.localStorage.setItem('ms',res.meetingService)
                        window.localStorage.setItem('ch',$.base64.encode(res.channel))
                        if(window.localStorage.getItem('returnurl') != null){
                            window.location.href = window.localStorage.getItem('returnurl')
                        }else{
                            window.location.href = '../welcome/index.html'
                        }
                        window.localStorage.removeItem('returnurl')
                    },1000)
                }else{
                    getRegImgCode()
                    Swal.fire({
                        toast: true,
                        icon:'warning',
                        position: 'top-end',
                        background:'#fff3cd',
                        text: res.error,
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
            },
            error:function(err){
                getRegImgCode()
                $('#reg-loading').hide()
                $('#regbtn').removeAttr('disabled','disabled')
                Swal.fire({
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
})

$('#login-username').on('input',function(){
    if($("#login-username").val() != ''){
        $('.login-username-empty').html('')
        $('.login-username-empty').siblings().css('border-color','')
    }
})
$('#login-password').on('input',function(){
    if($("#login-password").val() != ''){
        $('.login-password-empty').html('')
        $('.login-password-empty').siblings().css('border-color','')
    }
})

$('#nextbtn').on('click',function(){
    if(getStyle(document.getElementById('dep'), 'display') == 'none'){
        if(regEmail() && regPhone() && regPwd() && regCheckpwd() && regName() && regCompany()){
            $('#mustInfo').css('display','none')
            $('#basicInfo').css('display','block')
            $('.ac').addClass('active')
            $('#val-email').val($('#reg-email').val())
            getRegImgCode()
        }else{
            return false
        }
    }else{
        if(regEmail() && regPhone() && regPwd() && regCheckpwd() && regName() && regCompany() && regDep()){
            $('#mustInfo').css('display','none')
            $('#basicInfo').css('display','block')
            $('#val-email').val($('#reg-email').val())
            getRegImgCode()
        }else{
            return false
        }
    }
})

$('#prevbtn').on('click',function(){
        $('#mustInfo').css('display','block')
        $('#basicInfo').css('display','none')
        $('.ac').removeClass('active')
})

$('#prevbtnm').on('click',function(){
    $('#basicInfo').css('display','block')
    $('#serviceInfo').css('display','none')
})

$('#nextbtnm').on('click',function(){
    
})
    
    
function regEmail(){
    var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var emailVal = $('#reg-email').val()
    if(emailVal == ''){
        $('.reg-email-error').html($.i18n.prop('email_empty'))
        $('.reg-email-error').siblings().css('border-color','#dc3545')
        return false
    }else if(emailReg.test(emailVal)){
        $('.reg-email-error').html('')
        $('.reg-email-error').siblings().css('border-color','')
        return true
    }else{
        $('.reg-email-error').html($.i18n.prop('email_error'))
        $('.reg-email-error').siblings().css('border-color','#dc3545')
        return false
    }
}
var flag
function regCode(){
    flag = false
    var codeVal = $('#reg-code').val()
    if(codeVal == ''){
        $('.reg-code-error').html($.i18n.prop('code_empty'))
        $('.reg-code-btn').siblings().css('border-color','#dc3545')
        flag = false
    }else{
        $('.reg-code-error').html('')
        $('.reg-code-btn').siblings().css('border-color','')
    }
}
function regImgCode(){
    var imgCodeVal = $('#reg-img-code').val()
    if(imgCodeVal == ''){
        $('.reg-img-error').html($.i18n.prop('img_code'))
        $('.reg-img-code').siblings().css('border-color','#dc3545')
    }else{
        var codeParams = {
            imgCode:$('#reg-img-code').val(),
            ucode:reguuid,
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
            u:"",
            p:"",
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
            code:"",
            channel:""
        }
        var stringParams = JSON.stringify(codeParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        codeParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/checkImgCode',
            type:'post',
            dataType:'json',
            data:codeParams,
            success:function(res){
                if(res.status == 0){
                    $('.reg-img-error').html('')
                    $('.reg-img-code').siblings().css('border-color','')
                    flag = true
                }else{
                    $('.reg-img-error').html(res.error)
                    $('.reg-img-code').siblings().css('border-color','#dc3545')
                    flag = false
                }
                
            },
            error:function(){
                Swal.fire({
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
                flag = false
            }
        })
        return flag
    }
}
function loginImgCode(){
    var imgCodeVal = $('#login-img-code').val()
    if(imgCodeVal == ''){
        $('.login-img-error').html($.i18n.prop('img_code'))
        $('.login-img-code').siblings().css('border-color','#dc3545')
    }else{
        var codeParams = {
            imgCode:$('#login-img-code').val(),
            ucode:loginuuid,
            language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
            u:"",
            p:"",
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
            code:"",
            channel:""
        }
        var stringParams = JSON.stringify(codeParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        codeParams.sign = md5(stringParams)
        $.ajax({
            url:proURL+'/web/checkImgCode',
            type:'post',
            dataType:'json',
            data:codeParams,
            success:function(res){
                if(res.status == 0){
                    $('.login-img-error').html('')
                    $('.login-img-code').siblings().css('border-color','')
                    flag = true
                }else{
                    $('.login-img-error').html(res.error)
                    $('.login-img-code').siblings().css('border-color','#dc3545')
                    flag = false
                }
                
            },
            error:function(){
                Swal.fire({
                    text:$.i18n.prop('server_error'),
                    confirmButtonText: $.i18n.prop('confirm'),
                    confirmButtonColor: '#94cb82'
                })
                flag = false
            }
        })
        return flag
    }
}

function regPhone(){
    var phoneReg = /^1[0-9]{10}$/
    var phoneVal = $('#reg-phone').val()
    if(phoneVal == ''){
        $('.reg-phone-error').html($.i18n.prop('phone_empty'))
        $('.reg-phone-error').siblings().css('border-color','#dc3545')
        return false
    }else if(phoneReg.test(phoneVal)){
        $('.reg-phone-error').html('')
        $('.reg-phone-error').siblings().css('border-color','')
        return true
    }else{
        $('.reg-phone-error').html($.i18n.prop('phone_error'))
        $('.reg-phone-error').siblings().css('border-color','#dc3545')
        
        return false
    }
}


function regPwd(){
    var passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,12}$/
    var pwdVal = $('#reg-password').val()
    if(pwdVal == ''){
        $('.reg-password-error').html($.i18n.prop('password_empty'))
        $('.reg-password-error').siblings().css('border-color','#dc3545')
        return false
    }else if(passwordReg.test(pwdVal)){
        $('.reg-password-error').html('')
        $('.reg-password-error').siblings().css('border-color','')
        return true
    }else{
        $('.reg-password-error').html($.i18n.prop('password_error'))
        $('.reg-password-error').siblings().css('border-color','#dc3545')
        
        return false
    }
}

function regCheckpwd(){
    if($('#reg-checkpwd').val() === $('#reg-password').val()){
        return true
    }else{
        $('.reg-checkpwd-error').html($.i18n.prop('checkpwd_error'))
        $('.reg-checkpwd-error').siblings().css('border-color','#dc3545')
        return false
    }
}

$('#reg-checkpwd').on('input',function(){
    if($('#reg-checkpwd').val() === $('#reg-password').val()){
        $('.reg-checkpwd-error').html('')
        $('.reg-checkpwd-error').siblings().css('border-color','')
    }
})

function regName(){
    var beReg = /^\S+$/;
    if($('#reg-name').val() == ''){
        $('.reg-name-error').html($.i18n.prop('name_error'))
        $('.reg-name-error').siblings().css('border-color','#dc3545')
        return false
    }else if(!beReg.test($('#reg-name').val())){
        $('.reg-name-error').html($.i18n.prop('be_error'))
        $('.reg-name-error').siblings().css('border-color','#dc3545')
        return false
    }else{
        $('.reg-name-error').html('')
        $('.reg-name-error').siblings().css('border-color','')
        return true
    }
}

function regCompany(){
    var beReg = /^\S+$/;
    if($('#reg-company').val() == ''){
        $('.reg-company-error').html($.i18n.prop('company_error'))
        $('.reg-company-error').siblings().css('border-color','#dc3545')
        return false
    }else if(!beReg.test($('#reg-company').val())){
        $('.reg-company-error').html($.i18n.prop('be_error'))
        $('.reg-company-error').siblings().css('border-color','#dc3545')
        return false
    }else{
        $('.reg-company-error').html('')
        $('.reg-company-error').siblings().css('border-color','')
        return true
    }
}

function regDep(){
    var beReg = /^\S+$/;
    if($('#reg-dep').val() == ''){
        $('.reg-dep-error').html($.i18n.prop('dep_error'))
        $('.reg-dep-error').siblings().css('border-color','#dc3545')
        return false
    }else if(!beReg.test($('#reg-dep').val())){
        $('.reg-dep-error').html($.i18n.prop('be_error'))
        $('.reg-dep-error').siblings().css('border-color','#dc3545')
        return false
    }else{
        $('.reg-dep-error').html('')
        $('.reg-dep-error').siblings().css('border-color','')
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

function getCode(){
    if(!regEmail()){
        return false
    }
    $('.reg-code-btn').css('pointer-events','none')
    var regCodeParams = {
        u:$('#reg-email').val(),
        language:getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == undefined ? 'chinese': 'english',
        p:"",
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
        code:"",
        imgCode:"",
        ucode:"",
        channel:""
    }
    var stringParams = JSON.stringify(regCodeParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
    regCodeParams.sign = md5(stringParams)
    $.ajax({
        url:proURL+'/web/registercode',
        type:'post',
        dataType:'json',
        data:regCodeParams,
        success:function(res){
            if(res.status == 0){
                timer()
            // Swal.fire({
            //     text:$.i18n.prop('code_sent'),
            //     icon:'success',
            //     confirmButtonText: $.i18n.prop('confirm'),
            //     confirmButtonColor: '#94cb82'
            // })
                Swal.fire({
                    toast: true,
                    icon:'success',
                    position: 'top-end',
                    background:'#a6f1b8',
                    text: res.message,
                    showConfirmButton: false,
                    timer: 3000
                })
            }else{
                $('.reg-code-btn').css('pointer-events','auto')
                // Swal.fire({
                //     text:res.error,
                //     confirmButtonText: $.i18n.prop('confirm'),
                //     confirmButtonColor: '#94cb82'
                // })
                Swal.fire({
                    toast: true,
                    icon:'warning',
                    position: 'top-end',
                    background:'#fff3cd',
                    text: res.error,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            
        },
        error:function(){
            $('.reg-code-btn').css('pointer-events','auto')
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
}
function getRegImgCode(){
    $.ajax({
        url:proURL+'/web/getSecurityCode',
        type:'post',
        dataType:'json',
        success:function(res){
            if(res.status == 0){
                $('#img-code-reg').attr('src','data:image/png;base64,'+res.imgage)
                reguuid=res.uuid
            // Swal.fire({
            //     text:$.i18n.prop('code_sent'),
            //     icon:'success',
            //     confirmButtonText: $.i18n.prop('confirm'),
            //     confirmButtonColor: '#94cb82'
            // })
            }else{
                // Swal.fire({
                //     text:res.error,
                //     confirmButtonText: $.i18n.prop('confirm'),
                //     confirmButtonColor: '#94cb82'
                // })
                Swal.fire({
                    toast: true,
                    icon:'warning',
                    position: 'top-end',
                    background:'#fff3cd',
                    text: res.error,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            
        },
        error:function(){
            Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })
}
getLoginImgCode()
function getLoginImgCode(){
    $.ajax({
        url:proURL+'/web/getSecurityCode',
        type:'post',
        dataType:'json',
        success:function(res){
            if(res.status == 0){
                $('#img-code-login').attr('src','data:image/png;base64,'+res.imgage)
                loginuuid=res.uuid
            // Swal.fire({
            //     text:$.i18n.prop('code_sent'),
            //     icon:'success',
            //     confirmButtonText: $.i18n.prop('confirm'),
            //     confirmButtonColor: '#94cb82'
            // })
            }else{
                // Swal.fire({
                //     text:res.error,
                //     confirmButtonText: $.i18n.prop('confirm'),
                //     confirmButtonColor: '#94cb82'
                // })
                Swal.fire({
                    toast: true,
                    icon:'warning',
                    position: 'top-end',
                    background:'#fff3cd',
                    text: res.error,
                    showConfirmButton: false,
                    timer: 3000
                })
            }
            
        },
        error:function(){
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
        $('.reg-code-btn').css('pointer-events','auto')        
        $('.reg-code-btn').html($.i18n.prop('reg_code_btn'))
        c = 60;
    } else {
        $('.reg-code-btn').html(` ${c} s`)
        c--;
        setTimeout(function() {
    	  timer()
        }, 1000)
    }
}

function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
}