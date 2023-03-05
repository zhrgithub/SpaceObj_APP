// pages/addEmailPhoneNumber/addEmailPhoneNumber.js
var that;
import sk from '../../common/StoryKeys.js'
import api from '../../common/api.js'
import su from '../../utils/StringUtils.js'
import nick_Name from '../../utils/nickName.js'
import config from '../../common/config.js'

Page({

  /**
   * Page initial data
   */
  data: {
    photoUrl: '../../static/photo.jpg',
    selectPhotoList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ipTerritory: "未知",
    nickName: "未设置",
    phoneNumber: "",
    account: "未知",
    realNameStatus: '未实名',
    email: '',
    online: 0,
  },

  onShow() {
    var otherInfo = wx.getStorageSync(sk.otherInfo);
    if (su.isBlank(otherInfo)) {
      // 获取其它
      api.post({}, api.getOther).then(res => {
        console.log(res)
        var data = res.data;
        var version = res.data.version;
        // 判断后端传递过来的版本号和当前APP的版本号是否一致，如果不一致，就设置上线状态为0，一致则设置为1
        if (version == config.system_version) {
          data.online = 1;
        } else {
          data.online = 0;
        }
        that.online = data.online;
        wx.setStorage({
          key: sk.otherInfo,
          data: data,
        })
      })
    } else {
      console.log(otherInfo)
      that.online = otherInfo.online;
    }
    if (that.online == 0) {
      wx.switchTab({
        url: '/pages/project/project'
      })
    }
    this.timer = setTimeout(() => {
      var userInfo = wx.getStorageSync(sk.userInfo);
      that.email = su.isBlank(userInfo.email) ? that.email : userInfo.email;
      that.phoneNumber = su.isBlank(userInfo.phoneNumber) ? that.phoneNumber : userInfo
        .phoneNumber;


    }, 200)

  },
  created() {
    that = this;
  },

  setEmail(e) {
    that.email = e.detail.value;
  },
  setPhoneNumber(e) {
    that.phoneNumber = e.detail.value;
  },


  saveUserInfo() {
    var nickName = nick_Name.getNickName();


    if (that.phoneNumber.length == 0) {
      uni.showToast({
        icon: 'none',
        title: "设置QQ/微信/手机号"
      })
      return;
    }

    if (that.email.length == 0 || that.email == '未设置') {
      uni.showToast({
        icon: 'none',
        title: '未设置邮箱'
      })
      return;
    }
    // 设置用户的邮箱和手机号
    api.post({
      email: that.email,
      phoneNumber: that.phoneNumber,
      ipTerritory: uni.getStorageSync(sk.ipTerritory),
      nickName: nickName
    }, api.customerUpdateUserInfo).then(res => {

      if (res.code == 200) {
        // 设置用户信息
        uni.setStorage({
          key: sk.userInfo,
          data: res.data
        })
        // 转到上一页
        uni.navigateBack();
      } else {
        uni.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})