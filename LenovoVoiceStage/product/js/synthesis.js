/**
 * Created by liuyang on 2017/8/4.
 */
$(function () {

    loadTop("product");

    $('.tts-btn').mouseover(function () {
        $('.tts-btn').css('cursor','pointer');
    });

    $('.tts-btn').mouseout(function () {
        $('.tts-btn').css('cursor','default');
    });

    $('.tts-btn').click(function () {
        var value = $('#tts-content').val();
        tts_btn_click(value);
    });

});

function tts_btn_click(e) {
    alert(e)
}
