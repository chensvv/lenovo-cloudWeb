(function() {
    let width = window.screen.availWidth
    if (width > 1280) width = 1280
    document.documentElement.style.fontSize = width / 6.4 + 'px'
})();