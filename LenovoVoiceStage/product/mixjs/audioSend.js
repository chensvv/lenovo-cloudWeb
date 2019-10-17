var ixid = new Date().getTime();
var pidx = 1;
           
this.onmessage = function (e) {
    sendBlob(e.data.urlheader,e.data.buffer, e.data.over,e.data.lenkey,e.data.secrkey);
};
function sendBlob(urlheader,blob, over,lenkey,secrkey) {
//  var URL = "/lasf/asr";
    var URL = urlheader;
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob, 'utf-8');
    
    reader.onload = function (e) {
        var buf = new Uint16Array(reader.result);
        if (pidx == 1) {
            var buf2=[];
	        buf2.unshift(5,0,0,0);
            var buf4=new Uint16Array(buf2);
        }else{
            var buf4 = buf;
        }
        console.log(over)
        var formData = new FormData();
        var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
            "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=iat&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over + "&rsts=0" +
            "&spts=0&fpts=0&cpts=0&lrts=0";
        formData.append("param-data", params);
        formData.append("voice-data", new Blob([buf4]));
        var request = new XMLHttpRequest();
        request.open("POST", URL);

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                postMessage(request.responseText);

            }
        };
        request.setRequestHeader('channel', 'cloudasr');
        request.setRequestHeader('lenovokey', lenkey);
        request.setRequestHeader('secretkey', secrkey);
        request.send(formData);  
    }
}



