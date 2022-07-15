function removeActiveClass(node) {
    node.className = '';
}

let menus = document.querySelectorAll('#nav');
menus.forEach(function (value, index) {
    value.addEventListener('click', function (e) {
        var target = e.target;
        console.log(target.id)
        Array.prototype.forEach.call(document.querySelectorAll('#nav li'), removeActiveClass);
        target.className = 'active';
        if(target.id == 'asr'){
            console.log(1)
            $('.asrapi-box').css('display','block')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else if(target.id == 'tts'){
            console.log(2)
            $('.ttsapi-box').css('display','block')
            $('.asrapi-box').css('display','none')
            $('.newbie-box').css('display','none')
        }else{
            console.log(3)
            $('.asrapi-box').css('display','none')
            $('.ttsapi-box').css('display','none')
            $('.newbie-box').css('display','block')
        }
    })
});