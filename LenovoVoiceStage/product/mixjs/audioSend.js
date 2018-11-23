/*License (MIT)

 Copyright © 2013 Matt Diamond
 2016 Api.ai (author: Ilya Platonov)

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 DEALINGS IN THE SOFTWARE.
 */
var ixid = new Date().getTime();
var pidx = 1;

this.onmessage = function (e) {
//  console.info("e.data.over:" + e.data.over);
    sendBlob(e.data.buffer, e.data.over);
};
function sendBlob(blob, over) {
    var URL = "/lasf/asr";
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob, 'utf-8');

    reader.onload = function (e) {
        var buf = new Uint16Array(reader.result);

        if (pidx == 1) {
            var buf2 = [5, 0, 0, 0];
            var buf4 = new Uint16Array(buf.length + 4);
            buf4[0] = 5;
            buf4[1] = 0;
            buf4[2] = 0;
            buf4[3] = 0;
            for (i = 0; i < buf.length; i++) {
                buf4[i + 4] = buf[i];
            }
        }else{
            var buf4 = buf;
        }
//      console.info('buf.length:' + buf.length);
        var formData = new FormData();
//      console.info('ixid:' + ixid);
//      console.info('pidx:' + pidx);
//      console.info('over:' + over);

        var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.2&did=83102d26aaca24ba&uid=30323575" +
            "&stm=0&key=a&ssm=true&vdm=all&rvr=&sce=long&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
            "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=" + pidx++ + "&over=" + over + "&rsts=0" +
            "&spts=0&fpts=0&cpts=0&lrts=0";
        formData.append("param-data", params);
        formData.append("voice-data", new Blob([buf4]));

        var request = new XMLHttpRequest();
        request.open("POST", URL);

        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                //updateStatus(request.responseText);
                postMessage(request.responseText);
                // console.info(request.responseText);
            }
        };
        // var accountid = window.localStorage.getItem('accountid');
        // var lenkey = window.localStorage.getItem('lenkey');
        // var secrkey = window.localStorage.getItem('secrkey');
        //
           request.setRequestHeader('channel', 'cloudasr');
        // request.setRequestHeader('lenovokey', lenkey);
        // request.setRequestHeader('secretkey', secrkey);
        request.send(formData);
    }
}

