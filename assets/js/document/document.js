function removeActiveClass(node) {
    node.className = '';
}

let menus = document.querySelectorAll('#nav');
menus.forEach(function (value, index) {
    value.addEventListener('click', function (e) {
        var target = e.target;
        Array.prototype.forEach.call(document.querySelectorAll('#nav li'), removeActiveClass);
        target.className = 'active';
        if(target.id == 'asr'){
            $('.asrapi-box').css('display','block')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else if(target.id == 'tts'){
            $('.ttsapi-box').css('display','block')
            $('.asrapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else{
            $('.asrapi-box').css('display','none')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','block')
        }
    })
});

// userInfo()
      function userInfo(){
        var params = {
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
            }
            var stringParams = JSON.stringify(params,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
            params.sign = md5(stringParams)
        $.ajax({
            type:"POST",
            url:proURL+"/userinfo",
            headers: {  
            "channel" : "cloudasr"
            },
            data:params,
            success:function(data){
                if(data.errorcode ==1024){
                    localStorage.clear()
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
            },
            error:function(){
                $('.user').css("display","none")
                $('.login-reg').css("display","block")
            }
        })
      }