$(function() {

	var i = 0;
	var timer;
	timer = setInterval(play, 4000);

	//第一张显示
	$(".pic li").eq(0).show();
	$("#position li").click(function() {
		$(this).addClass('active').siblings().removeClass("active");
		var index = $(this).index();
		i = index;
		// $(".pic li").eq(index).show().siblings().hide();
		$(".pic li").eq(index).fadeIn(800).siblings().fadeOut(800);
	});
	//自动轮播

	function play() {
		i++;
		i = i > 1 ? 0 : i;
		$("#position li").eq(i).addClass('active').siblings().removeClass("active");
//		$(".pic li").eq(i).fadeIn(800).siblings().fadeOut(800);
		$(".pic li").eq(i).stop(true,true).fadeIn(800).siblings().stop(true,true).fadeOut(800);
	}
	//鼠标移入移出效果
	$("#container").hover(function() {
		clearInterval(timer);
	}, function() {
		timer = setInterval(play, 4000);
	});

})



function LenovoIdSyncLoginState(lenovoid_wust) {
        _club_login_status = true;
        take_st_login = true;
        $.ajax({
	   	 	type:"get",
	   	 	url:urlhead+"/lasf/logininfo",
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
//	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html';
	           	    window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
	            } else if (data.status == 'error') {
	
	            }
	   	 	}
	   	});
    }



		
