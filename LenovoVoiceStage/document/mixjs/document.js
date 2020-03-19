$(function(){
	loadTop("product");
	var Username = window.localStorage.getItem('un');
	var accountid = $.base64.decode(window.localStorage.getItem('acd'));
	var token = window.localStorage.getItem('token')
	$('.uright').html(Username);
	$.ajax({
		type:"POST",
		url:urlhead+"/lasf/userinfo",
		headers: {  
			"channel" : "cloudasr"
		},  
		data:{"username":Username,"lenovoid":accountid,t:token},
		success:function(data){		
			if(data.errorcode !=1024){
				
			}else{
				if(confirm("登录超时，请重新登录")){
					window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
					localStorage.clear(); 
					return;
				}else{
					localStorage.clear(); 
					return;
				}
			}
		},error:function(err){
			alert('服务器错误')
		}
		
	});
})










