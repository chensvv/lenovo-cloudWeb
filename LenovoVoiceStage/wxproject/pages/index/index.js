//index.js
//获取应用实例
const app = getApp()
let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
var UTIL = require('../../utils/util.js');
var GUID = require('../../utils/GUID.js');
var NLI = require('../../utils/NLI.js');
var promise = require('../../utils/promise.util.js');
var i = 1;
//微信小程序新录音接口，录出来的是aac或者mp3，这里要录成mp3
const mp3Recorder = wx.getRecorderManager()
const mp3RecoderOptions = {
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 2,
  encodeBitRate: 48000,
  format: 'mp3',
  //frameSize: 50
}
var pageSelf = undefined;
var doommList = [];
class Doomm {
  constructor() {
    this.top = Math.ceil(Math.random() * 40);
    this.time = Math.ceil(Math.random() * 8 + 6);
    this.display = true;
    let that = this;
    setTimeout(function() {
      doommList.splice(doommList.indexOf(that), 1);
      doommList.push(new Doomm());

      pageSelf.setData({
        doommData: doommList
      })
    }, this.time * 1000)
  }
}

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    animationData1: {},
    animationData2: {},
    animationData3: {},
    ballTop1: 20,
    ballTop2: 10,
    ballTop3: 0,
    index1: 3,
    index2: 2,
    index3: 1,
    statusBarHeight: getApp().globalData.statusBarHeight,
    showView: true,
    isSpeaking: false, //是否正在说话
    show: false,
    hidden: true
  },
  showButton: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  pkrank: function(){
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  initDoomm: function() {
    doommList.push(new Doomm());
    doommList.push(new Doomm());
    doommList.push(new Doomm());
    this.setData({
      doommData: doommList
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
// 生成卡片
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../images/ma.jpg',
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../images/ban.png',
        success: function (res) {
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
      this.drawText(ctx, str, 30, 490, 60, 450);// 调用行文本换行函数
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
    // end
    pageSelf = this;
    this.initDoomm();
    //onLoad中为录音接口注册两个回调函数，主要是onStop，拿到录音mp3文件的文件名（不用在意文件后辍是.dat还是.mp3，后辍不决定音频格式）
    mp3Recorder.onStart(() => {
      UTIL.log('mp3Recorder.onStart()...')
    })
    mp3Recorder.onStop((res) => {
      UTIL.log('mp3Recorder.onStop() ' + res)
      const {
        tempFilePath
      } = res
      var urls = "https://voice.lenovomm.com/lasf/evaluate";
      UTIL.log('mp3Recorder.onStop() tempFilePath:' + tempFilePath)
      processFileUploadForAsr(urls, tempFilePath, this);
    })
  },
  // 卡片中文字换行
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
  share: function () {
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
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  // 关闭分享图
  imgclose: function () {
    var that = this;
    that.setData({
      hidden: true
    })
  },
  /**
   * 保存到相册
   */
  save: function () {
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
          success: function (res) {
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

  },
  onShow: function() {
    this.Animationcon(500);

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  Animationcon: function(translateXX) {
    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    });;
    this.setData({
      animationData1: this.animation.export(),
    });
    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    })
    this.setData({
      animationData2: this.animation.export(),
    });
    this.animation.translateY(0).translateX(0).opacity(1).rotate(0).step({
      duration: 10
    })
    this.setData({
      animationData3: this.animation.export(),
    });
    setTimeout(() => {
      this.setData({
        ballTop1: 20,
        ballLeft1: -340,
        ballWidth1: 680,
        index1: 3,

        ballTop2: 10,
        ballLeft2: -320,
        ballWidth2: 640,
        index2: 2,

        ballTop3: 0,
        ballLeft3: -302.5,
        ballWidth3: 605,
        index3: 1,
      })
    }, 500);
  },
  /**
   * 卡片1:
   * 上滑动下滑动动画
   */
  Animation1: function(translateXX) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    });
    this.animation = animation;

    if (translateXX > 0) {
      // this.animation.translateY(5000).rotate(0).translateY(translateXX).opacity(0).step();
      this.animation.translateY(translateXX).scale(0).opacity(0).step();
    }

    // this.animation.translateY(0).translateX(0).opacity(0).rotate(0).step({
    //   duration: 10
    // });

    this.setData({
      animationData1: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: 0,
        ballLeft1: -302.5,
        ballWidth1: 605,
        index1: 1,

        ballTop2: 20,
        ballLeft2: -340,
        ballWidth2: 680,
        index2: 3,

        ballTop3: 10,
        ballLeft3: -320,
        ballWidth3: 640,
        index3: 2,
      })
    }, 500);
  },

  /**
   * 卡片2:
   * 上滑动下滑动动画
   */
  Animation2: function(translateXX) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    });

    this.animation = animation;

    if (translateXX > 0) {
      this.animation.translateY(translateXX).scale(0).opacity(0).step().scale(1);
    }

    this.setData({
      animationData2: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: 10,
        ballLeft1: -320,
        ballWidth1: 640,
        index1: 2,

        ballTop2: 0,
        ballLeft2: -302.5,
        ballWidth2: 605,
        index2: 1,

        ballTop3: 20,
        ballLeft3: -340,
        ballWidth3: 680,
        index3: 3,
      })
    }, 500)
  },
  /**
   * 卡片3:
   * 上滑动下滑动动画
   */
  Animation3: function(translateXX) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
    });

    this.animation = animation;
    if (translateXX > 0) {
      this.animation.translateY(translateXX).scale(0).opacity(0).step().scale(1);
    }

    this.setData({
      animationData3: this.animation.export(),
    });

    setTimeout(() => {
      this.setData({
        ballTop1: 20,
        ballLeft1: -340,
        ballWidth1: 680,
        index1: 3,

        ballTop2: 10,
        ballLeft2: -320,
        ballWidth2: 640,
        index2: 2,

        ballTop3: 0,
        ballLeft3: -302.5,
        ballWidth3: 605,
        index3: 1,
      })
    }, 500);
  },
  touchdown: function() {
    //touchdown_mp3: function () {
    UTIL.log("mp3Recorder.start with" + mp3RecoderOptions)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    mp3Recorder.start(mp3RecoderOptions);
  },
  touchup: function() {
    //touchup_mp3: function () {
    UTIL.log("mp3Recorder.stop")
    this.setData({
      isSpeaking: false,
    })

    if (i == 1) {
      this.Animation1(500);
    } else if (i == 2) {
      this.Animation2(500);
    } else if (i == 3) {
      this.Animation3(500);
      wx.navigateTo({
        url: '../logs/logs',
      })
    }
    i++;
    if (i > 3) {
      i = 1;
    }
    console.log(i);
    mp3Recorder.stop();
  }
})
//麦克风帧动画 
function speaking() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function() {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}

