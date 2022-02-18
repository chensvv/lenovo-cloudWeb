if(localStorage.getItem('token') == '' || localStorage.getItem('token') == null){
    var url = window.location.href
    window.localStorage.setItem('returnurl',url)
    window.location.href = '../login/login.html'
}