 function browserRedirect() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    	function myBrowser(){
		    var userAgent = navigator.userAgent.toLowerCase(); //取得浏览器的userAgent字符串
		    if (userAgent.indexOf("firefox") > -1) {
		        return "FF";
		    }
		    if (userAgent.indexOf("fxios") > -1) {
		        return "fxios";
		    } 
		    if (userAgent.indexOf("ucbrowser") > -1) {
		        return "UC";
		    } 
		    if (userAgent.indexOf("baidubrowser") > -1){
			  return "baidu";
			}
		    if (userAgent.indexOf("sogoumobilebrowser") > -1){
			  return "sogo";
			}
		    if (userAgent.indexOf("sogousearch") > -1){
			  return "sogo";
			}
		    if (userAgent.indexOf("opr") > -1){
			  return "opr";
			}
		    if (userAgent.indexOf("Chrome") > -1){
			  return "Chrome";
			}
		    if (userAgent.indexOf("safari") > -1) {
		        return "Safari";
		    }
		    if (userAgent.indexOf("crios") > -1) {
		        return "crios";
		    }
		    
		}
		var mb = myBrowser();
    if (bIsIpad || bIsIphoneOs||bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {	        	        
		 if("FF" == mb){
		 	
		 }else{
		 	$("#timetext").css("display","none");
		 	$(".realtime-btn").css("display","none")
		 	$(".realtime-btn1").css("display","block")
		 	$("#status").html("此浏览器不能获得麦克风的权限");
		 }
    } else {
        if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
	        $("#timetext").css("display","none");
		 	$(".realtime-btn").css("display","none")
		 	$(".realtime-btn1").css("display","block")
		 	$("#status").html("此浏览器不能获得麦克风的权限");
	    }
    }
}
browserRedirect();