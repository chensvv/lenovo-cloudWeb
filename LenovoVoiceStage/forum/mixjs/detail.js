	$(function(){
        loadTop("information");
		function content(){
			    
                $.ajax({
				  type:"POST",
				  url:urlhead+"/lasf/forum/detail",
				  dataType:"json",
				  headers: {
						"channel" : "cloudasr",
						"lenovokey" : lenkey,
						"secretkey" : secrkey
		            },
				  data:{"articleid":id},
				  success:function(res){
	                $.each(res.datalist, function(idx,val) {
					var nowtime = formatDateTime(val.createTime);
	                     var el="";
	                    if(val.commentLevel == 1){	
	
	                            var nowtime = formatDateTime(val.createTime);
	                          
	                            el += "<div class='comment-info'><div class='comment-content-header'>作者：<span class='auth'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span><span><i class='glyphicon glyphicon-time'></i>"+nowtime+"</span></div><div class='comment-right' id=\""+val.parentCommentId+"\">";					
			                    el += "<p class='pid' hidden>"+val.parentCommentId+"</p><p class='valid' hidden>"+val.id+"</p><p class='content'>"+unhtml(val.content)+"</p><div class='comment-content-footer'><div class='rowtext'><div class='col-md-10'>";			
			                    el +=  "</div><div class='col-md-2'>"
			                    if(Username == val.accountName){
			                    	el += "<span class='del'>删除</span>"
			                    }else{
			                    	
			                    }
			                    
			                    el += "<span class='reply-btn'>回复</span></div></div></div><div class='reply-list'></div></div></div>"; 
						     
	                    }else  if(val.commentLevel == 2){                  	                   		
								 el += "<div class='reply'><p class='keyid' hidden>"+val.id+"</p><div><a href='javascript:void(0)' class='replyname'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</a>&nbsp;:&nbsp;<span>"+unhtml(val.content)+"</span></div>"+ "<p><span>"+nowtime+"</span>"
								 if(Username == val.accountName){
			                    	el += "<span class='delchild'>删除</span>"
			                     }else{
			                    	
			                     }
								 
								 el += "</p></div>";
						                       
	                    }
	                    $(".comment-list").append(el).find(".reply-btn").unbind().click(function(){
							if($(this).parent().parent().find(".replybox").length > 0){
								$(".replybox").remove();
							}else{
								replyClick($(this));
							}
						});
						var accountid = window.localStorage.getItem('accountid');
						$(".comment-list").find(".del").unbind().click(function(){
							
						    if (accountid=="" || accountid==null||accountid.length == 0) {
						        if(confirm("登陆后才能删除！")){
									window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
								    return;
						        
						        }else{
									return;
								}
						    }
							var valid = $(this).parent().parent().parent().parent().find(".valid").text();
							if(confirm("确认删除吗?")){
								$.ajax({
									type:"POST",
									url:urlhead+"/lasf/forum/delete",
									data:{"dataid":valid,"accountname":Username},
									headers: {
										"channel" : "cloudasr",
										"lenovokey" : lenkey,
										"secretkey" : secrkey
						            },
									success:function(data){
										 history.go(0);
									}
								});
							}else{
								return;
							}
						});
						$(".comment-list").find(".delchild").unbind().click(function(){
							if (accountid=="" || accountid==null||accountid.length == 0) {
						        if(confirm("登陆后才能删除！")){
									window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
								    return;
						        }else{
									return;
								}
						    }
							var keyid = $(this).parent().parent().find(".keyid").text();
							if(confirm("确认删除吗?")){
								$.ajax({
									type:"POST",
									url:urlhead+"/lasf/forum/delete",
									data:{"dataid":keyid,"accountname":Username},
									headers: {
										"channel" : "cloudasr",
										"lenovokey" : lenkey,
										"secretkey" : secrkey
						            },
									success:function(data){
										 history.go(0);
									}
								});
							}else{
								return;
							}
						});
						
	
					
				   });
	
				  }
		    });
		}
		
		
		var Username = window.localStorage.getItem('Username');
		var lenkey = window.localStorage.getItem('lenkey');
		var secrkey = window.localStorage.getItem('secrkey');
		//二级评论
		function replyClick(el){
			var accountid = window.localStorage.getItem('accountid');
		    if (accountid=="" || accountid==null||accountid.length == 0) {
		        if(confirm("登陆后才能回复！")){
					window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
				    return;
		        }else{
					return;
				}
		    }
		el.parent().parent().append("<div class='replybox'><textarea cols='80' rows='50' placeholder='来说几句吧......' class='mytextarea' ></textarea><span class='send'>发送</span></div>")
		.find(".send").click(function(){
			var content = $(this).prev().val();
			if(content != ""){
				var tit=$(".htitle").text();
	            var $content = $(this).parent().find(".mytextarea").val();
				var parentEl = $(this).parent().parent().parent().parent();
				var pid=parentEl.find(".pid").html();
				$.ajax({
					type:"POST",
					url:urlhead+"/lasf/forum/add?"+"datatype="+1,
				    dataType:'json',
				    data:{"title":tit,"content":$content,"accountname":Username,"articleid":id,"parentid":pid},
				    headers: {
				    	"channel" : "cloudasr",
						"lenovokey" : lenkey,
						"secretkey" : secrkey
		            },
				    success:function(data){
				    	history.go(0);
				    }
				});


			}else{
				alert("空内容");
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
		    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;      
		};    
		
		//过滤特殊字符
		function unhtml(sHtml) {
		 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
		}
		function getUrlParam(name) {
		   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		   var r = window.location.search.substr(1).match(reg); //匹配目标参数
		   if (r != null) return unescape(r[2]); return null; //返回参数值
		}
		  //接收URL中的参数articleId
		var id = getUrlParam('article');
		//文章展示
		$.ajax({
			type:'POST',
			url:urlhead+'/lasf/forum/detail',
			dataType:'json',
			data:{"articleid":id},
			headers: {
				"channel" : "cloudasr",
				"lenovokey" : lenkey,
				"secretkey" : secrkey
            },
			success:function(res,status){
			
			$.each(res.datalist, function(idx,val) {
				var nowtime = formatDateTime(val.createTime);
			//根据id获取详情数据				    
                    if(val.commentLevel == 0){
//                    var str = "<div>"+val.content+"</div>";
				      $(".htitle").text(val.title);
				      $(".newauthor").text(val.accountName.replace(/(\w{3})\w{4}/, '$1****'));
				      $(".newtime").text(nowtime);
				      $('.cont').text(val.content);
				    }
			   });
			}
		})
		    
        var Username = window.localStorage.getItem('Username');

		//一级评论展示
       content();
	    

//评论一级添加
		$("#comment").click(function(){
            if($("#content").val()==""){
            	alert("评论不能为空。");
            	return;
            }
			var accountid = window.localStorage.getItem('accountid');
		    if (accountid=="" || accountid==null||accountid.length == 0) {
		        if(confirm("登陆后才能评论！")){
					window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
				    return;
		        }else{
					return;
				}
		    }
		    
			var tit=$(".htitle").text();
			var $content = $("#content").val();
			$.ajax({
				type:'POST',
				url:urlhead+"/lasf/forum/add?"+"datatype="+1,
				dataType:'json',
				data:{"title":tit,"content":$content,"accountname":Username,"articleid":id,"parentid":0},
				headers: {
					"channel" : "cloudasr",
					"lenovokey" : lenkey,
					"secretkey" : secrkey
	            },
				success:function(res,status){
				   $(".mytextarea").val("");
				   $(".comment-list").html(" ");
				   //一级评论展示
					content();


				}
			})
		});
		
	


	
})