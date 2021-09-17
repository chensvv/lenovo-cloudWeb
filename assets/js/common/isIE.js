function IEVersion() {
    var userAgent = navigator.userAgent;
    // alert(userAgent)
    var isIE = userAgent.indexOf("Trident") > -1 
    var isEdge =  userAgent.indexOf("Edge") > -1
    var chromeVer = userAgent.substr(userAgent.lastIndexOf("e/")+2).substring(0,2)
    // console.log(chromeVer)
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
    }else if(chromeVer < 86){
        var body = document.getElementsByTagName('body')[0]
        var div = document.createElement("div")
        div.setAttribute("class", "p-d")
        var childDiv = document.createElement("div")
        childDiv.setAttribute("class", "p-d-d")
        childDiv.innerHTML = "当前浏览器版本较低，为了您的浏览体验，请使用Chrome、火狐等浏览器打开！";
        div.appendChild(childDiv)
        body.appendChild(div)
        body.style.overflow = 'hidden'
    }else{
        
    }
}
IEVersion()