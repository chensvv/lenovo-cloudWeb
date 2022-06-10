$(function () {
    var Username = $.base64.decode(window.localStorage.getItem('un'));
    var accountid = $.base64.decode(window.localStorage.getItem('acd'));
    var token = $.base64.decode(window.localStorage.getItem('token'))
    $('#pub-loading').hide()
    // $(".qu_btn").click(function () {
    //     $('html,body').animate({
    //         scrollTop: $('#eui-main-footer').offset().top
    //     });
    // });
    // $('.back_arrows').click(function () {
    //     history.back(-1)
    // })
    // $(function () {
    //     var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
    //     if (user) {
    //         $('.mobile_div').css({
    //             "display": "block"
    //         })
    //         $(".navbar").css({
    //             "display": "none"
    //         })
    //         $(".posi_nav").css({
    //             "display": "none"
    //         });
    //     } else {
    //         $('.qu_btn').removeClass('mobile_btn')
    //         $('.mobile_div').css({
    //             "display": "none"
    //         })
    //     }

    //     $(window).scroll(function () {
    //         // 滚动条距离顶部的距离 大于 100px时
    //         if ($(window).scrollTop() >= 100) {
    //             $(".navbar").css({
    //                 "display": "none"
    //             })
    //             if (!user) {
    //                 $(".posi_nav").css({
    //                     "display": "flex"
    //                 });
    //             }

    //         } else {
    //             if (user) {
    //                 $(".navbar").css({
    //                     "display": "none"
    //                 })
    //                 $(".mobile_div").css({
    //                     "display": "block"
    //                 });
    //             } else {
    //                 $(".navbar").css({
    //                     "display": "block"
    //                 })
    //             }
    //             $(".posi_nav").css({
    //                 "display": "none"
    //             });
    //         }
    //     })

    // })
    function content(){
        var detailParams = {
            articleid:id,
            lid:accountid,
            t:token,
            pagenum: "",
            pagecount: "",
            language:"",
            title:"",
            content:"",
            accountname:"",
            parentid:"",
            datatype:"",
            dataid:""
        }
        var stringParams = JSON.stringify(detailParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        detailParams.sign = md5(stringParams)
        $.ajax({
            type:"POST",
            url:proURL+"/forum/detail",
            dataType:"json",
            headers: {
                "channel" : "cloudasr"
            },
            data:detailParams,
            success:function(res){
                if(res.errorcode !=1024){
                    $.each(res.datalist.child, function (idx, val) {
                    // var nowtime = formatDateTime(val.createTime);
                         var el="";
                        var arr = document.getElementsByClassName('comment-info').length+1;
                        if(val.commentLevel == 1){
                            var nowtime = formatDateTime(val.createTime);
                            el+=`<div class='comment-info comment${idx}'>
                                    <div class='comment-content-header'>
                                        <span class='floor'>#${arr}</span>
                                        <span class='auth'>${unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')}</span>
                                    </div>
                                    <div class='comment-right' id="${val.parentCommentId}">			
                                        <p class='pid' hidden>${val.parentCommentId}</p>
                                        <p class='valid' hidden>${val.id}</p>
                                        <p class='content'>${unhtml(val.content)}</p>
                                        <div class='comment-content-footer'>
                                            <div class='rowtext'>
                                                <div class='col-dels'></div>		
                                                <div class='col-update'>
                                                    <span class='reply-time'>${nowtime}</span>`
                                                    if(hideStar(Username) == val.accountName){
                                                        el+=`<span class='del'>${i18n.get('del')}</span>`
                                                    }
                                                        el+=`<span class='reply-btn'>${i18n.get('reply')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class='reply-box'>` 
                            if(val.child.length >0){
                                $.each(val.child, function(idx,rep){
                                    el+=`<div class='reply'>
                                            <div class='bl${idx}'>
                                                <p class='keyid' hidden>${rep.id}</p>
                                                <div class='repinfo'>
                                                    <div class='replyname'>${unhtml(rep.accountName).replace(/(\w{3})\w{4}/, '$1****')+':'}<span class='reply-con'>${unhtml(rep.content)}</span></div>
                                                </div>
                                                 <p>`
                                            if(hideStar(Username) == rep.accountName){
                                                el+=`<span class='delchild'>${i18n.get('del')}</span>`
                                            }
                                                el+=`<span class='reptime'>${formatDateTime(rep.createTime)}</span>
                                                </p>
                                            </div>
                                        </div>`
                                })
                            }
                            `</div>`
                        }
                        $(".comment-list").append(el).find(".reply-btn").unbind().click(function () {
                            if ($(this).parent().parent().find(".replybox").length > 0) {
                                $(".replybox").remove();
                            } else {
                                replyClick($(this));
                            }
                        });
                        
                        $(".comment-list").find(".del").unbind().click(function(e){
                            var valid = $(this).parent().parent().parent().parent().find(".valid").text()
                            Swal.fire({
                                text: i18n.get('nodelete'),
                                showCancelButton: true,
                                allowOutsideClick:false,
                                allowEscapeKey:false,
                                reverseButtons:true,
                                width:'16em',
                                confirmButtonColor: '#94cb82',
                                cancelButtonColor: '#d33',
                                confirmButtonText: i18n.get('confirm'),
                                cancelButtonText:i18n.get('cancel')
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    var detailParams = {
                                        dataid: valid,
                                        accountname: Username,
                                        lid: accountid,
                                        t: token,
                                        articleid:"",
                                        pagenum: "",
                                        pagecount: "",
                                        language:"",
                                        title:"",
                                        content:"",
                                        parentid:"",
                                        datatype:""
                                    }
                                    var stringParams = JSON.stringify(detailParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
                                    detailParams.sign = md5(stringParams)
                                    $.ajax({
                                        type: "POST",
                                        url: proURL+"/forum/delete",
                                        data:detailParams,
                                        headers: {
                                            "channel": "cloudasr"
                                        },
                                        success: function (data) {
                                            if (data.errorcode != 1024) {
                                                history.go(0)
                                            } else {
                                                localStorage.clear();
                                                // Swal.fire({
                                                //     text: i18n.get('logTimeOut'),
                                                //     showCancelButton: true,
                                                //     allowOutsideClick:false,
                                                //     allowEscapeKey:false,
                                                //     reverseButtons:true,
                                                //     width:'16em',
                                                //     confirmButtonColor: '#94cb82',
                                                //     cancelButtonColor: '#d33',
                                                //     confirmButtonText: i18n.get('confirm'),
                                                //     cancelButtonText:i18n.get('cancel')
                                                // }).then((result) => {
                                                //     if (result.isConfirmed) {
                                                        var url = window.location.href
                                                        window.localStorage.setItem('returnurl',url)
                                                        window.location.href = '../login/login.html'
                                                //     }
                                                // })
                                                
                                            }
                                        }
                                    })
                                }
                            })
                        });
                        $(".comment-list").find(".delchild").unbind().click(function(){
                            var keyid = $(this).parent().parent().find(".keyid").text();
                            Swal.fire({
                                text: i18n.get('nodelete'),
                                showCancelButton: true,
                                allowOutsideClick:false,
                                allowEscapeKey:false,
                                reverseButtons:true,
                                width:'16em',
                                confirmButtonColor: '#94cb82',
                                cancelButtonColor: '#d33',
                                confirmButtonText: i18n.get('confirm'),
                                cancelButtonText:i18n.get('cancel')
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    var delParams = {
                                        dataid: keyid,
                                        accountname: Username,
                                        lid: accountid,
                                        t: token,
                                        articleid:"",
                                        pagenum: "",
                                        pagecount: "",
                                        language:"",
                                        title:"",
                                        content:"",
                                        parentid:"",
                                        datatype:""
                                    }
                                    var stringParams = JSON.stringify(delParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
                                    delParams.sign = md5(stringParams)
                                    $.ajax({
                                        type: "POST",
                                        url: proURL+"/forum/delete",
                                        data:delParams,
                                        headers: {
                                            "channel": "cloudasr"
                                        },
                                        success: function (data) {
                                            if (data.errorcode != 1024) {
                                                history.go(0)
                                            } else {
                                                localStorage.clear();
                                                // Swal.fire({
                                                //     text: i18n.get('logTimeOut'),
                                                //     showCancelButton: true,
                                                //     allowOutsideClick:false,
                                                //     allowEscapeKey:false,
                                                //     reverseButtons:true,
                                                //     width:'16em',
                                                //     confirmButtonColor: '#94cb82',
                                                //     cancelButtonColor: '#d33',
                                                //     confirmButtonText: i18n.get('confirm'),
                                                //     cancelButtonText:i18n.get('cancel')
                                                // }).then((result) => {
                                                //     if (result.isConfirmed) {
                                                        var url = window.location.href
                                                        window.localStorage.setItem('returnurl',url)
                                                        window.location.href = '../login/login.html'
                                                //     }
                                                // })
                                            }

                                        }
                                    })
                                }
                            })
                        });
                    });
                    $('.reply_length').text($('.comment-info').length + $('.reply').length)
                    if($('.comment-info').length + $('.reply').length < 1 ){
                        $('.comment-empty').css('display','block')
                    }else{
                        $('.comment-empty').css('display','none')
                    }
                } else {
                    localStorage.clear();
                    // Swal.fire({
                    //     text: i18n.get('logTimeOut'),
                    //     showCancelButton: true,
                    //     allowOutsideClick:false,
                    //     allowEscapeKey:false,
                    //     reverseButtons:true,
                    //     width:'16em',
                    //     confirmButtonColor: '#94cb82',
                    //     cancelButtonColor: '#d33',
                    //     confirmButtonText: i18n.get('confirm'),
                    //     cancelButtonText:i18n.get('cancel')
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                            var url = window.location.href
                            window.localStorage.setItem('returnurl',url)
                            window.location.href = '../login/login.html'
                    //     }
                    // })
                }
            },
            error: function (err) {
                Swal.fire({
                    text:i18n.get('server_error'),
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        });
    }



    //二级评论
    function replyClick(el) {
        var secondTeply = el.parent().parent().append(`<div class='replybox'><textarea cols='80' rows='50' class='comment_textarea' ></textarea><span class='send'>${i18n.get('send')}</span></div>`)
        secondTeply.find(".send").click(function () {
                var content = $(this).prev().val();
                if (content != "") {
                    var tit = $(".htitle").text();
                    var $content = $(".comment_textarea").val();
                    var parentEl = $(this).parent().parent().parent().parent();
                    var pid = parentEl.find(".pid").html();
                    var addParams = {
                        title: tit,
                        content: $content,
                        accountname: Username,
                        articleid: id,
                        parentid: pid,
                        lid: accountid,
                        t: token,
                        dataid: "",
                        pagenum: "",
                        pagecount: "",
                        language:"",
                        datatype:1
                    }
                    var stringParams = JSON.stringify(addParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
                    addParams.sign = md5(stringParams)
                    $.ajax({
                        type: "POST",
                        url: proURL+"/forum/add",
                        dataType: 'json',
                        data:addParams,
                        headers: {
                            "channel": "cloudasr"
                        },
                        success: function (data) {
                            if (data.errorcode != 1024) {
                                history.go(0)
                            } else {
                                localStorage.clear();
                                // Swal.fire({
                                //     text: i18n.get('logTimeOut'),
                                //     showCancelButton: true,
                                //     allowOutsideClick:false,
                                //     allowEscapeKey:false,
                                //     reverseButtons:true,
                                //     width:'16em',
                                //     confirmButtonColor: '#94cb82',
                                //     cancelButtonColor: '#d33',
                                //     confirmButtonText: i18n.get('confirm'),
                                //     cancelButtonText:i18n.get('cancel')
                                // }).then((result) => {
                                //     if (result.isConfirmed) {
                                        var url = window.location.href
                                        window.localStorage.setItem('returnurl',url)
                                        window.location.href = '../login/login.html'
                                //     }
                                // })
                            }

                        },
                        error: function (err) {
                            Swal.fire({
                                text:i18n.get('server_error'),
                                confirmButtonText: i18n.get('confirm'),
                                confirmButtonColor: '#94cb82'
                            })
                        }
                    });


                } else {
                    Swal.fire({
                        text:i18n.get('noempty'),
                        confirmButtonText: i18n.get('confirm'),
                        confirmButtonColor: '#94cb82'
                    })
                }
            });
    }




    function formatDateTime(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    };

    //过滤特殊字符
    function unhtml(sHtml) {
        return sHtml.replace(/[<>&"]/g, function (c) {
            return {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;'
            } [c];
        });
    }
    // 用户名加密
    function hideStar(str){
        if(str.length < 7){
            return str.substring(0,1).concat("****")
        }else{
            return str.substring(0,3) + "****" + str.substring(str.length - 4)
        }
    }
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    //接收URL中的参数articleId
    var id = getUrlParam('article');
    var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
    if (user) {
        $('.mobile_btn').click(function () {
            window.location.href = "./reply.html?article=" + id;
        })
    }
    //文章展示
    var detParams = {
        articleid: id,
        lid: accountid,
        t: token,
        dataid: "",
        accountname: "",
        pagenum: "",
        pagecount: "",
        language:"",
        title:"",
        content:"",
        parentid:"",
        datatype:""
    }
    var stringParams = JSON.stringify(detParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
    detParams.sign = md5(stringParams)
    $.ajax({
        type: 'POST',
        url: proURL+"/forum/detail",
        dataType: 'json',
        data:detParams,
        headers: {
            "channel": "cloudasr"
        },
        success: function (res, status) {
            var val = res.datalist
            if (res.errorcode != 1024) {
                    var nowtime = formatDateTime(val.createTime);
                    //根据id获取详情数据   
                    if (val.commentLevel == 0) {
                        $(".htitle").text(val.title);
                        $(".posi_title").text(val.title);
                        $(".title_arrows").text(val.title);
                        $('.reply_arrows').text(val.title)
                        $(".newauthor").text(val.accountName.replace(/(\w{3})\w{4}/, '$1****'));
                        $(".newtime").text(nowtime);
                        $('.cont').text(val.content);
                    }
            } else {
                localStorage.clear();
                // Swal.fire({
                //     text: i18n.get('logTimeOut'),
                //     showCancelButton: true,
                //     allowOutsideClick:false,
                //     allowEscapeKey:false,
                //     reverseButtons:true,
                //     width:'16em',
                //     confirmButtonColor: '#94cb82',
                //     cancelButtonColor: '#d33',
                //     confirmButtonText: i18n.get('confirm'),
                //     cancelButtonText:i18n.get('cancel')
                // }).then((result) => {
                //     if (result.isConfirmed) {
                        var url = window.location.href
                        window.localStorage.setItem('returnurl',url)
                        window.location.href = '../login/login.html'
                //     }
                // })
            }
        },
        error: function (err) {
            Swal.fire({
                text:i18n.get('server_error'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
        }
    })


    //一级评论展示
    content();


    //评论一级添加
    $("#comment").click(function () {
        if ($("#content").val() == "") {
            Swal.fire({
                text:i18n.get('noempty'),
                confirmButtonText: i18n.get('confirm'),
                confirmButtonColor: '#94cb82'
            })
            return;
        }
        $('#pub-loading').show()
        $('#comment').attr('disabled','disabled')
        var tit = $(".htitle").text();
        var tit2 = $('.reply_arrows').text()
        var $content = $("#content").val();
        var adParams = {
            lid: accountid,
            t: token,
            articleid: id,
            dataid: "",
            accountname: Username,
            pagenum: "",
            pagecount: "",
            language:"",
            title:tit || tit2,
            content:$content,
            parentid:0,
            datatype:1
        }
        var stringParams = JSON.stringify(adParams,fourmReplacer).replace(/\"/g, "").replace(/\:/g, '=').replace(/\,/g, '&').replace(/\{/g, '').replace(/\}/g, '')
        adParams.sign = md5(stringParams)
        $.ajax({
            type: 'POST',
            url: proURL+"/forum/add",
            data:adParams,
            dataType: 'json',
            headers: {
                "channel": "cloudasr"
            },
            success: function (res, status) {
                $('#pub-loading').hide()
                $('#comment').removeAttr('disabled','disabled')
                if (res.errorcode != 1024) {
                    $(".mytextarea").val("");
                    $(".comment-list").html(" ");
                    //一级评论展示
                    content()
                } else {
                    localStorage.clear();
                    // Swal.fire({
                    //     text: i18n.get('logTimeOut'),
                    //     showCancelButton: true,
                    //     allowOutsideClick:false,
                    //     allowEscapeKey:false,
                    //     reverseButtons:true,
                    //     width:'16em',
                    //     confirmButtonColor: '#94cb82',
                    //     cancelButtonColor: '#d33',
                    //     confirmButtonText: i18n.get('confirm'),
                    //     cancelButtonText:i18n.get('cancel')
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                            var url = window.location.href
                            window.localStorage.setItem('returnurl',url)
                            window.location.href = '../login/login.html'
                    //     }
                    // })
                }
            },
            error: function (err) {
                $('#pub-loading').hide()
                $('#comment').removeAttr('disabled','disabled')
                Swal.fire({
                    text:i18n.get('server_error'),
                    confirmButtonText: i18n.get('confirm'),
                    confirmButtonColor: '#94cb82'
                })
            }
        })
    });
    
})
