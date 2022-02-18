$('#pub-loading').hide()
$('.pushbtn').click(function(){
    if($('#exampleInput').val() == '' || $('#exampleFormControlTextarea').val() == ''){
        Swal.fire({
            text: i18n.get('enter_t_c'),
            confirmButtonText: i18n.get('confirm'),
            confirmButtonColor: '#94cb82'
        })
    }else{
      if(titleInput()){
        $('#pub-loading').show()
        $('.pushbtn').attr('disabled','disabled')
        $.ajax({
            type:"POST",
            url:proURL+'/forum/add?datatype=0&title='+$('#exampleInput').val()+'&content='+$('#exampleFormControlTextarea').val()+'&accountname='+localStorage.getItem('un'),
            data:{
                t:window.localStorage.getItem('token'),
                lid:$.base64.decode(window.localStorage.getItem('acd'))
            },
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
                            text: i18n.get('post_success'),
                            showCancelButton: false,
                            allowOutsideClick:false,
                            allowEscapeKey:false,
                            reverseButtons:true,
                            icon:'success',
                            width:'16em',
                            confirmButtonColor: '#94cb82',
                            confirmButtonText: i18n.get('confirm'),
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.href = '../forum/questionlist.html'
                            }
                          })
                      }else{
                        Swal.fire({
                            text: i18n.get('post_no'),
                            confirmButtonText: i18n.get('confirm'),
                            confirmButtonColor: '#94cb82'
                        })
                      }
                  }else{
                      localStorage.clear();
                      // Swal.fire({
                      //   text: i18n.get('logTimeOut'),
                      //   showCancelButton: true,
                      //   allowOutsideClick:false,
                      //   allowEscapeKey:false,
                      //   reverseButtons:true,
                      //   width:'16em',
                      //   confirmButtonColor: '#94cb82',
                      //   cancelButtonColor: '#d33',
                      //   confirmButtonText: i18n.get('confirm'),
                      //   cancelButtonText:i18n.get('cancel')
                      // }).then((result) => {
                      //   if (result.isConfirmed) {
                          var url = window.location.href
                          window.localStorage.setItem('returnurl',url)
                          window.location.href = '../login/login.html'
                      //   }
                      // })
                  }
            },error:function(err){
              $('#pub-loading').hide()
              $('.pushbtn').removeAttr('disabled','disabled')
              Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
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
      confirmButtonText: i18n.get('confirm'),
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