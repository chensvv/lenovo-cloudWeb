$(function () {
    $(window).scroll(function () {
    // 滚动条距离顶部的距离 大于 100px时
    if ($(window).scrollTop() >= 10) {
        $(".navbar").css({"background": "rgba(0,0,0,.3)"})
    } else {
        $(".navbar").css({"background": "transparent"});
    }
})
})