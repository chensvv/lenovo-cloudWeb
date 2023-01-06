var visitparams = {
    u:localStorage.getItem('acd') == '' || localStorage.getItem('acd') == undefined || localStorage.getItem('acd') == null ? $.base64.encode('-1'): localStorage.getItem('acd'),
    p:$('.ident').html(),
    t:Date.parse(new Date()) / 1000
  }
  var vParams = JSON.stringify(visitparams,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
  visitparams.sign = md5(vParams)
visitIdent()
function visitIdent(){
  $.ajax({
    type:"post",
    url:proURL+'/visit/record',
    data:visitparams,
    // contentType: "application/x-www-form-urlencoded",
    success:function(res){
      // console.log(res)
    }
  })
}