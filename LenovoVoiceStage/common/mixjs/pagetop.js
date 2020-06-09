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

function menu_voice_tts(){
    window.location.href = "../product/tts.html";
}

function menu_voice_assess(){
    window.location.href = "../product/assess.html";
}

function menu_voice_eng(){
    window.location.href = "../product/engaudio.html";
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
function set_pwd(){
    window.location.href = "../login/setpwd.html";
}

function user_logout(){
    window.localStorage.clear();
    location.reload()

}
function user_login(){
    var url = window.location.href
    window.localStorage.setItem('returnurl',url)
    window.location.href = "../login/login.html";
}
function user_reg(){
    var url = window.location.href
    window.localStorage.setItem('returnurl',url)
    window.location.href = "../login/login.html?status=reg";
}
function menu_forum_list(){
	window.location.href = "../forum/questionlist.html";
}
function menu_new_data(){
	window.location.href = "../new/newlist.html";
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
    var params = "";
    var Username = window.localStorage.getItem('un');
	params +="			<div class=\'container\'>";
	params +="				<div class=\'navbar-header\'>";
	params +="					<button type=\'button\' onclick=\'open_nav()\' class=\'navbar-toggle collapsed\'>";
    params +="			            <span class=\'sr-only\'>Toggle navigation</span>";
    params +="						<span class=\'icon-bar\'></span>";
    params +="						<span class=\'icon-bar\'></span>";
    params +="						<span class=\'icon-bar\'></span>";
    params +="					</button>";
	params +="					<div class=\'navbar-icon\'>";
    params +="						<img src=\'../common/images/logo_img.png\' alt=\'\'><span class='logo_text_left' i18n='i18n.writ'>联想语音</span>";
    params +="					</div>";
    params += "                <ul class=\'nav navbar-nav navbar-right mobile_nav_right\' id=\'right_mobile\'>";
    params += "                    <li id=\'login1\'>";
    if (Username=="" || Username==null||Username.length == 0) {
        params += "                    <a onclick=\'user_login()\' target=\'_self\' id='lenovo-user-name_m' i18n='i18n.signIn'>登录</a>";
    } else {
        params += "                    <a href=\'#\' target=\'_self\' class='mobile_top_username'><span class='user_name mo'>"+ Username +"</span><span class=\'open_user\'></span></a>";
        params += "                        <ul class=\' open_style\' style=\'display:none\'>";
        params += "                            <li><a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=myaccount&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN\' target='_blank' i18n='i18n.accountInfo'>联想账号信息</a></li>";
        params += "                            <li><a href=\'#\' onclick=\'user_info()\' i18n='i18n.devInfo'>开发者信息</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'set_pwd()\' i18n='i18n.changePass'>修改密码</a></li>";
        params += "                            <li><a href=\'#\' onclick=\'user_logout()\' i18n='i18n.signOut'>退出</a></li>";
        params += "                        </ul>";
    }
    params += "                    </li>";
    params += "                </ul>";
	params +="				</div>";
    params +="				<div id=\'navbar\' class=\'collapse navbar-collapse animated\'>";
    params +="              <div class=\'is_mobile_close\'>";
    params +="                  <span onclick=\'close_mobile_nav()\' class=\'close_btn\'></span>";
    params +="              </div>";
	params +="					<ul class=\'nav navbar-nav nav-left hover-menu\'>";
    if(data == "index"){
        params += "                <li class=\'active\'>";
    }else{
        params += "                    <li>";
    }
    params +="							    <a href=\'#\' onclick=\'menu_first_page()\' target=\'_self\'><span i18n='i18n.homepage'>首页</span><span class=\'mobile_jt\'></span></a>";
    params += "                        </li>";
    if(data == "product"){
        params += "                    <li class=\'active\'>";
    }else{
        params += "                <li>";
    }
    params +="							<a href=\'#\' target=\'_self\' id=\'pro-control\' class=\'product\'><span i18n='i18n.product'>产品服务</span><span class=\'caret\'></span></a>";
	params +="							<ul class=\'product-menu\' id=\'pro-ul\'>";
	params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_recognise()\'  id=\'second\' i18n='i18n.shortSpeech'>短语音识别</a></li>";
    params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_longrecognise()\'  id=\'\' i18n='i18n.realtime'>长语音识别</a></li>";
    // params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_eng()\'  id=\'\'>英语短语音识别 </a></li>";
    params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_tts()\'  id=\'\' i18n='i18n.synthesis'>语音合成 </a></li>";
    params +="								<li class=\'mobile_border\'><a href=\'#\' onclick=\'menu_voice_assess()\'  id=\'\' i18n='i18n.assess'>英语评测 </a></li>";

    params += "                        </ul>";
    params += "                    </li>";

    if(data == "document"){
        params += "                <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_product_document()\' id=\'third\' target=\'_self\' ><span i18n='i18n.document'>开发资源</span> <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    if(data == "newdata"){
        params += "                <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_new_data()\' id=\'\' target=\'_self\' ><span i18n='i18n.infor'>新闻资讯</span> <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    if(data == "information"){
        params += "                <li class=\'active\'>";
    }else{
        params += "                    <li class=\'\'>";
    }
    params += "                        <a href=\'#\' onclick=\'menu_forum_list()\' id=\'\' target=\'_self\' ><span i18n='i18n.message'>给我留言</span> <span class=\'mobile_jt\'></span></a>";
    params += "                    </li>";
    params += "                </ul>";
    params += "                <ul class=\'nav navbar-nav navbar-right hover-menu\'>";
    params += "                    <li id=\'login1\' class=\'mobile_style\'>";
    if (Username=="" || Username==null||Username.length == 0) {
        params += "                        <a onclick=\'user_login()\' target=\'_self\' id='lenovo-user-name_m' i18n='i18n.signIn'>登录</a>";
        params += "                        <span class=\'shu\'>|</span>";
        params += "                        <a onclick=\'user_reg()\' target=\'_self\' id='lenovo-user-register' i18n='i18n.signUp'>注册</a>";
    } else {
        params += "                        <a href=\'#\' target=\'_self\' class='lenovo-user-name2' id='lenovo-user-name'><span class='user_name ua'>"+ Username +"</span><span class=\'caret\'></span></a>";
        params += "                        <ul class=\'user-menu\' id=\'user-ul\'>";
        params += "                            <li class='mobile_border'><a href=\'https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=myaccount&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN\' target='_blank' i18n='i18n.accountInfo'>联想账号信息</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'user_info()\' i18n='i18n.devInfo'>开发者信息</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'set_pwd()\' i18n='i18n.changePass'>修改密码</a></li>";
        params += "                            <li class='mobile_border2'><a href=\'#\' onclick=\'user_logout()\' i18n='i18n.signOut'>退出</a></li>";
        params += "                        </ul>";
    }
    params += "                    </li>";
    params += "                </ul>";
    params +="              <div class='drop-down'>";
    params +="                <div id='box'>";
    params +="                    <div id='b-m' class='b-m'>";
    params +="                        <img src='../common/images/china.png' class='opimg' id='op-img'>";
    params +="                        <span class='optxt' id='op-txt'>简体中文</span>"
    params +="                    </div>"
    params +="                    <div class='tri-down'></div>"
    params +="                </div>"
    params +="                <div id='down'>"
    params +="                    <ul class='phones'>"
    params +="                        <li><img src='../common/images/china.png' class='opimg' id='op-img'> <span class='optxt'>简体中文</span></li>"
    params +="                        <li><img src='../common/images/usa.png' class='opimg' id='op-img'> <span class='optxt'>English</span></li>"
    params +="                    </ul>"
    params +="                </div>"
    params +="            </div>"
    params += "         </div>";
    params += "        </div>";

  $('.navbar').html(params);


  if(getCookie('grycan.cn.bLang') =='english'){
    $('#eui-main-footer').html("Lenovo Voice&nbsp;&nbsp;&nbsp;©&nbsp;&nbsp;copyright&nbsp;&nbsp;1998－2015&nbsp;&nbsp;Artificial Intelligence Laboratory of Lenovo Group Co., Ltd&nbsp;&nbsp;京ICP备05000462");
  }else{
    $('#eui-main-footer').html("联想语音&nbsp;&nbsp;&nbsp;©&nbsp;&nbsp;版权所有&nbsp;&nbsp;1998－2015&nbsp;&nbsp;联想集团有限公司人工智能实验室&nbsp;&nbsp;京ICP备05000462");
  }
  
if(Username=="" || Username==null||Username.length == 0){
    $('.mobile_style').removeClass('mobile_bottom_border')
}else{
    $('.mobile_style').addClass('mobile_bottom_border')
}
$('.mobile_top_username').click(function(){
    $('.open_style').toggle()
})
  if(navigator.userAgent.indexOf("MSIE")>0){
    $('.nav-left li').css({"padding-left":"100px"})
}
$(document).ready(function(){
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        $('.nav').removeClass('hover-menu')
        $('#pro-control').attr('data-toggle','dropdown')
        $('#pro-ul').removeClass('product-menu')
        $('#pro-ul').addClass('dropdown-menu')
        $('#user-ul').removeClass('user-menu')
        $('#user-ul').addClass('dropdown-menu')
        $('#lenovo-user-name').attr('data-toggle','dropdown')
    }else{
        $('.nav').addClass('hover-menu')
        $('#pro-control').removeAttr('data-toggle')
        $('#pro-ul').addClass('product-menu')
        $('#pro-ul').removeClass('dropdown-menu')
        $('#user-ul').addClass('user-menu')
        $('#user-ul').removeClass('dropdown-menu')
        $('#lenovo-user-name').removeAttr('data-toggle')
    }
})

// $(document).ready(function(){
//     $('.product').hover(function(){
//         console.log('移入')
//     },function(){
//         console.log('移除')
//     })
// })
}
function getCookie(name){
	var strcookie = document.cookie;//获取cookie字符串
	var arrcookie = strcookie.split("; ");//分割
	//遍历匹配
	for ( var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if (arr[0] == name){
			return arr[1];
		}
	}
	return "";
}

