$(function(){
	loadTop("product");
	var Username = window.localStorage.getItem('un');
	var accountid = $.base64.decode(window.localStorage.getItem('acd'));
	var token = window.localStorage.getItem('token')
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
					window.location.href = "../login/login.html";
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










