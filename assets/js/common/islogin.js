
$.ajax({
    type:"POST",
    url:proURL+"/userinfo",
    headers: {  
      "channel" : "cloudasr"
    },
    data:{"username":localStorage.getItem('un'),"lenovoid":$.base64.decode(localStorage.getItem('acd')),t:localStorage.getItem('token')},
    success:function(data){
      if(data.errorcode ==1024){
        $('.my_fav_list_a').css('pointer-events','none')
        localStorage.removeItem('token')
        Swal.fire({
            text: i18n.get('firstLogin'),
            showCancelButton: false,
            allowOutsideClick:false,
            allowEscapeKey:false,
            reverseButtons:true,
            width:'16em', 
            confirmButtonColor: '#94cb82',
            confirmButtonText: i18n.get('confirm'),
        }).then((result)=>{
            if (result.isConfirmed) {
              var url = window.location.href
              window.localStorage.setItem('returnurl',url)
              window.location.href = '../login/login.html'
            }
        })
      }else{
        $('.my_fav_list_a').css('pointer-events','auto')
      }
    },
    error:function(){
        $('.user').css("display","none")
        $('.login-reg').css("display","block")
    }
  })