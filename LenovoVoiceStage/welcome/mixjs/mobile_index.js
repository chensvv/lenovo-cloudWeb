var scrollTop = $(window).scrollTop()
var swiper = new Swiper('.swiper-container', {
    onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素 
        swiperAnimate(swiper); //初始化完成开始动画
    },
    onSlideChangeStart: function (swiper) {
        swiperAnimate(swiper); //每个slide切换前时也运行当前slide动画
        var swiper_index = swiper.activeIndex
        
        if ($(window).scrollTop() >= 10) {
            if(swiper_index == 1 || swiper_index == 5 || swiper_index == 2){
                $(".navbar").css({"background": "rgba(1,117,117,.3)"})
            }else{
                $(".navbar").css({"background": "rgba(0,0,0,.3)"})
            }
        }else{
            if(swiper_index == 1 || swiper_index == 5 || swiper_index == 2){
                $(".navbar").css({"background": "rgba(1,117,117,.3)"})
            }else {
                $(".navbar").css({"background": "transparent"})
            }
        }
        $(window).scroll(function () {
            // 滚动条距离顶部的距离 大于 100px时
            // console.log(swiper_index)
                    if ($(window).scrollTop() >= 10) {
                        if(swiper_index == 1 || swiper_index == 5 || swiper_index == 2){
                            $(".navbar").css({"background": "rgba(1,117,117,.3)"})
                        }else {
                            $(".navbar").css({"background": "rgba(0,0,0,.3)"})
                        }
                    }else{
                        if(swiper_index == 1 || swiper_index == 5 || swiper_index == 2){
                            $(".navbar").css({"background": "rgba(1,117,117,.3)"})
                        }else {
                            $(".navbar").css({"background": "transparent"})
                        }
                    }
        });

    },
    // autoplay:4000,
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
    autoplayDisableOnInteraction : false,
});  

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