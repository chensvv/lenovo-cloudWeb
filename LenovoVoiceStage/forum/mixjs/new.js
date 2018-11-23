	$(function(){
		loadTop("information");
		
		$("#send").click(function(){
			if($(".title").val()==""||$(".text").val()==""){
				alert("标题或内容不能为空");
				return false;
			}
			var accountid = window.localStorage.getItem('accountid');
		    if (accountid=="" || accountid==null||accountid.length == 0) {
		        if(confirm("登陆后才能发表！")){
					window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
				    return;
		        }else{
					return;
				}

		    }
			var Username = window.localStorage.getItem('Username');
			var lenkey = window.localStorage.getItem('lenkey');
		    var secrkey = window.localStorage.getItem('secrkey');
			var title=$(".title").val();
			var text=$(".text").val();
			$.ajax({
			  type:"POST",
			  url:"/lasf/forum/add?"+"datatype="+0,
			  dataType:"json",
			  data:{"title":title,"content":text,"accountname":Username},
			  headers: {
						"lenovokey" : lenkey,
						"secretkey" : secrkey
		       },
			  success:function(res){
			  	$(".title").val("");
			  	$(".text").val("");
			  	if(res.dataid){
			  		alert("发表成功");
			  	}else{
			  		alert("账号错误");
			  	}
			  	
			  }

			});
		})
		
	})