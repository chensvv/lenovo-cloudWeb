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

function unhtml(str) {
    return str ? str.replace(/[<">']/g, (a) => {
          return {
              '<': '&lt;',
              '"': '&quot;',
             '>': '&gt;',
             "'": '&#39;'
         }[a]
     }) : '';
 }


function loadTop(data) {
    var params = "";
//  params += "  "
    params += "    <div class=\"container\">";
    params += "        <div class=\"navbar-header\">";
    params += "             <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">";
	params += "				    <span class=\"sr-only\">Toggle navigation</span>";
	params += "				    <span class=\"icon-bar\"></span>";
	params += "				    <span class=\"icon-bar\"></span>";
	params += "				    <span class=\"icon-bar\"></span>";
	params += "				</button>";
    params += "            <div class=\"navbar-icon\">";
    params += "                <img src=\"../common/images/icon.png\" alt=\"\">";
    params += "            </div>"; 
     params += "            </div>"; 
    params += "           <div id=\"navbar\" class=\"collapse navbar-collapse\">";
    params += "                <ul class=\"nav navbar-nav\">";
    if(data == "index"){
        params += "                    <li class=\"active\">";
    }else{
        params += "                    <li>";
    }
    params += "                        <a href=\"#\" onclick=\"menu_first_page()\" target=\"_self\" >首页</a>";
    params += "                    </li>";
    if(data == "product"){
        params += "                    <li class=\"active\">";
    }else{
        params += "                    <li>";
    }
    params += "                        <a href=\"#\" target=\"_self\"  data-toggle=\"dropdown\" >产品与服务<span class=\"caret\"></span></a>";
    params += "                        <ul class=\"dropdown-menu\">";
    params += "                            <li><a href=\"#\" onclick=\"menu_voice_recognise()\" id=\"second\" >短语音识别</a></li>";
    params += "                            <li><a href=\"#\" onclick=\"menu_voice_longrecognise()\" id=\"\" >长语音识别 <span style='color:red'>(Beta)</span></a></li>";
//    params += "                            <li><a href=\"#\" onclick=\"menu_voice_synthesis()\">语音合成</a></li>";
    params += "                        </ul>";
    params += "                    </li>";
/*    if(data == "sdk"){
        params += "                    <li class=\"active\">";
   }else{
        params += "                    <li class=\"\">";
    }
    params += "                        <a href=\"#\" onclick=\"menu_sdk_download()\" target=\"_self\" >SDK下载</a>";
    params += "                    </li>";
*/
    if(data == "document"){
        params += "                    <li class=\"active\">";
    }else{
        params += "                    <li class=\"\">";
    }
    params += "                        <a href=\"#\" onclick=\"menu_product_document()\" id=\"third\" target=\"_self\" >使用文档</a>";
    params += "                    </li>";
    if(data == "newdata"){
        params += "                    <li class=\"active\">";
    }else{
        params += "                    <li class=\"\">";
    }
    params += "                        <a href=\"#\" onclick=\"menu_new_data()\" id=\"\" target=\"_self\" >新闻资讯</a>";
    params += "                    </li>";
    if(data == "information"){
        params += "                    <li class=\"active\">";
    }else{
        params += "                    <li class=\"\">";
    }
    params += "                        <a href=\"#\" onclick=\"menu_forum_list()\" id=\"\" target=\"_self\" >留言板</a>";
    params += "                    </li>";
    params += "                </ul>";
    params += "                <ul class=\"nav navbar-nav navbar-right\">";

    params += "                    <li id=\"login1\">";

    var secretkey = window.localStorage.getItem('secretkey');
    var accountid = window.localStorage.getItem('accountid');
    var lenovoname = window.localStorage.getItem('lenovoname');
    var Username = window.localStorage.getItem('Username');
    

    var arr,reg=new RegExp("(^| )LPSWUST=([^;]*)(;|$)");
    if (Username=="" || Username==null||Username.length == 0) {
        params += "                        <a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html\" target=\"_self\" id='lenovo-user-name'>请使用联想账号登录</a>";
    } else {
        params += "                        <a href=\"#\" target=\"_self\"  data-toggle=\"dropdown\" id='lenovo-user-name'>"+ unhtml(Username) +"<span class=\"caret\"></span></a>";
        params += "                        <ul class=\"dropdown-menu\">";
        params += "                            <li><a href=\"https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=myaccount&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN\" target='_blank'>联想账号信息</a></li>";
//      params += "                            <li role=\"separator\" class=\"divider\"></li>";
        params += "                            <li><a href=\"#\" onclick=\"user_info()\">开发者信息</a></li>";
        params += "                            <li><a href=\"#\" onclick=\"user_logout()\">退出</a></li>";
        params += "                        </ul>";
    }
    params += "                    </li>";
    params += "                </ul>";
    params += "            </div>";
    params += "        </div>";
//  params += "    </nav>";

  $('.navbar').html(params);

  $('#eui-main-footer').html("联想语音&nbsp;&nbsp;&nbsp;©&nbsp;&nbsp;版权所有&nbsp;&nbsp;1998－2015&nbsp;&nbsp;联想集团有限公司人工智能实验室&nbsp;&nbsp;京ICP备05000462");

  var hei = $(window).height();
  if(hei<900){
      hei = 900;
  }
  $('#eui-main-body').css({"min-height":(hei-150)+"px"});;
}