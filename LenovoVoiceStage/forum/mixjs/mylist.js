$(function(){
		loadTop("information");
		var accountid = window.localStorage.getItem('accountid');
		if (accountid=="" || accountid==null||accountid.length == 0) {
	        if(confirm("登陆后才能查看！")){
				window.location.href = "https://passport.lenovo.com/wauthen2/gateway?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%2FvoicePlatform%2Fwelcome%2Findex.html";
			    return;
	        }else{
				return;
			}

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
		var Username = window.localStorage.getItem('Username');
		var lenkey = window.localStorage.getItem('lenkey');
		var secrkey = window.localStorage.getItem('secrkey');
		function unhtml(str) {
          return str ? str.replace(/[<">']/g, (a) => {
              return {
                  '<': '&lt;',
                  '"': '&quot;',
                 '>': '&gt;',
                 "'": '&#39;'
             }[a]
         }) : '';
     }
	    
        $.ajax({
		  type:"POST",
		  url:"/lasf/forum/list",
		  dataType:"json",
     	  data:{"pagecount":2000},
		  success:function(res){
		  	
		  	var num=res.datalist;
			var sortime=num.sort(function (a, b) { return new Date(b.createTime).getTime() - new Date(a.createTime).getTime() });
		   var str = "";
		   $.each(res.datalist, function(idx,val) {
			   	var nowtime = formatDateTime(val.createTime);
			   	var replytime = formatDateTime(val.lastUpdateTime);
			   	if(val.accountName==Username){
			   		var tit=val.title;
			   		if(isNaN(parseInt(replytime))){
				        replytime="- -";
				    }else{
				        replytime=replytime;
				    }
			   		str +="<tr class=\"list-cell\">"
			   		    +"<td hidden><span class='hid'>"+val.id+"</span></td>"
			           +"<td><a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"+unhtml(tit)+"</a></td>"
			           +"<td class='mg'>"+unhtml(val.accountName)+"</td>"		           
			           +"<td class='mg'><span>"+nowtime+"</span></td>"
			           +"<td class='mg'>"+replytime+"</td>"
			           +"<td class='mg'><span class='medel'>删除</span></td>"
			           +"</tr>";
			   };
			  
		   });
		   	
		     $("tbody").html(str);
		     $(".list-content").find(".medel").unbind().click(function(){
					var hid = $(this).parent().siblings().find(".hid").text();
					if(confirm("确认删除吗?")){
						$.ajax({
							type:"POST",
							url:"/lasf/forum/delete",
							data:{"dataid":hid,"accountname":Username},
							headers: {
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
		  }
		});
		
		

	})