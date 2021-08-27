$(function () {
    var total = ""
    $.ajax({
        url: proURL + '/forum/list',
        type: 'post',
        dataType: "json",
        data: {
            "pagenum": 1,
            "pagecount": 10,
            t: localStorage.getItem('token'),
            lid: $.base64.decode(localStorage.getItem('acd'))
        },
        headers: {
            "channel": "cloudasr"
        },
        success: (res) => {
            total=res.total;
            if (res.errorcode != 1024) {
                var vhtml = ''
                $.each(res.datalist, (idx, val) => {
                    vhtml += `<li class="media" onclick="questionDetail(${val.articleId})">
                                <img src="http://qxyoeao6k.hd-bkt.clouddn.com/head.png" class="align-self-center mr-3 list-img" alt="">
                                <div class="media-body">
                                    <h6 class="mt-0 mb-1">${unhtml(val.title)}</h6>
                                    <p class="list-detail"><span>${val.accountName}</span> <span>${i18n.get('pubTime')}${formatDateTime(val.createTime)}</span> <span>${i18n.get('lastreply')}${formatDateTime(val.lastUpdateTime)}</span></p>
                                </div>
                            </li>`
                })
                $('.question-list').append(vhtml)
                loadPage()
            } else {
                localStorage.removeItem('token')
                Swal.fire({
                    text: i18n.get('logTimeOut'),
                    showCancelButton: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    reverseButtons: true,
                    width: '16em',
                    confirmButtonColor: '#94cb82',
                    cancelButtonColor: '#d33',
                    confirmButtonText: i18n.get('confirm'),
                    cancelButtonText: i18n.get('cancel')
                }).then((result) => {
                    
                    if (result.isConfirmed) {
                        var url = window.location.href
                        window.localStorage.setItem('returnurl',url)
                        window.location.href = '../login/login.html'
                    }
                })
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
    }
    function unhtml(sHtml) {
        return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
    }


    function loadPage(){
        pageUtil.initPage('page', {
            totalCount: total, //总页数，一般从回调函数中获取。如果没有数据则默认为1页
            curPage: 1, //初始化时的默认选中页，默认第一页。如果所填范围溢出或者非数字或者数字字符串，则默认第一页
            showCount: 5, //分页栏显示的数量
            pageSizeList: [5, 10, 15, 20], //自定义分页数，默认[5,10,15,20,50]
            defaultPageSize: 10, //默认选中的分页数,默认选中第一个。如果未匹配到数组或者默认数组中，则也为第一个
            isJump: false, //是否包含跳转功能，默认false
            isPageNum: true, //是否显示分页下拉选择，默认false
            isPN: true, //是否显示上一页和下一面，默认true
            isFL: false, //是否显示首页和末页，默认true
            jump: function (curPage, pageSize) { //跳转功能回调，传递回来2个参数，当前页和每页大小。如果没有设置分页下拉，则第二个参数永远为0。这里的this被指定为一个空对象，如果回调中需用到this请自行使用bind方法
                $.ajax({
                    type: "POST",
                    url: proURL + "/forum/list",
                    dataType: "json",
                    data: {
                        "pagenum": curPage,
                        "pagecount": pageSize,
                        t: localStorage.getItem('token'),
                        lid: $.base64.decode(localStorage.getItem('acd'))
                    },
                    headers: {
                        "channel": "cloudasr"
                    },
                    success: function (res) {
                        if (res.errorcode != 1024) {
                            $(".question-list").html("");
                            var vhtml = "";
                            $.each(res.datalist, (idx, val) => {
                                vhtml += `<li class="media" onclick="questionDetail(${val.articleId})">
                                            <img src="../assets/img/head.png" class="align-self-center mr-3 list-img" alt="">
                                            <div class="media-body">
                                                <h6 class="mt-0 mb-1">${unhtml(val.title)}</h6>
                                                <p class="list-detail"><span>${val.accountName}</span> <span>${i18n.get('pubTime')}${formatDateTime(val.createTime)}</span> <span>${i18n.get('lastreply')}${formatDateTime(val.lastUpdateTime)}</span></p>
                                            </div>
                                        </li>`
                            })
                            $('.question-list').append(vhtml)
                        } else {
                            localStorage.removeItem('token');
                            Swal.fire({
                                text: i18n.get('logTimeOut'),
                                showCancelButton: true,
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                reverseButtons: true,
                                width: '16em',
                                confirmButtonColor: '#94cb82',
                                cancelButtonColor: '#d33',
                                confirmButtonText: i18n.get('confirm'),
                                cancelButtonText: i18n.get('cancel')
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    var url = window.location.href
                                    window.localStorage.setItem('returnurl',url)
                                    window.location.href = '../login/login.html'
                                }
                            })
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
    
            },
        });
    }
})
function questionDetail(val){
    window.location.href = './questiondetail.html?article='+val
}
$('.push-btn').click(function(){
    window.location.href = './questionnew.html'
})
