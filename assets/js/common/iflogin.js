if($.base64.decode(window.localStorage.getItem('token')) == '' || $.base64.decode(window.localStorage.getItem('token')) == null){
    var url = window.location.href
    window.localStorage.setItem('returnurl',url)
    window.location.href = '../login/login.html'
}