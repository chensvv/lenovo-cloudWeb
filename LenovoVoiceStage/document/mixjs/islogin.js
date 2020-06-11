$(function(){
	var Username = window.localStorage.getItem('un');
	var accountid = $.base64.decode(window.localStorage.getItem('acd'));
	var token = window.localStorage.getItem('token')
	function fn(){}
	if(token == '' || token == null || token == undefined){
		$('body').css('overflow','hidden')
		$("#click1,#click2,#click3,#click4").css("pointer-events","none");
		if(getCookie('grycan.cn.bLang') =='english'){
			Popup.alert("Please log in first！")
		}else{
			Popup.alert("请登录后继续操作！")
		}
	}else{
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
					if(getCookie('grycan.cn.bLang') =='english'){
						Popup.alert("Login timeout！")
					}else{
						Popup.alert("登录超时，请重新登录！")
					}
				}else{
					$("#click1,#click12,#click3,#click4").css("pointer-events","auto");
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








