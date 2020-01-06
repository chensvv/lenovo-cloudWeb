function LenovoIdSyncLoginState(lenovoid_wust) {
    _club_login_status = true;
    take_st_login = true;
    $.ajax({
            type:"post",
            url:urlhead+"/lasf/logininfo",
            headers:{
                'channel':'cloudasr'
            },
            data:"securekey="+lenovoid_wust,
            dataType:'json',
            success:function(data){
                // console.log(data)
                if (typeof(data) == 'undefined')
            var data = {
                'status': 'error'
            };
            if (data.status == 'success') {
                window.localStorage.setItem('stk',$.base64.encode(data.secretkey));
                window.localStorage.setItem('acd',$.base64.encode(data.AccountID));
                window.localStorage.setItem('ln',$.base64.encode(data.name));
                window.localStorage.setItem('un',data.Username);
                window.localStorage.setItem('token',data.t)
                $.ajax({
                    type:"POST",
                    url:urlhead+"/lasf/userinfo",
                    data:{username:data.Username,lenovoid:data.AccountID,t:data.t},
                    success:function(res){
                        window.localStorage.setItem('lk',$.base64.encode(res.lenovokey));
                        window.localStorage.setItem('sk',$.base64.encode(res.secretkey));
                    }
                    
                });
                //window.location.reload();
            } else if (data.status == 'failed') {
//	                window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fproduct%2Frecognise.html';
                   window.location = 'https://passport.lenovo.com/wauthen/login?lenovoid.action=uilogin&lenovoid.realm=voice.lenovomm.com&lenovoid.cb=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html&lenovoid.lang=zh_CN&lenovoid.ctx=https%3A%2F%2Fvoice.lenovomm.com%3A8443%2FvoicePlatform%2Fwelcome%2Findex.html';
                   localStorage.clear()
            } else if (data.status == 'error') {

            }
            }
       });
       
}