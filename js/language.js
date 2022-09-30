/**
 * cookie操作
 */
function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  // document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
  document.cookie = c_name + "=" + value + "; "+ expiredays + ";path=/";
}
// function getCookie(c_name) {
//   var that = this;
//   console.log(document.cookie)
//   if (document.cookie.length > 0) {
//     //检查这个cookie是否存在，不存在就为 -1
//     c_start = document.cookie.indexOf(c_name + "=")
//     if (c_start != -1) {
//       //获取cookie值的开始位置
//       c_start = c_start + c_name.length + 1;
//       //通过";"号是否存在来判断结束位置
//       c_end = document.cookie.indexOf(";", c_start);

//       if (c_end == -1){
//         c_end = document.cookie.length;
//       }
//       //通过substring()得到了值
//       return unescape(document.cookie.substring(c_start, c_end))
//     }
//   }
//   return ""
// }

function getCookies(s){
  var str = s;
  //将值切割成数组
  var arr = str.split(";");
  var userid;
  //遍历数组
  for(var i=0;i<arr.length;i++){
      var value = arr[i].split("=");
      if(value[0] == 'languageType'){
          userid = value[1];
      }
  }
  return userid
}
/**
 * 获取浏览器语言类型
 * @return {string} 浏览器国家语言
 */
var getNavLanguage = function(){
  if(navigator.appName == "Netscape"){
    var navLanguage = navigator.language;
    // 替换-为_  适配资源文件名，可自定义
    return  navLanguage.replace(/[-]/g,"_");
  }
  return false;
}

// 定义语言变量
var i18nLanguage = '';
// 设置网站支持的语言种类
var webLanguage = ['zh_CN', 'en_US'];

// 定义页面i18n方法
var execI18n = function(){
  // 获取cookie语言类型
  // console.log(getCookies(document.cookie))
  if(getCookies(document.cookie)) {
    i18nLanguage = getCookies(document.cookie)
    // console.log('获取cooKie语言类型成功--->', getCookies(document.cookie))
  } else {
    // 获取失败时设置中文
    i18nLanguage = 'zh_CN'
  }
  /* 判断引入 i18n 文件*/
  if ($.i18n == undefined) {
    console.log("请引入i18n js 文件")
    return false;
  };

  // i18n翻译方法
  jQuery.i18n.properties({
    name : 'messages',  //资源文件前缀
    path : '../i18n/',     //资源文件路径
    mode : 'map',       //用Map的方式使用资源文件中的值
    language : i18nLanguage,
    callback : function() {//加载成功后设置显示内容
      var insertEle = $(".i18n");
      // console.log(".i18n 写入中...");
      insertEle.each(function() {
        // 根据i18n元素的 name 获取内容写入
        $(this).html($.i18n.prop($(this).attr('name')));
      });
      // console.log("写入完毕");

      // console.log(".i18n-input 写入中...");
      var insertInputEle = $(".i18n-input");
      insertInputEle.each(function() {
        var selectAttr = $(this).attr('selectattr');
        if (!selectAttr) {
          selectAttr = "value";
        };
        $(this).attr(selectAttr, $.i18n.prop($(this).attr('selectname')));
      });
      // console.log("写入完毕");
    }
  });
}

// 页面执行加载执行
// $(function(){
  // 调用翻译方法
  execI18n();
  // 将语言选择默认选中缓存中的值
  // $("#language option[value="+i18nLanguage+"]").attr("selected",true);
  if(getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == '' || getCookies(document.cookie) == 'null' || getCookies(document.cookie) == undefined){
    $('#checkLang').attr('src','../assets/img/zh_CN.png')
  }else{
    $('#checkLang').attr('src','../assets/img/en_US.png')
  }
  // 选择语言方法
  function trans(){
    if(getCookies(document.cookie) == 'zh_CN' || getCookies(document.cookie) == '' || getCookies(document.cookie) == 'null' || getCookies(document.cookie) == undefined){
      setCookie("languageType", 'en_US', 1);
    }else{
      setCookie("languageType", 'zh_CN', 1);
    }
    location.reload();
  }
  // $("#language").on('change', function() {
  //   var language = $(this).children('option:selected').val()
  //   console.log('选择language-->', language);
  //   // 选择语言后设置cookie存储；变量名，值，过期天数
  //   setCookie("languageType", language, 1);
  //   // execI18n();
  //   location.reload();
  // });
// });
// execI18n();