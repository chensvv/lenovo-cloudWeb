	$(function () {
		var Username = window.localStorage.getItem('un');
		var accountid = $.base64.decode(window.localStorage.getItem('acd'));
		var accountidd = window.localStorage.getItem('acd')
		var token = window.localStorage.getItem('token')
		if ($(".mytextarea").val() == "") {
			$('#comment').attr('disabled', 'disabled');
			$('#comment').addClass('No_send')
		}
		$('.mytextarea').on("input propertychange", function () {
			if ($(".mytextarea").val() != "") {
				$("#comment").removeAttr("disabled");
				$('#comment').removeClass('No_send')
			} else {
				$('#comment').attr('disabled', 'disabled');
				$('#comment').addClass('No_send')
			}
		})

		$(".qu_btn").click(function () {
			$('html,body').animate({
				scrollTop: $('#eui-main-footer').offset().top
			});
		});
		$('.back_arrows').click(function () {
			history.back(-1)
		})
		$(function () {
			var user = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
			if (user) {
				$('.mobile_div').css({
					"display": "block"
				})
				$(".navbar").css({
					"display": "none"
				})
				$(".posi_nav").css({
					"display": "none"
				});
			} else {
				$('.qu_btn').removeClass('mobile_btn')
				$('.mobile_div').css({
					"display": "none"
				})
			}

			$(window).scroll(function () {
				// 滚动条距离顶部的距离 大于 100px时
				if ($(window).scrollTop() >= 100) {
					$(".navbar").css({
						"display": "none"
					})
					if (!user) {
						$(".posi_nav").css({
							"display": "flex"
						});
					}

				} else {
					if (user) {
						$(".navbar").css({
							"display": "none"
						})
						$(".mobile_div").css({
							"display": "block"
						});
					} else {
						$(".navbar").css({
							"display": "block"
						})
					}
					$(".posi_nav").css({
						"display": "none"
					});
				}
			})

		})

// function sortRule(a,b) {
//     return a.id - b.id;
// }
function fn(){}
		function content(){
        $.ajax({
				  type:"POST",
				  url:urlhead+"/lasf/forum/detail",
				  dataType:"json",
				  headers: {
						"channel" : "cloudasr"
		            },
				  data:{"articleid":id,lid:accountid,t:token},
				  success:function(res){
					  if(res.errorcode !=1024){
						//   res.datalist = res.datalist.sort(sortRule)
						$.each(res.datalist, function (idx, val) {
							var reply_length = res.datalist.length - 1
							$('.reply_length').text(reply_length)
						var nowtime = formatDateTime(val.createTime);
							 var el="";
							var arr = document.getElementsByClassName('comment-info').length+1;
							if(val.commentLevel == 2){
								el+= "<div class='reply'><p class='keyid' hidden>"+val.id+"</p><div><a href='javascript:void(0)' class='replyname'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</a>&nbsp;:&nbsp;<span>"+unhtml(val.content)+"</span></div>"+ "<p><span>"+nowtime+"</span>"
								if(geTel(Username) == val.accountName){
									if(getCookie('grycan.cn.bLang') =='english'){
										el += "<span class='delchild'>delete</span>"
									}else{
										el += "<span class='delchild'>删除</span>"
									}
								}else{
	
								}

								el += "</p></div>";
								
					   }else if(val.commentLevel == 1){
									var nowtime = formatDateTime(val.createTime);
									el += "<div class='comment-info'><div class='comment-content-header'><span class='floor'>#"+arr+"</span><span class='auth'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span></div><div class='comment-right' id=\""+val.parentCommentId+"\">";					
									el += "<p class='pid' hidden>"+val.parentCommentId+"</p><p class='valid' hidden>"+val.id+"</p><p class='content'>"+unhtml(val.content)+"</p><div class='comment-content-footer'><div class='rowtext'><div class='col-dels'>";			
									el +=  "</div><div class='col-update'>"
									if(geTel(Username) == val.accountName){
										if(getCookie('grycan.cn.bLang') =='english'){
											el += "<span class='del'>delete</span>"
										}else{
											el += "<span class='del'>删除</span>"
										}
									}else{
	
									}
									if(getCookie('grycan.cn.bLang') =='english'){
										el += "<span class='reply-time'>"+nowtime+"</span><span class='reply-btn'>reply</span></div></div></div><div class='reply-list'></div></div></div>"; 
									}else{
										el += "<span class='reply-time'>"+nowtime+"</span><span class='reply-btn'>回复</span></div></div></div><div class='reply-list'></div></div></div>"; 
									}
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
								function del(){
									$.ajax({
										type: "POST",
										url: urlhead + '/lasf/forum/delete',
										data: {
											"dataid": valid,
											"accountname": Username,
											lid: accountid,
											t: token
										},
										headers: {
											"channel": "cloudasr"
										},
										success: function (data) {
											if (data.errorcode != 1024) {
												history.go(0);
											} else {
												localStorage.clear();
												if(getCookie('grycan.cn.bLang') =='english'){
													Popup.confirm("Login timeout！", fn)
												}else{
													Popup.confirm("登录超时，请重新登录！", fn)
												}
												
											}
										}
									});
								}
								if(getCookie('grycan.cn.bLang') =='english'){
									Popup.Nconfirm("Are you sure to delete?", del)
								}else{
									Popup.Nconfirm("确认删除吗？", del)
								}
								
								// if (confirm("确认删除吗?")) {
								// 	$.ajax({
								// 		type: "POST",
								// 		url: urlhead + '/lasf/forum/delete',
								// 		data: {
								// 			"dataid": valid,
								// 			"accountname": Username,
								// 			lid: accountid,
								// 			t: token
								// 		},
								// 		headers: {
								// 			"channel": "cloudasr"
								// 		},
								// 		success: function (data) {
								// 			if (data.errorcode != 1024) {
								// 				history.go(0);
								// 			} else {
								// 				localStorage.clear();
								// 				Popup.confirm("请登录后继续操作！", fn)
								// 			}
								// 		}
								// 	});
								// } else {
								// 	return;
								// }
							});
							$(".comment-list").find(".delchild").unbind().click(function(){
								var keyid = $(this).parent().parent().find(".keyid").text();
								function delChild(){
									$.ajax({
										type: "POST",
										url: urlhead + "/lasf/forum/delete",
										data: {
											"dataid": keyid,
											"accountname": Username,
											lid: accountid,
											t: token
										},
										headers: {
											"channel": "cloudasr"
										},
										success: function (data) {
											if (data.errorcode != 1024) {
												history.go(0);
											} else {
												localStorage.clear();
												if(getCookie('grycan.cn.bLang') =='english'){
													Popup.confirm("Login timeout！", fn)
												}else{
													Popup.confirm("登录超时，请重新登录！", fn)
												}
											}

										}
									});
								}
								if(getCookie('grycan.cn.bLang') =='english'){
									Popup.Nconfirm("Are you sure to delete?", delChild)
								}else{
									Popup.Nconfirm("确认删除吗？", delChild)
								}
								
								// if (confirm("确认删除吗?")) {
								// 	$.ajax({
								// 		type: "POST",
								// 		url: urlhead + "/lasf/forum/delete",
								// 		data: {
								// 			"dataid": keyid,
								// 			"accountname": Username,
								// 			lid: accountid,
								// 			t: token
								// 		},
								// 		headers: {
								// 			"channel": "cloudasr"
								// 		},
								// 		success: function (data) {
								// 			if (data.errorcode != 1024) {
								// 				history.go(0);
								// 			} else {
								// 				localStorage.clear();
								// 				Popup.confirm("登录超时，请重新登录！", fn)
								// 			}

								// 		}
								// 	});
								// } else {
								// 	return;
								// }
							});
						});
					} else {
						localStorage.clear();
						if(getCookie('grycan.cn.bLang') =='english'){
							Popup.confirm("Login timeout！", fn)
						}else{
							Popup.confirm("登录超时，请重新登录！", fn)
						}
					}
				},
				error: function (err) {
					
				}
			});
		}



		//二级评论
		function replyClick(el) {
			var secondTeply
			if(getCookie('grycan.cn.bLang') =='english'){
				secondTeply = el.parent().parent().append("<div class='replybox'><textarea cols='80' rows='50' placeholder='Say something......' class='comment_textarea' ></textarea><span class='send'>send</span></div>")
			}else{
				secondTeply = el.parent().parent().append("<div class='replybox'><textarea cols='80' rows='50' placeholder='来说几句吧......' class='comment_textarea' ></textarea><span class='send'>发送</span></div>")
			}
			
			secondTeply.find(".send").click(function () {
					var content = $(this).prev().val();
					if (content != "") {
						var tit = $(".htitle").text();
						var $content = $(".comment_textarea").val();
						var parentEl = $(this).parent().parent().parent().parent();
						var pid = parentEl.find(".pid").html();
						$.ajax({
							type: "POST",
							url: urlhead + '/lasf/forum/add?datatype=1',
							dataType: 'json',
							data: {
								"title": tit,
								"content": $content,
								"accountname": Username,
								"articleid": id,
								"parentid": pid,
								lid: accountid,
								t: token
							},
							headers: {
								"channel": "cloudasr"
							},
							success: function (data) {
								if (data.errorcode != 1024) {
									history.go(0);
								} else {
									localStorage.clear();
									if(getCookie('grycan.cn.bLang') =='english'){
										Popup.confirm("Login timeout！", fn)
									}else{
										Popup.confirm("登录超时，请重新登录！", fn)
									}
								}

							},
							error: function (err) {
								
							}
						});


					} else {
						if(getCookie('grycan.cn.bLang') =='english'){
							Popup.Nalert("Comment cannot be empty!")
						}else{
							Popup.Nalert("评论不能为空！")
						}
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
		function geTel(tel){
				return tel.substring(0, 3)+"****"+tel.substr(tel.length-4);
		}
		// 手机号加密
		function geTel(tel){
				var reg = /^(\d{3})\d{4}(\d{4})$/;  
				return tel.replace(reg, "$1****$2");
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
		$.ajax({
			type: 'POST',
			url: urlhead + '/lasf/forum/detail',
			dataType: 'json',
			data: {
				"articleid": id,
				lid: accountid,
				t: token
			},
			headers: {
				"channel": "cloudasr"
			},
			success: function (res, status) {
				if (res.errorcode != 1024) {
					$.each(res.datalist, function (idx, val) {
						var nowtime = formatDateTime(val.createTime);
						//根据id获取详情数据   
						if (val.commentLevel == 0) {
							//                    var str = "<div>"+val.content+"</div>";
							$(".htitle").text(val.title);
							$(".posi_title").text(val.title);
							$(".title_arrows").text(val.title);
							$('.reply_arrows').text(val.title)
							$(".newauthor").text(val.accountName.replace(/(\w{3})\w{4}/, '$1****'));
							$(".newtime").text(nowtime);
							$('.cont').text(val.content);
						}
					});
				} else {
					localStorage.clear();
					if(getCookie('grycan.cn.bLang') =='english'){
						Popup.confirm("Login timeout！", fn)
					}else{
						Popup.confirm("登录超时，请重新登录！", fn)
					}
				}
			},
			error: function (err) {

			}
		})


		//一级评论展示
		content();


		//评论一级添加
		$("#comment").click(function () {
			if ($("#content").val() == "") {
				if(getCookie('grycan.cn.bLang') =='english'){
					Popup.Nalert("Comment cannot be empty!")
				}else{
					Popup.Nalert("评论不能为空！")
				}
				return;
			}
			var tit = $(".htitle").text();
			var tit2 = $('.reply_arrows').text()
			var $content = $("#content").val();
			$.ajax({
				type: 'POST',
				url: urlhead + '/lasf/forum/add?datatype=1&content=' + $content + '&accountname=' + Username + '&articleid=' + id + '&parentid=0&title=' + tit || tit2,
				data: {
					lid: accountid,
					t: token
				},
				dataType: 'json',
				headers: {
					"channel": "cloudasr"
				},
				success: function (res, status) {
					if (res.errorcode != 1024) {
						$(".mytextarea").val("");
						$(".comment-list").html(" ");
						//一级评论展示
						content();
					} else {
						localStorage.clear();
						if(getCookie('grycan.cn.bLang') =='english'){
							Popup.confirm("Login timeout！", fn)
						}else{
							Popup.confirm("登录超时，请重新登录！", fn)
						}
					}
				},
				error: function (err) {

				}
			})
		});
	})


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