	$(function(){
		var Username = window.localStorage.getItem('un')
		function fn(){}
	$("#send").click(function(){
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
							window.location.href="../forum/questionlist.html"
						}else{
							Popup.Nalert("发帖失败，请稍后重试！")
						}
					}else{
						localStorage.clear();
						Popup.confirm("请登录后继续操作", fn)
					}
			  },error:function(err){
					
				}
			});
		})
		
	})