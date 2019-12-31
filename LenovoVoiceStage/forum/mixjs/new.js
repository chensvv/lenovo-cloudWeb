	$(function(){
		loadTop("information");
	$("#send").click(function(){
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
			  url:'http:10.110.148.59:8082/lasf/forum/add?datatype=0&title='+title+'&content='+text+'&accountname='+Username,
			  dataType:"json",
			  headers: {
			  	  "channel" : "cloudasr",
						"lenovokey" : lenkey,
						"secretkey" : secrkey
		       },
			  success:function(res){
			  	$(".title").val("");
			  	$(".text").val("");
			  	if(res.dataid){
						alert("发表成功");
						// window.location.href="../forum/questionlist.html"
			  	}else{
			  		alert(res.error);
			  	}
			  	
			  }

			});
		})
		
	})