IEVersion()
function IEVersion() {
    var userAgent = navigator.userAgent.toLowerCase();
    alert(userAgent)
    var isIE = userAgent.indexOf("trident") > -1 
    var isEdge =  userAgent.indexOf("edge") > -1
    // var chromeVer = userAgent.substr(userAgent.lastIndexOf("e/")+2).substring(0,2)
    var isQQ = RegExp(/qqbrowser/).exec(userAgent)
    var isSouGou = RegExp(/sogoumobilebrowser/).exec(userAgent)
    if(isMobile()){
        if(isSouGou){
            addHtml()
        }
    }else{
        if(isIE){
            var body = document.getElementsByTagName('body')[0]
            var div = document.createElement("div")
            div.setAttribute("class", "p-d")
            var childDiv = document.createElement("div")
            childDiv.setAttribute("class", "p-d-d")
            childDiv.innerHTML = "为了您的浏览和功能体验，请使用Chrome、火狐等浏览器打开！";
            div.appendChild(childDiv)
            body.appendChild(div)
            body.style.overflow = 'hidden'
        }else if(isEdge){
            var body = document.getElementsByTagName('body')[0]
            var div = document.createElement("div")
            div.setAttribute("class", "p-d")
            var childDiv = document.createElement("div")
            childDiv.setAttribute("class", "p-d-d")
            childDiv.innerHTML = "当前Edge浏览器版本较低，为了您的浏览体验，请使用新版Edge浏览器或Chrome、火狐等浏览器打开！";
            div.appendChild(childDiv)
            body.appendChild(div)
            body.style.overflow = 'hidden'
        }else if(isQQ){
            addHtml()
        }else{
            
        }
    }
    
}
function isMobile() {
    return (/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i.test(navigator.userAgent))
}
function addHtml(){
    var body = document.getElementsByTagName('body')[0]
    var div = document.createElement("div")
    div.setAttribute("class", "p-d")
    var childDiv = document.createElement("div")
    childDiv.setAttribute("class", "p-d-d")
    childDiv.innerHTML = "当前浏览器版本较低，为了您的浏览体验，请使用Chrome、火狐等浏览器打开！";
    div.appendChild(childDiv)
    body.appendChild(div)
    body.style.overflow = 'hidden'
}
