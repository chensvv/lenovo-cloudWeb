/**
 * Created by liuyang on 2017/9/4.
 */

function user_login(){
    var fore_url = session.refer;
    var user_id = document.getElementById('usermail');

    if(typeof user_id != 'undefined' && user_id !=null && user_id!=''){
        session.setItem('user_email',user_id);
    }

    if(typeof fore_url == 'undefined'){
        window.location.href =  "../welcome/index.html";
    }else{
        window.location.href = fore_url;
    }


}