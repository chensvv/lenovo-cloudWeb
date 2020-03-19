	$(function(){
		loadTop("information");
		var Username = window.localStorage.getItem('un')
	$("#send").click(function(){
			var accountid = $.base64.decode(window.localStorage.getItem('acd'))
			var accountidd = window.localStorage.getItem('acd')
		    if (accountidd=="" || accountidd==null||accountidd.length == 0) {
		        if(confirm("登录后才能发表！")){
							window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
							localStorage.clear(); 
				    	return;
		        }else{
							localStorage.clear(); 
							return;
						}
		    }
			var title=$(".title").val();
			var text=$(".text").val();
			$.ajax({
			  type:"POST",
				url:urlhead+'/lasf/forum/add?datatype=0&title='+title+'&content='+text+'&accountname='+Username,
				data:{
					t:window.localStorage.getItem('token'),
					lid:$.base64.decode(window.localStorage.getItem('acd'))
				},
			  dataType:"json",
			  headers: {
			  	  "channel" : "cloudasr"
		       },
			  success:function(res){
					if(res.errorcode != 1024){
						$(".title").val("");
						$(".text").val("");
						if(res.dataid){
							alert("发表成功");
							window.location.href="../forum/questionlist.html"
						}else{
							alert(res.error);
						}
					}else{
						if(confirm("登录超时，请重新登录")){
							window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
							localStorage.clear(); 
				    	return;
		        }else{
							localStorage.clear(); 
							return;
						}
					}
			  },error:function(err){
					alert('服务器错误')
				}
			});
		})
		
	})