//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面
function processFileUploadForAsr(urls, filePath, _this) {
  var ixid = new Date().getTime();
  var params = "dtp=lenovo%2FleSumsung%2Fandroid&ver=1.0.0&did=83102d26aaca24ba&uid=30323575" +
    "&stm=0&key=a&ssm=true&vdm=music&rvr=&sce=cmd&ntt=wifi&aue=speex-wb%3B7&auf=audio%2FL16%3Brate%3D16000" +
    "&dev=lenovo.rt.urc.lv.develop&ixid=" + ixid + "&pidx=1&over=1&rsts=0" +
    "&spts=0&fpts=0&cpts=0&lrts=0";
  wx.uploadFile({
    url: urls,
    filePath: filePath,
    name: 'voicedata',
    formData: {
      "ixid": ixid,
      "uid":526,
      "data":"We get to decide what our story is",
      "datatype":1,
      "pidx":1,
      "over":1,
      "token": "1111111111",
      "source":1
    },
    header: {
      'content-type': 'multipart/form-data',
      'channel': 'cloudasr',
      'lenovokey': 'LENOVO-VOICE-25ab92455t7d44eect68e04',
      'secretkey': '8667D0D0A150AC448525B137C237A10B'
    },
    success: function(res) {
      UTIL.log('res.data:' + res.data);
    },
    fail: function(res) {
      UTIL.log('error  res.data:' + res);
    }
  });
}