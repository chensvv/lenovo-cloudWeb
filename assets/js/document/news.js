function newList(){
    var newsParams = {
      t:$.base64.decode(localStorage.getItem('token')),
        lid:$.base64.decode(localStorage.getItem('acd')),
        username:"",
        lenovoid:"",
        u:"",
        p:"",
        language:"",
        phone:"",
        company:"",
        dept:"",
        opwd:"",
        pwd:"",
        userService:"",
        code:"",
        imgCode:"",
        ucode:"",
        channel:""
    }
    var stringParams = JSON.stringify(newsParams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')

    newsParams.sign = md5(stringParams)
    $.ajax({
      url:proURL+'/news',
      type:'post',
      dataType:"json",
      data:newsParams,
      success:function(res){
        if(res.errorcode != 1024){
          var vhtml = ''
          $.each(res.dataLists.reverse(),function(idx,val){
            vhtml +=`<div class="col-md-4 col-sm-6 d-flex align-items-start justify-content-center card-row">
                  <div class="card">
                    <a href="${val.detailsUrl}">
                      <img src="${val.newsImg}" class="card-img-top">
                    <div class="card-body">
                      <h5 class="card-title">${val.newsTitle}</h5>
                      <p class="card-text"><small class="text-muted">${val.newsDetails}</small></p>
                    </div>
                    </a>
                  </div>
                </div>`
          })
          $('.new-row').append(vhtml)
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
            }
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
  newList()