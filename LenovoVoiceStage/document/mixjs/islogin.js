$(function(){
	loadTop("product");
	function fn() {
        
    }
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
			if(data.errorcode ==1024){
				$('body').css('overflow','hidden')
				$("#click1,#click2,#click3,#click4").css("pointer-events","none");
				localStorage.clear();
				Popup.alert("登录超时，请重新登录！")
			}else{
				$("#click1,#click12,#click3,#click4").css("pointer-events","auto");
			}
			// if(token == null){
			// 	localStorage.clear();
			// 	if(confirm("请先登录")){
			// 		window.location.href = "../login/login.html";
			// 		localStorage.clear(); 
			// 		return;
			// 	}else{
			// 		localStorage.clear(); 
			// 		return;
			// 	}
			// }else{
			// 	if(data.errorcode !=1024){
				
			// 	}else{
			// 		if(confirm("登录超时，请重新登录")){
			// 			window.location.href = "../login/login.html";
			// 			localStorage.clear(); 
			// 			return;
			// 		}else{
			// 			localStorage.clear(); 
			// 			return;
			// 		}
			// 	}
			// }
			
		},error:function(err){
			alert('服务器错误')
		}
		
	});
})










