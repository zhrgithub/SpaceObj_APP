import api from '../../common/api.js'
import sk from '../../common/StoryKeys.js'
import su from '../../utils/StringUtils.js'
import config from '../../common/config.js'
Page({

  /**
   * Page initial data
   */
  data: {

    loginStatus: false,
    photoUrl: '/static/photo.png',
    nickName: '昵称未设置',
    ipTerritory: '广东 深圳',
    downloadUrl: "www.baidu.com",
    wechat: "spaceobj",
    userType: "user",
    invitationValue: 0,
    realNameStatus: 0,
    userId: null,
    online: 0,
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
  onLoad() {

  },
  onShow() {
    var that = this;
    that.timer = setTimeout(() => {
      console.log(sk.loginStatus);
      // 第一步：加载用户基本信息
      that.setData({
        loginStatus: wx.getStorageSync(sk.loginStatus)
      })

      var userInfo = wx.getStorageSync({
        key: sk.userInfo
      })
      if (that.data.loginStatus) {
        that.getUserInfo(userInfo);
      }
      // 第二步加载其它信息
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
          that.setData({
            online: data.online
          })
          wx.setStorage({
            key: sk.otherInfo,
            data: data,
          })
        })
      } else {
        console.log(otherInfo)
        that.setData({
          online: otherInfo.online
        })
      }

      otherInfo = wx.getStorageSync(sk.otherInfo);
      that.setData({
        downloadUrl: otherInfo.downloadUrl,
        wechat: otherInfo.wechat
      })
    }, 200)
  },
  friendHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    })
  },
  myRelease() {
    wx.navigateTo({
      url: '/pages/release/release'
    })
  },
  // 根据用户登录账户刷新用户基本信息
  getUserInfo(userInfo) {
    var that = this;
    api.post({}, api.getUserInfo).then(res => {
      userInfo = res.data;
      if (res.code == 200) {
        // 刷新缓存
        wx.setStorage({
          key: sk.userInfo,
          data: res.data
        })
        userInfo = res.data;
      }
      if (userInfo != '') {
        console.log(userInfo)
        that.setData({
          userType: su.isBlank(userInfo.userType) ? '' : userInfo.userType,
          photoUrl: su.isBlank(userInfo.photoUrl) ? "/static/photo.png" : userInfo.photoUrl,
          nickName: su.isBlank(userInfo.nickName) ? that.nickName : userInfo.nickName,
          invitationValue: userInfo.invitationValue,
          realNameStatus: userInfo.realNameStatus,
          ipTerritory: userInfo.ipTerritory,
          userId: userInfo.userId
        })

      }
    });
  },
  toLogin() {
    var that = this;
    that.setData({
      loginStatus: true
    })
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  editUserInfo() {
    wx.navigateTo({
      url: '/pages/my/editUser/editUser'
    })
  },
  auditProject() {
    wx.navigateTo({
      url: '/pages/my/auditProject/auditProject'
    })
  },
  logManagement() {
    wx.navigateTo({
      url: '/pages/my/logManagement/logManagement'
    })
  },
  userManagement() {
    wx.navigateTo({
      url: '/pages/my/userManageMent/userManageMent'
    })
  },
  userVerified() {
    wx.navigateTo({
      url: '/pages/my/userVerified/userVerified'
    })
  },
  photoManagement() {
    wx.navigateTo({
      url: '/pages/my/photoManagement/photoManagement'
    })
  },
  advertiseManagement() {
    wx.navigateTo({
      url: '/pages/my/advertiseManagement/advertiseManagement'
    })
  },
  userVerifiedMangeMent() {
    wx.navigateTo({
      url: '/pages/my/userVerifiedMangeMent/userVerifiedMangeMent'
    })
  },
  otherManagement() {
    wx.navigateTo({
      url: '/pages/my/otherManagement/otherManagement'
    })
  },
  copyWeChat() {
    var that = this;
    wx.setClipboardData({
      data: that.data.wechat,
      showToast: false,
      success: function () {
        wx.showToast({
          icon: 'none',
          title: '客服微信已复制'
        })
      }
    });
  },
  downloadFunction() {
    wx.setClipboardData({
      data: that.data.downloadUrl,
      showToast: false,
      success: function () {
        wx.showToast({
          icon: 'none',
          title: '下载链接已复制，请到浏览器打开'
        });
      }
    });
  }

})