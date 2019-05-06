//function LenovoIdSyncLoginState(lenovoid_wust) {
//      _club_login_status = true;
//      take_st_login = true;
//      jQuery.get('/lasf/logininfo', {
//          'securekey': lenovoid_wust
//      }, function(data) {
//          if (typeof(data) == 'undefined')
//              var data = {
//                  'status': 'error'
//              };
//          if (data.status == 'success') {
//              document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
//              window.localStorage.setItem('secretkey',data.secretkey);
//              window.localStorage.setItem('accountid',data.AccountID);
//              window.localStorage.setItem('lenovoname',data.name);
//              window.localStorage.setItem('Username',data.Username);
//              //window.location.reload();
//          } else if (data.status == 'failed') {
//              window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
//          } else if (data.status == 'error') {
//
//          }
//      }, 'json');
//  }	


function LenovoIdSyncLoginState(lenovoid_wust) {
        _club_login_status = true;
        take_st_login = true;
        $.ajax({
	   	 	type:"get",
	   	 	url:"/lasf/logininfo",
	   	 	headers:{
	   	 		'channel':'cloudasr'
	   	 	},
	   	 	data:"securekey="+lenovoid_wust,
	   	 	dataType:'json',
	   	 	success:function(data){
	   	 		if (typeof(data) == 'undefined')
                var data = {
                    'status': 'error'
                };
	            if (data.status == 'success') {
	                document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
	                window.localStorage.setItem('secretkey',data.secretkey);
	                window.localStorage.setItem('accountid',data.AccountID);
	                window.localStorage.setItem('lenovoname',data.name);
	                window.localStorage.setItem('Username',data.Username);
	                //window.location.reload();
	            } else if (data.status == 'failed') {
	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
	            } else if (data.status == 'error') {
	
	            }
	   	 	}
	   	});
	}
	
	$(window).scroll(function () {
		// 滚动条距离顶部的距离 大于 100px时
		if ($(window).scrollTop() >= 10) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
		} else {
			$(".navbar").css({"background": "transparent"});
		}
	});










