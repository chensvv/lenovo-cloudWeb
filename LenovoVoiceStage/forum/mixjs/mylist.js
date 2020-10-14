$(function(){
		var accountidd = window.localStorage.getItem('accountid');
		if (accountidd=="" || accountidd==null||accountidd.length == 0) {
	        if(confirm("登录后才能查看！")){
						window.location.href = "../login/login.html";
			    	return;
	        }else{
						localStorage.clear();
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
		var Username = window.localStorage.getItem('un');
		function unhtml(sHtml) {
		  return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
		}
	    
        $.ajax({
		  type:"POST",
		  url:urlhead+"/forum/list",
		  dataType:"json",
     	  data:{"pagecount":2000},
     	  headers: {
				"channel" : "cloudasr"
            },
		  success:function(res){
		  	
		  	var num=res.datalist;
			var sortime=num.sort(function (a, b) { return new Date(b.createTime).getTime() - new Date(a.createTime).getTime() });
			 var str = "";
			 console.log(res)
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
							url:urlhead+"/forum/delete",
							data:{"dataid":hid,"accountname":Username},
							headers: {
								"channel" : "cloudasr"
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