function removeActiveClass(node) {
    node.className = '';
}

let menus = document.querySelectorAll('#nav');
menus.forEach(function (value, index) {
    value.addEventListener('click', function (e) {
        var target = e.target;
        Array.prototype.forEach.call(document.querySelectorAll('#nav li'), removeActiveClass);
        target.className = 'active';
        if(target.id == 'asr'){
            $('.asrapi-box').css('display','block')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else if(target.id == 'tts'){
            $('.ttsapi-box').css('display','block')
            $('.asrapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else{
            $('.asrapi-box').css('display','none')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','block')
        }
    })
});