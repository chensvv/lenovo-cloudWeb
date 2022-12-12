
!(function($) {
  "use strict";

  // Toggle .header-scrolled class to #header when page is scrolled
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
      $('#drop-ul').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
      $('#drop-ul').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      e.preventDefault();
      var target = $(this.hash);
      if (target.length) {

        var scrollto = target.offset().top;
        var scrolled = 20;

        if ($('#header').length) {
          scrollto -= $('#header').outerHeight()

          if (!$('#header').hasClass('header-scrolled')) {
            scrollto += scrolled;
          }
        }

        if ($(this).attr("href") == '#header') {
          scrollto = 0;
        }

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
          $('.mobile-nav-overly').fadeOut();
        }
        return false;
      }
    }
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="bx bx-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
      $('.mobile-nav-overly').toggle();
    });

    $(document).on('click', '.mobile-nav .drop-down > a', function(e) {
      e.preventDefault();
      $(this).next().slideToggle(300);
      $(this).parent().toggleClass('active');
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('bx-menu bx-x');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }


  

  // Initiate the venobox plugin
  // $(window).on('load', function() {
  //   $('.venobox').venobox();
  // });

  // jQuery counterUp
  // $('[data-toggle="counter-up"]').counterUp({
  //   delay: 10,
  //   time: 1000
  // });

  // Porfolio isotope and filter
  // $(window).on('load', function() {
  //   var portfolioIsotope = $('.portfolio-container').isotope({
  //     layoutMode: 'fitRows'
  //   });

  //   $('#portfolio-flters li').on('click', function() {
  //     $("#portfolio-flters li").removeClass('filter-active');
  //     $(this).addClass('filter-active');

  //     portfolioIsotope.isotope({
  //       filter: $(this).data('filter')
  //     });
  //     aos_init();
  //   });

  // });

  // Initi AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }
  $(window).on('load', function() {
    aos_init();
  });

  $(window).resize(function() {
    if(document.documentElement.clientWidth >=992) {
        $('.nav-menu').addClass('dis-flex')
      }else{
        $('.nav-menu').removeClass('dis-flex')
      }
  });
  if(document.documentElement.clientWidth >=992) {
    $('.nav-menu').addClass('dis-flex')
  }else{
    $('.nav-menu').removeClass('dis-flex')
  }

  // var localStorageData = JSON.parse(localStorage.getItem('data'))
  // if(localStorageData == null){
  //   $('.user').css("display","none")
  //   $('.login-reg').css("display","block")
  //   }else{
  if($.base64.decode(window.localStorage.getItem('token')) == '' || $.base64.decode(window.localStorage.getItem('token')) == null || $.base64.decode(window.localStorage.getItem('token')) == undefined){
    $('.user').css("display","none")
    $('.login-reg').css("display","block")
  }else{
    $('.user').css("display","block")
    $('.login-reg').css("display","none")
    $('.username').html(hideStar($.base64.decode(window.localStorage.getItem('un'))))
  }
  var params = {
    username:$.base64.decode(window.localStorage.getItem('un')),
    lenovoid:$.base64.decode(window.localStorage.getItem('acd')),
    t:$.base64.decode(window.localStorage.getItem('token')),
    u:"",
    p:"",
    language:"",
    phone:"",
    company:"",
    dept:"",
    lid:"",
    opwd:"",
    pwd:"",
    userService:"",
    code:"",
    imgCode:"",
    ucode:"",
    channel:""
  }
  var stringParams = JSON.stringify(params,userReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
  params.sign = md5(stringParams)
  $.ajax({
    type:"POST",
    url:proURL+"/userinfo",
    headers: {
      "channel" : "cloudasr"
    },
    data:params,
    success:function(data){
      if(data.errorcode ==1024){
        window.localStorage.clear();
        $('.user').css("display","none")
        $('.login-reg').css("display","block")
      }else{
        $('.user').css("display","block")
        $('.login-reg').css("display","none")
        $('.username').html(hideStar($.base64.decode(window.localStorage.getItem('un'))))
      }
    },
    error:function(){
      window.localStorage.clear();
      $('.user').css("display","none")
      $('.login-reg').css("display","block")
    }
  })
    // }
  // console.log($('.ident').html(),Date.parse(new Date()) / 1000, localStorage.getItem('acd'))

  function hideStar(str){
    if(str.length < 7){
        return str.substring(0,1).concat("****")
    }else{
        return str.substring(0,3) + "****" + str.substring(str.length - 4)
    }
}

if(window.localStorage.getItem('ms') == 1){
  $('.ifshow').css('display','block')
}else{
  $('.ifshow').css('display','none')
}
  
// $(".nav-item").find("li").each(function () {
//   var a = $(this).find("a:first")[0];
//   if ($(a).attr("href").replace('..','') === location.pathname || $(a).attr("href").replace('..','') === location.pathname.replace('/voicePlatform','')) {
//       $(this).parents("li").addClass("open");
//       $(this).addClass("active");
//   } else {
//       $(this).removeClass("active");
//   }
// });
  
})(jQuery);

var languri
if(window.location.host.indexOf('voice.lenovomm.com') == 0){
  languri = 'https://voice.lenovomm.com/voicePlatform/'
}else{
  languri = '../'
}
function logout(){
  window.localStorage.clear();
  var url = window.location.href
  window.localStorage.setItem('returnurl',url)
  window.location.href = languri+'login/login.html'
}

function gologin(){
  var url = window.location.href
  window.localStorage.setItem('returnurl',url)
  window.location.href = languri+'login/login.html'
}

// function isLang(){
//   if(window.localStorage.getItem('ehiI18n.Language') == 'zh' || window.localStorage.getItem('ehiI18n.Language') == '' || window.localStorage.getItem('ehiI18n.Language') == 'null' || window.localStorage.getItem('ehiI18n.Language') == undefined){
//     i18n.setLanguage('us')
//     $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans.png')
//     // console.log("en===============")
//   }else if(window.localStorage.getItem('ehiI18n.Language') == 'us'){
//     i18n.setLanguage('zh')
//     $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans2.png')
//     // console.log("中文===============")
//   }
// }
// function isLang(){
//   if(getCookies(document.cookie) == 'zh' || getCookies(document.cookie) == '' || getCookies(document.cookie) == 'null' || getCookies(document.cookie) == undefined){
//     i18n.setLanguage('us')
//     $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/en_US.png')
//     // console.log("en===============")
//   }else if(getCookies(document.cookie) == 'us'){
//     i18n.setLanguage('zh')
//     $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/zh_CN.png')
//     // console.log("中文===============")
//   }
// }
function goback(){
  window.history.go(-1)
}

// function getCookies(s){
//   var str = s;
//   //将值切割成数组
//   var arr = str.split(";");
//   var userid;
//   //遍历数组
//   for(var i=0;i<arr.length;i++){
//       var value = arr[i].split("=");
//       if(value[0] == 'ehiI18n.Language'){
//           userid = value[1];
//       }
//   }
//   return userid
// }
