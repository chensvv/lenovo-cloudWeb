$(function(){
	function fn() {
        
    }
	var Username = window.localStorage.getItem('un');
	var accountid = $.base64.decode(window.localStorage.getItem('acd'));
	var token = window.localStorage.getItem('token')
	if(token =='' || token == null || token == undefined){
		if(getCookie('grycan.cn.bLang') =='english'){
			Popup.confirm("Please log in first！", fn)
		}else{
			Popup.confirm("请登录后继续操作！", fn)
		}
	}else{
		$.ajax({
			type:"POST",
			url:urlhead+"/userinfo",
			headers: {  
				"channel" : "cloudasr"
			},  
			data:{"username":Username,"lenovoid":accountid,t:token},
			success:function(data){
				if(data.errorcode ==1024){
					localStorage.clear();
					if(getCookie('grycan.cn.bLang') =='english'){
						Popup.confirm("Login timeout！", fn)
					}else{
						Popup.confirm("登录超时，请重新登录", fn)
					}
					
				}else{
					$("#entry,#entry1,#detail").css("pointer-events","auto");
				}
				
			},error:function(err){
				
			}
		});
	}
	
})

function getCookie(name){
	var strcookie = document.cookie;//获取cookie字符串
	var arrcookie = strcookie.split("; ");//分割
	//遍历匹配
	for ( var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0] == name){
			return arr[1];
		}
	}
	return "";
}









