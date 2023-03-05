// pages/help/help.js

let that;
import sk from '../../common/StoryKeys.js'
import api from '../../common/api.js'
import su from '../../utils/StringUtils.js'
Page({

  /**
   * Page initial data
   */
  data: {
    list: [],
    projecObj: null,
    currentPage: 1,
    pageSize: 10,
  },


  // 触底加载更多
  onReachBottom() {
    that.loadList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    that.currentPage = 1;
    that.list = [];
    that.loadList();

    wx.stopPullDownRefresh();

  },
  created() {
    that = this;
  },
  onLoad() {
    that.list = [];
    that.currentPage = 1;
    that.pageSize = 10;
    that.loadList();
  },
  onShow() {
    var userInfo = wx.getStorageSync(sk.userInfo);
    that.userInfo = userInfo;
  },

  touchLoad() {
    that.currentPage = 1;
    that.list = [];
    that.loadList();
  },
  timeStampTurnTime(str) {
    var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    return Y + M + D;
  },
  loadList() {

    var loginSataus = wx.getStorageSync(sk.loginStatus);
    if (loginSataus) {
      api.post({
        currentPage: that.currentPage,
        pageSize: that.pageSize
      }, api.projectHelpList).then(res => {

        if (res.code == 200) {
          if (res.data.length > 0) {
            that.list = that.list.concat(res.data);
            that.currentPage++;
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      });
    } else {

    }

  },
  submit() {
    this.$refs.popup.close();
    wx.showToast({
      title: "提交成功",
      icon: 'none',
      duration: 2000
    })
  },
  sliderChange(e) {},
  toProjecDetail(e) {
    wx.navigateTo({
      url: '/pages/help/helpProjectDetail/helpProjectDetail?obj=' + encodeURIComponent(JSON
        .stringify(e))
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})