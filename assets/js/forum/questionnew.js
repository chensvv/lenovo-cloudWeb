$('#pub-loading').hide()
$('.pushbtn').click(function(){
    if($('#exampleInput').val() == '' || $('#exampleFormControlTextarea').val() == ''){
        Swal.fire({
            text: $.i18n.prop('enter_t_c'),
            confirmButtonText: $.i18n.prop('confirm'),
            confirmButtonColor: '#94cb82'
        })
    }else if($('#exampleFormControlTextarea').val().length < 6 ){
      Swal.fire({
          text: $.i18n.prop('contentLength'),
          confirmButtonText: $.i18n.prop('confirm'),
          confirmButtonColor: '#94cb82'
      })
    }else{
      if(titleInput()){
        $('#pub-loading').show()
        $('.pushbtn').attr('disabled','disabled')
        var addParams = {
          t:$.base64.decode(window.localStorage.getItem('token')),
          lid:$.base64.decode(window.localStorage.getItem('acd')),
          language:"",
          title:$('#exampleInput').val(),
          content:$('#exampleFormControlTextarea').val(),
          accountname:$.base64.decode(localStorage.getItem('un')),
          articleid:"",
          parentid:"",
          datatype:0,
          pagenum:"",
          pagecount:"",
          dataid:""
        }
        var stringParams = JSON.stringify(addParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        console.log(stringParams)
        addParams.sign = md5(stringParams)
        $.ajax({
            type:"POST",
            url:proURL+'/forum/add',
            data:addParams,
            dataType:"json",
            headers: {
                  "channel" : "cloudasr"
            },
            success:function(res){
              $('#pub-loading').hide()
              $('.pushbtn').removeAttr('disabled','disabled')
                  if(res.errorcode != 1024){
                      $("#exampleInput").val("");
                      $("#exampleFormControlTextarea").val("");
                      if(res.dataid){
                        Swal.fire({
                            text: $.i18n.prop('post_success'),
                            showCancelButton: false,
                            allowOutsideClick:false,
                            allowEscapeKey:false,
                            reverseButtons:true,
                            icon:'success',
                            width:'16em',
                            confirmButtonColor: '#94cb82',
                            confirmButtonText: $.i18n.prop('confirm'),
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.href = '../forum/questionlist.html'
                            }
                          })
                      }else{
                        Swal.fire({
                            text: $.i18n.prop('post_no'),
                            confirmButtonText: $.i18n.prop('confirm'),
                            confirmButtonColor: '#94cb82'
                        })
                      }
                  }else{
                    window.localStorage.clear();
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
                      }).then((result) => {
                        if (result.isConfirmed) {
                          var url = window.location.href
                          window.localStorage.setItem('returnurl',url)
                          window.location.href = '../login/login.html'
                        }
                      })
                  }
            },error:function(err){
              $('#pub-loading').hide()
              $('.pushbtn').removeAttr('disabled','disabled')
              Swal.fire({
                text:$.i18n.prop('server_error'),
                confirmButtonText: $.i18n.prop('confirm'),
                confirmButtonColor: '#94cb82'
              })
            }
        })
      }
    }
})

function titleInput(){
  var reg = new RegExp("[`~@#$^()|{}\\[\\]<>@#￥（）——|{}【】]")
  if(reg.test($('#exampleInput').val())){
    Swal.fire({
      text: '标题禁止输入特殊字符',
      confirmButtonText: $.i18n.prop('confirm'),
      confirmButtonColor: '#94cb82'
    })
    return false
  }else{
    return true
  }
}
function setShowLength(obj, maxlength, id) {
	var rem = maxlength - obj.value.length; 
	if (rem < 0){ 
		rem = 0; 
  } 
  if(rem<10){
    $('.hint-label').css('display','block')
  }else{
    $('.hint-label').css('display','none')
  }
	$('#words').html(rem) 
}