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
        $('.my_fav_list_a').css('pointer-events','none')
        window.localStorage.clear()
        // Swal.fire({
        //     text: i18n.get('firstLogin'),
        //     showCancelButton: false,
        //     allowOutsideClick:false,
        //     allowEscapeKey:false,
        //     reverseButtons:true,
        //     width:'16em', 
        //     confirmButtonColor: '#94cb82',
        //     confirmButtonText: i18n.get('confirm'),
        // }).then((result)=>{
        //     if (result.isConfirmed) {
              var url = window.location.href
              window.localStorage.setItem('returnurl',url)
              window.location.href = '../login/login.html'
        //     }
        // })
      }else{
        $('.my_fav_list_a').css('pointer-events','auto')
      }
    },
    error:function(){
        $('.user').css("display","none")
        $('.login-reg').css("display","block")
    }
  })