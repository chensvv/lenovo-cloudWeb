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
    autoplay:4000,
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
    autoplayDisableOnInteraction : false,
});  
