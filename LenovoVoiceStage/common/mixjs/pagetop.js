/**
 * Created by liuyang on 2017/8/21.
 */
var session = window.sessionStorage;


function menu_first_page(){
    window.location.href = "../welcome/index.html";
}

function menu_voice_recognise(){
    window.location.href = "../product/recognise.html";
}

function menu_voice_longrecognise(){
    window.location.href = "../product/long_recognise.html";
}

function menu_voice_synthesis(){
    window.location.href = "../product/synthesis.html";
}

function menu_sdk_download(){
    window.location.href = "../sdk/sdklist.html";
}

function menu_product_document(){
    window.location.href = "../document/userDocument.html";
}

function menu_developer_question(){
    window.location.href = "../forum/questionlist.html";
}

function menu_application_manager(){
    window.location.href = "../application/applist.html";
}

function menu_user_register(){
    window.location.href = "../user/userRegister.html";
}

function user_info(){
 window.location.href = "../product/userinfo.html";
}
function user_logout(){
    window.localStorage.clear();
    window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogout&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
}

function menu_forum_list(){
	window.location.href = "../forum/questionlist.html";
}
function menu_new_data(){
	window.location.href = "../new/newlist.html";
}

function is_not_login() {

    session.setItem('refer', window.location.pathname);

    if(typeof session.user_email == 'undefined'){
        window.location.href="../login/login.html";
        return true;
    }
    return false;
}
function open_nav(){
    $('#navbar').css({"display":"block"})
    $('#navbar').removeClass("fadeOutRight")
    $('#navbar').addClass("fadeInRight")
    document.getElementById('navbar').addEventListener('touchmove', function (event) { 
        event.preventDefault(); 
 })
}
function close_mobile_nav(){
    $('#navbar').removeClass("fadeInRight")
    $('#navbar').addClass("fadeOutRight")
    setTimeout(function(){
        $('#navbar').css({"display":"none"})
    },200)
    
    
}
function loadTop(data) {
    console.log(data)
    var params = "";
    var secretkey = window.localStorage.getItem('secretkey');
    var accountid = window.localStorage.getItem('accountid');
    var lenovoname = window.localStorage.getItem('lenovoname');
    var Username = window.localStorage.getItem('Username');
    
	params +="			<div class=\'container\'>";
	params +="				<div class=\'navbar-header\'>";
	params +="					<button type=\'button\' onclick=\'open_nav()\' class=\'navbar-toggle collapsed\'>";
	params +="							    <span class=\'sr-only\'>Toggle navigation</span>";
	params +="							    <span class=\'icon-bar\'></span>";
	params +="							    <span class=\'icon-bar\'></span>";
	params +="							    <span class=\'icon-bar\'></span>";
	params +="							</button>";
	params +="					<div class=\'navbar-icon\'>";
    params +="						<img src=\'../common/images/logo_img.png\' alt=\'\'><img src=\'../common/images/logo_text.png\' class=\'logo_text\'>";
    params +="					</div>";
    
    params += "                <ul class=\'nav navbar-nav navbar-right mobile_nav_right\' id=\'right_mobile\'>";
    params += "                    <li id=\'login1\'>";
    if (Username=="" || Username==null||Username.length == 0) {
        
        params += "                        <a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\' target=\'_self\' id='lenovo-user-name'>登录</a>";
    } else {
        
        params += "                        <a href=\'#\' target=\'_self\'  data-toggle=\'dropdown\' class='mobile_top_username' id='lenovo-user-name'>"+ Username +"<div class=\'open_user\'></div></a>";
        params += "                        <ul class=\'dropdown-menu open_style\'>";
        params += "                            <li><a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=myaccount&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN\' target='_blank'>联想账号信息</a></li>";
        params += "                            <li><a href=\'#\' onclick=\'user_info()\'>开发者信息</a></li>";
        params += "                            <li><a href=\'#\' onclick=\'user_logout()\'>退出</a></li>";
        params += "                        </ul>";
    }
    params += "                    </li>";
    params += "                </ul>";

	params +="				</div>";
    params +="				<div id=\'navbar\' class=\'collapse navbar-collapse animated\'>";
    params +="              <div class=\'is_mobile_close\'>";
    params +="                  <span onclick=\'close_mobile_nav()\' class=\'close_btn\'></span>";
    params +="              </div>";
	params +="					<ul class=\'nav navbar-nav nav-left\'>";
    if(data == "index"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                    <li>";
    }
    params +="							<a href=\'#\' onclick=\'menu_first_page()\' target=\'_self\'>首页 <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    if(data == "product"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                    <li>";
    }
    params +="							<a href=\'#\' target=\'_self\' data-toggle=\'dropdown\'>产品服务<span class=\'caret\'></span></a>";
	params +="							<ul class=\'dropdown-menu\'>";
	params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_recognise()\'  id=\'second\'>短语音识别</a></li>";
	params +="								<li><a href=\'#\' onclick=\'menu_voice_longrecognise()\'  id=\'\'>长语音识别 <span style=\'color:red\'>(Beta)</span></a></li>";
    params += "                        </ul>";
    params += "                    </li>";

    if(data == "document"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_product_document()\' id=\'third\' target=\'_self\' >开发资源 <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    if(data == "newdata"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_new_data()\' id=\'\' target=\'_self\' >新闻资讯 <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    if(data == "information"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_forum_list()\' id=\'\' target=\'_self\' >给我留言 <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    params += "                </ul>";
    params += "                <ul class=\'nav navbar-nav navbar-right\'>";

    params += "                    <li id=\'login1\' class=\'mobile_style\'>";


    if (Username=="" || Username==null||Username.length == 0) {
        params += "                        <a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\' target=\'_self\' id='lenovo-user-name'>登录</a>";
        params += "                        <span class=\'shu\'>|</span>";
        params += "                        <a href=\'https://passport.lenovo.com/wauthen2/wauth/jsp/register.jsp?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.ctx=aHR0cHM6XC9cL3ZvaWNlLmxlbm92b21tLmNvbVwvdm9pY2VQbGF0Zm9ybVwvd2VsY29tZVwvaW5kZXguaHRtbA&lenovoid.lang=zh_CN&lenovoid.uinfo=null&lenovoid.cb=https://voice.lenovomm.com/voicePlatform/welcome/index.html&lenovoid.vb=null&lenovoid.display=null&lenovoid.idp=null&lenovoid.source=voice.lenovomm.com&oldState=null?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.ctx=aHR0cHM6XC9cL3ZvaWNlLmxlbm92b21tLmNvbVwvdm9pY2VQbGF0Zm9ybVwvd2VsY29tZVwvaW5kZXguaHRtbA&lenovoid.lang=zh_CN&lenovoid.uinfo=null&lenovoid.cb=https://voice.lenovomm.com/voicePlatform/welcome/index.html&lenovoid.vp=null&lenovoid.display=null&lenovoid_idp=null&lenovoid.source=voice.lenovomm.com&lenovoid.thirdname=null&lenovoid.qrstate=null&lenovoid.idreinfo=null&lenovoid.hidewechat=1&lenovoid.hideqrlogin=1&lenovoid.hideautologin=1&lenovoid.hidelanguage=1&lenovoid.realmImg=null&lenovoid.loginTxt=null&lenovoid.mainColor=null&lenovoid.hideqq=1&lenovoid.hideloginreg=1&lenovoid.hidesina=1&lenovoid.hideregmobile=1&lenovoid.hideregemail=1&lenovoid.hidesmslogin=1&lenovoid.webstate=0&lenovoid.userType=null&lenovoid.uAgreementTxt=null&lenovoid.uAgreementUrl=null&lenovoid.sdk=null&lenovoid.sn=null' target=\'_self\' id='lenovo-user-register'>注册</a>";
    } else {
        params += "                        <a href=\'#\' target=\'_self\'  data-toggle=\'dropdown\' class='lenovo-user-name2' id='lenovo-user-name'>"+ Username +"<span class=\'caret\'></span></a>";
        params += "                        <ul class=\'dropdown-menu\'>";
        params += "                            <li class='mobile_border'><a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=myaccount&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN\' target='_blank'>联想账号信息</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'user_info()\'>开发者信息</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'user_logout()\'>退出</a></li>";
        params += "                        </ul>";
    }
    params += "                    </li>";
    params += "                </ul>";
    params += "            </div>";
    params += "        </div>";

  $('.navbar').html(params);

  $('#eui-main-footer').html("联想语音&nbsp;&nbsp;&nbsp;©&nbsp;&nbsp;版权所有&nbsp;&nbsp;1998－2015&nbsp;&nbsp;联想集团有限公司人工智能实验室&nbsp;&nbsp;京ICP备05000462");
if(Username=="" || Username==null||Username.length == 0){
    $('.mobile_style').removeClass('mobile_bottom_border')
}else{
    $('.mobile_style').addClass('mobile_bottom_border')
}
  if(navigator.userAgent.indexOf("MSIE")>0){
    $('.nav-left li').css({"padding-left":"100px"})
}
}
