var scrollTop = $(window).scrollTop()
var swiper = new Swiper('.swiper-container', {
    onInit: function (swiper) { //Swiper2.x的初始化是onFirstInit
        swiperAnimateCache(swiper); //隐藏动画元素 
        swiperAnimate(swiper); //初始化完成开始动画
    },
    onSlideChangeStart: function (swiper) {
        swiperAnimate(swiper); //每个slide切换前时也运行当前slide动画
        // swiper_index = swiper.activeIndex
        if($(window).scrollTop() >=100){
            if (swiper.activeIndex == 2) {
                $(".navbar").css({"background": "rgba(0,0,0,.3)"})
                $(".navbar").addClass('flex_css')
            } else {
                $(".navbar").removeClass('flex_css')
                $(".navbar").css({"background": "rgba(0,0,0,.3)"});
            }
        }else{
            if(swiper.activeIndex == 2){
                $(".navbar").css({"background": "rgba(0,0,0,.3)"})
            }else{
                $(".navbar").css({"background": "transparent"});
            }
        }
        $(window).scroll(function () {
            // 滚动条距离顶部的距离 大于 100px时
            if ($(window).scrollTop() >= 100) {
                if (swiper.activeIndex == 2) {
                    $(".navbar").css({"background": "rgba(0,0,0,.3)"})
                    $(".navbar").addClass('flex_css')
                } else {
                    $(".navbar").removeClass('flex_css')
                    $(".navbar").css({"background": "rgba(0,0,0,.3)"});
                }
            } else {
                if(swiper.activeIndex == 2){
                    $(".navbar").css({"background": "rgba(0,0,0,.3)"})
                }else{
                    $(".navbar").css({"background": "transparent"});
                }
            }
        });
        
    },
    autoplay:4000,
    effect: 'fade',
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    loop: true,
    autoplayDisableOnInteraction : false,

});

