let touchDotX = 0; //X按下时坐标
let touchDotY = 0; //y按下时坐标
Page({
  data: {
    tab: 0
  },
  onLoad(options) {},
  tab_slide: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ tab: e.detail.current });
  },
  tab_click: function (e) {//点击tab切换
    var that = this;
    if (that.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  }

})