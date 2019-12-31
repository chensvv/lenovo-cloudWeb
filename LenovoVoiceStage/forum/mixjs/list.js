	$(function(){
		loadTop("information");
		var Username = window.localStorage.getItem('Username');
		var accountid = window.localStorage.getItem('accountid');
		var lenkey = window.localStorage.getItem('lenkey');
		var secrkey = window.localStorage.getItem('secrkey');
		$.ajax({
			type:"POST",
			url:urlhead+"/lasf/userinfo",
			headers: {  
				"channel" : "cloudasr"
            },
            data:{"username":Username,"lenovoid":accountid},
			success:function(data){
				lenkey=data.lenovokey;
				secrkey=data.secretkey;
			}
			
		});
		
		if (accountid=="" || accountid==null||accountid.length == 0) {
			
	        if(confirm("登录后才能查看！")){
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
		    return y + '-' + m + '-' + d;      
		};  
		function unhtml(sHtml) {
		 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
		}
		var total="";
    $.ajax({
		  type:"POST",
		  url:"http://10.110.148.59:8082/lasf/forum/list",
		  dataType:"json",
		  data:{"pagenum":1,"pagecount":10},
		  headers: {
		  	  "channel" : "cloudasr",
					"lenovokey" : lenkey,
					"secretkey" : secrkey
		    },
		  async: false,
		  success:function(res){
				var num=res.datalist;
		  	total=res.total;
			 var str = "";
		   $.each(res.datalist, function(idx,val) {
		   	var nowtime = formatDateTime(val.createTime);
		   	var replytime = formatDateTime(val.lastUpdateTime);
		   	if(isNaN(parseInt(replytime))){
		        replytime="- -";
		    }else{
		        replytime=replytime;
				}
				// <div class='delg'><img src='../forum/images/delete.png'/></div>
		    str +="<div class=\"list-cell\">"
								 +"<img class='info_img' src='../forum/images/head.png'/>"
								 +"<div class='info_right'>"
								 +"<p><a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"+unhtml(val.title)+"</a></p>"
								 +"<div class='in_p'>"
			           +"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
			           +"<span class='mg'>"+'发布于'+nowtime+"</span>"
								 +"<span class='mg'>"+'最后回复于'+replytime+"</span>"
								 +"</div>"
								 +"</div>"
			           +"</div>";
			   });
		   $(".list-content").append(str);
		  }
		});
		

		
		
			
	
	pageUtil.initPage('page',{
		totalCount:total,//总页数，一般从回调函数中获取。如果没有数据则默认为1页
		curPage:1,//初始化时的默认选中页，默认第一页。如果所填范围溢出或者非数字或者数字字符串，则默认第一页
		showCount:5,//分页栏显示的数量
		pageSizeList:[5,10,15,20],//自定义分页数，默认[5,10,15,20,50]
		defaultPageSize:10,//默认选中的分页数,默认选中第一个。如果未匹配到数组或者默认数组中，则也为第一个
		isJump:false,//是否包含跳转功能，默认false
		isPageNum:true,//是否显示分页下拉选择，默认false
		isPN:true,//是否显示上一页和下一面，默认true
		isFL:false,//是否显示首页和末页，默认true
		jump:function(curPage,pageSize){//跳转功能回调，传递回来2个参数，当前页和每页大小。如果没有设置分页下拉，则第二个参数永远为0。这里的this被指定为一个空对象，如果回调中需用到this请自行使用bind方法
			$.ajax({
			  type:"POST",
			  url:urlhead+"/lasf/forum/list",
			  dataType:"json",
			  data:{"pagenum":curPage,"pagecount":pageSize},
			  headers: {
			  	  "channel" : "cloudasr",
						"lenovokey" : lenkey,
						"secretkey" : secrkey
			  },
			  success:function(res){
			  	$(".list-content").html("");
			   var str = "";
			   $.each(res.datalist, function(idx,val) {
			   	var nowtime = formatDateTime(val.createTime);
			   	var replytime = formatDateTime(val.lastUpdateTime);
			   	if(isNaN(parseInt(replytime))){
			        replytime="- -";
			    }else{
			        replytime=replytime;
			    }
					str +="<div class=\"list-cell\">"
								 +"<img class='info_img' src='../forum/images/head.png'/>"
								 +"<div class='info_right'>"
								 +"<p><a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"+unhtml(val.title)+"</a></p>"
								 +"<div class=\'in_p\'>"
			           +"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
			           +"<span class='mg'>"+'发布于'+nowtime+"</span>"
								 +"<span class='mg'>"+'最后回复于'+replytime+"</span>"
								 +"</div>"
								 +"</div>"
			           +"</div>";
			   });
			   $(".list-content").append(str);
			  }
			});
		
		},
	});
	
	
})