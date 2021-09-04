let i18n = new EhiI18n('../lan/',()=>{
  //获取当前语言
  // console.log(`当前语言${i18n.getLanguage()}`)
  //从语言中获取值,可在Js获取的时候使用
  // console.log(i18n.get('login_username'))
});
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
  if(localStorage.getItem('ehiI18n.Language') == 'zh' || localStorage.getItem('ehiI18n.Language') == '' || localStorage.getItem('ehiI18n.Language') == null || localStorage.getItem('ehiI18n.Language') == undefined){
    $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans2.png')
  }else{
    $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans.png')
  }

  // var localStorageData = JSON.parse(localStorage.getItem('data'))
  // if(localStorageData == null){
  //   $('.user').css("display","none")
  //   $('.login-reg').css("display","block")
  //   }else{
  if(localStorage.getItem('token') == '' || localStorage.getItem('token') == null || localStorage.getItem('token') == undefined){
    $('.user').css("display","none")
    $('.login-reg').css("display","block")
  }else{
    $('.user').css("display","block")
    $('.login-reg').css("display","none")
    $('.username').html(hideStar(localStorage.getItem('un')))
  }
  $.ajax({
    type:"POST",
    url:proURL+"/userinfo",
    headers: {  
      "channel" : "cloudasr"
    },
    data:{"username":localStorage.getItem('un'),"lenovoid":$.base64.decode(localStorage.getItem('acd')),t:localStorage.getItem('token')},
    success:function(data){
      if(data.errorcode ==1024){
        localStorage.removeItem('token')
        $('.user').css("display","none")
        $('.login-reg').css("display","block")
      }else{
        $('.user').css("display","block")
        $('.login-reg').css("display","none")
        $('.username').html(hideStar(localStorage.getItem('un')))
      }
    },
    error:function(){
      localStorage.removeItem('token')
      $('.user').css("display","none")
      $('.login-reg').css("display","block")
    }
  })
    // }
  
  

  function hideStar(str){
    if(str.length < 7){
        return str.substring(0,1).concat("****")
    }else{
        return str.substring(0,3) + "****" + str.substring(str.length - 4)
    }
}

  

  
})(jQuery);

function logout(){
  localStorage.removeItem('token')
  var url = window.location.href
  window.localStorage.setItem('returnurl',url)
  window.location.href = 'https://voice.lenovomm.com/voicePlatform/login/login.html'
}

function gologin(){
  var url = window.location.href
  window.localStorage.setItem('returnurl',url)
  window.location.href = 'https://voice.lenovomm.com/voicePlatform/login/login.html'
}

function isLang(){
  
  if(localStorage.getItem('ehiI18n.Language') == 'zh' || localStorage.getItem('ehiI18n.Language') == '' || localStorage.getItem('ehiI18n.Language') == null || localStorage.getItem('ehiI18n.Language') == undefined){
    i18n.setLanguage('us')
    $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans.png')
    // console.log("en===============")
  }else if(localStorage.getItem('ehiI18n.Language') == 'us'){
    i18n.setLanguage('zh')
    $('.trans').attr('src','https://voice.lenovomm.com/voicePlatform/assets/img/trans2.png')
    // console.log("中文===============")
  }
}