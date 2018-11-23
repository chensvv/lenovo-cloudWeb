function drawBuffer( width, height, context, data ) {
	//alert(data.length);
    var step = Math.ceil( data.length / width);
    var amp = (height);
    context.clearRect(0,0,width,height);
    for(var i=0; i < width; i++){
        context.fillStyle = "#3399ff";
        var min = 1.0;
        var max = -1.0;
        for (j=0; j<step; j++) {
            if(i*step +j  > data.length){
                break;
            }
            var datum = data[(i*step)+j]*2;
            if (datum < min)
                min = datum;
            if (datum > max)
                max = datum;
        }
        var y = (1+min)*amp;
        var hei=Math.max(1,(max-min)*amp);
//      context.fillRect(i,y,1,-hei);
         context.fillRect(i, 78, 1, hei);
         context.fillRect(i, 80, 1, -hei);
    }
}
