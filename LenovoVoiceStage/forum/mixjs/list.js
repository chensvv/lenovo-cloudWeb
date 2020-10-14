	$(function(){
		var Username = window.localStorage.getItem('un');
		var accountid = $.base64.decode(window.localStorage.getItem('acd'))
		var accountidd = window.localStorage.getItem('acd')
		var token = window.localStorage.getItem('token')
		var total=""
		function fn(){}
		if(token == '' || token == null || token == undefined){
			if(getCookie('grycan.cn.bLang') =='english'){
				Popup.confirm("Please log in first！", fn)
			}else{
				Popup.confirm("请登录后继续操作！", fn)
			}
		}else{
			$.ajax({
				type:"POST",
				url:urlhead+"/forum/list",
				dataType:"json",
				data:{
					"pagenum":1,
					"pagecount":10,
					t:token,
					lid:accountid
				},
				headers: {
						"channel" : "cloudasr"
					},
				async: false,
				success:function(res){
					if(res.errorcode !=1024){
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
							if(getCookie('grycan.cn.bLang') == 'english'){
								str +="<a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"
										+"<div class=\"list-cell\">"
										+"<img class='info_img' src='../forum/images/head.png'/>"
										+"<div class='info_right'>"
										+"<p><span>"+unhtml(val.title)+"</span></p>"
										+"<div class=\'in_p\'>"
										+"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
										+"<span class='mg'>"+'<span>release：</span>'+nowtime+"</span>"
										+"<span class='mg'>"+'<span>Last reply：</span>'+replytime+"</span>"
										+"</div>"
										+"</div>"
										+"</div>"
										+"</a>"
							}else{
								str +="<a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"
										+"<div class=\"list-cell\">"
										+"<img class='info_img' src='../forum/images/head.png'/>"
										+"<div class='info_right'>"
										+"<p><span>"+unhtml(val.title)+"</span></p>"
										+"<div class=\'in_p\'>"
										+"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
										+"<span class='mg'>"+'<span>发布于：</span>'+nowtime+"</span>"
										+"<span class='mg'>"+'<span>最后回复于：</span>'+replytime+"</span>"
										+"</div>"
										+"</div>"
										+"</div>"
										+"</a>"
							}
							});
						$(".list-content").append(str);
					}else{
						localStorage.clear();
						if(getCookie('grycan.cn.bLang') =='english'){
							Popup.confirm("Login timeout！", fn)
						}else{
							Popup.confirm("登录超时，请重新登录", fn)
						}
					}
					
				},error:function(err){
					
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
		    return y + '-' + m + '-' + d +' '+h+':'+minute;      
		};  
		function unhtml(sHtml) {
		 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
		}
		
   
		

		
		
			
	
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
			  url:urlhead+"/forum/list",
			  dataType:"json",
			  data:{
					"pagenum":curPage,
					"pagecount":pageSize,
					t:token,
					lid:accountid
				},
			  headers: {
			  	  "channel" : "cloudasr"
			  },
			  success:function(res){
					if(res.errorcode != 1024){
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
							if(getCookie('grycan.cn.bLang') == 'english'){
								str +="<a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"
										+"<div class=\"list-cell\">"
										+"<img class='info_img' src='../forum/images/head.png'/>"
										+"<div class='info_right'>"
										+"<p><span>"+unhtml(val.title)+"</span></p>"
										+"<div class=\'in_p\'>"
										+"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
										+"<span class='mg'>"+'<span>release：</span>'+nowtime+"</span>"
										+"<span class='mg'>"+'<span>Last reply：</span>'+replytime+"</span>"
										+"</div>"
										+"</div>"
										+"</div>"
										+"</a>"
							}else{
								str +="<a href='questiondetail.html?article="+val.articleId+"' class='lp_li_a'>"
										+"<div class=\"list-cell\">"
										+"<img class='info_img' src='../forum/images/head.png'/>"
										+"<div class='info_right'>"
										+"<p><span>"+unhtml(val.title)+"</span></p>"
										+"<div class=\'in_p\'>"
										+"<span class='mg'>"+unhtml(val.accountName).replace(/(\w{3})\w{4}/, '$1****')+"</span>"
										+"<span class='mg'>"+'<span>发布于：</span>'+nowtime+"</span>"
										+"<span class='mg'>"+'<span>最后回复于：</span>'+replytime+"</span>"
										+"</div>"
										+"</div>"
										+"</div>"
										+"</a>"
							}
							
						});
						$(".list-content").append(str);
					}else{
						localStorage.clear();
						if(getCookie('grycan.cn.bLang') =='english'){
							Popup.confirm("Login timeout！", fn)
						}else{
							Popup.confirm("登录超时，请重新登录", fn)
						}
					}
			  	
			  },error:function(err){
					
				}
			});
		
		},
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