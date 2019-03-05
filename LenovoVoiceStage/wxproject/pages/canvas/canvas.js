Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    let promise1 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: 'https://voice.lenovomm.com/wx/images/ma.jpg',
        success: function(res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function(resolve, reject) {
      wx.getImageInfo({
        src: 'https://voice.lenovomm.com/wx/images/ban.png',
        success: function(res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareImg')
      ctx.setFontSize(22)
      ctx.setFillStyle('#333333');
      let str = 'We get to decide what our story is We get to decide what our story is';
      this.drawText(ctx, str, 30,490, 60,450);// 调用行文本换行函数

 




      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res[0].path, 164, 540, 210, 210)
      ctx.drawImage('../../' + res[1].path, 0, 0, 545, 400)

      ctx.setTextAlign('right')
      ctx.setFillStyle('#333333')
      ctx.setFontSize(22)
      // ctx.setLineWidth(10)
      ctx.fillText('生活就像冰淇淋，在融化之前好好享用', 400, 450)
      // ctx.fillText('We get to decide what our story is We get to decide what our story is', 400, 480)
      // ctx.font = "30px Verdana";
      ctx.stroke()
      ctx.draw()
    })
  },
  drawText: function (ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    let lineWidth = 0;
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为 文字大小20 + 2
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 22;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight;
  },


  /**
   * 生成分享图
   */
  share: function() {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 800,
      destWidth: 545,
      destHeight: 800,
      canvasId: 'shareImg',
      success: function(res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  // 关闭分享图
  imgclose:function(){
    var that = this;
    that.setData({
      hidden: true
    })
  },
  /**
   * 保存到相册
   */
  save: function() {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })

  }
})
