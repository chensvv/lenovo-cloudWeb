function LenovoIdSyncLoginState(lenovoid_wust) {
    _club_login_status = true;
    take_st_login = true;
    $.ajax({
            type:"get",
            url:urlhead+"/lasf/logininfo",
            headers:{
                'channel':'cloudasr'
            },
            data:"securekey="+lenovoid_wust,
            dataType:'json',
            success:function(data){
                if (typeof(data) == 'undefined')
            var data = {
                'status': 'error'
            };
            if (data.status == 'success') {
                document.getElementById("lenovo-user-name").innerHTML = data.Username + '<span class=\"caret\"></span>';
                window.localStorage.setItem('secretkey',data.secretkey);
                window.localStorage.setItem('accountid',data.AccountID);
                window.localStorage.setItem('lenovoname',data.name);
                window.localStorage.setItem('Username',data.Username);
                $.ajax({
                    type:"POST",
                    url:urlhead+"/lasf/userinfo",
                    headers: {  
                        "channel" : "cloudasr"
                    },  
                    data:{"username":data.Username,"lenovoid":data.AccountID},
                    success:function(data){
                        window.localStorage.setItem('lenkey',data.lenovokey);
                        window.localStorage.setItem('secrkey',data.secretkey);
                    }
                    
                });
                //window.location.reload();
            } else if (data.status == 'failed') {
//	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html';
                   window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
            } else if (data.status == 'error') {

            }
            }
       });
       
}