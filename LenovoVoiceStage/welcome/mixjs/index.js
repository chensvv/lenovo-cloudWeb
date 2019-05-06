$(function () {

	var i = 0;
	var timer;
	timer = setInterval(play, 4000);

	//第一张显示
	$(".pic li").eq(0).show();
	$("#position li").click(function () {
		$(this).addClass('active').siblings().removeClass("active");
		var index = $(this).index();
		i = index;
		if (i == 1) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
			$(".navbar").addClass('flex_css')
		} else {
			$(".navbar").removeClass('flex_css')
			$(".navbar").css({"background": "transparent"});
		}
		if ($(window).scrollTop() >= 100) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
		}
		// $(".pic li").eq(index).show().siblings().hide();
		$(".pic li").eq(index).fadeIn(800).siblings().fadeOut(0);
	});
	//自动轮播

	function play() {
		i++;
		i = i > 3 ? 0 : i;
		var scrollTop = $(window).scrollTop()
		if (i == 1) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
			$(".navbar").addClass('flex_css')
		} else {
			$(".navbar").removeClass('flex_css')
			$(".navbar").css({"background": "transparent"});
		}
		if (scrollTop >= 100) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
		}
		// $("#position li").eq(i).addClass('active').siblings().removeClass("active");
		// $(".pic li").eq(i).show().siblings().hide();
		// $(".pic li").eq(i).stop(true, true).fadeIn(800).siblings().stop(true, true).fadeOut(0);
	}
	//鼠标移入移出效果
	// $("#container").hover(function() {
	// 	clearInterval(timer);
	// }, function() {
	// 	timer = setInterval(play, 4000);
	// });
	$(window).scroll(function () {
		// 滚动条距离顶部的距离 大于 100px时
		if ($(window).scrollTop() >= 100) {
			$(".navbar").css({"background": "rgba(0,0,0,.3)"})
		} else {
			$(".navbar").css({"background": "transparent"});
		}
	});

})


function LenovoIdSyncLoginState(lenovoid_wust) {
	_club_login_status = true;
	take_st_login = true;
	jQuery.get('/lasf/logininfo', {
		'securekey': lenovoid_wust
	}, function(data) {
		if(typeof(data) == 'undefined')
			var data = {
				'status': 'error'
			};
		if(data.status == 'success') {
			document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
			window.localStorage.setItem('secretkey', data.secretkey);
			window.localStorage.setItem('accountid', data.AccountID);
			window.localStorage.setItem('lenovoname', data.name);
			window.localStorage.setItem('Username', data.Username);
			//window.location.reload();
		} else if(data.status == 'failed') {
			//window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN';
		} else if(data.status == 'error') {}
	}, 'json');
}