import api from '../../common/api.js'
import sk from '../../common/StoryKeys.js'
import nick_Name from '../../utils/nickName.js'
var that;
Page({

  /**
   * Page initial data
   */
  data: {


  },


  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  loginByWechat() {
    var that = this;

    var nickName = nick_Name.getNickName();
    wx.login({
      provider: 'weixin',
      onlyAuthorize: true,
      success: function (res) {
        wx.getUserInfo({
          provider: 'weixin',
          success: function (infoRes) {
            wx.showModal({
              title: infoRes
            })
          }
        });
        console.log("微信信息：", res)
        // wx.showToast({
        // 	title:"微信信息"+res.code
        // })
        wx.showModal({
          title: res.code,
          content: res
        })
        api.post({
          code: res.code,
          ipTerritory: wx.getStorageSync(sk.ipTerritory) == '' ? '未知' : wx
            .getStorageSync(sk.ipTerritory),
          deviceType: wx.getStorageSync(sk.deviceModel).model,
          inviteUserId: wx.getStorageSync(sk.inviteUserId),
          nickName: nickName
        }, api.loginByWechat).then(res2 => {
          if (res2.code == 200) {
            // 缓存用户基本信息
            wx.setStorage({
              key: sk.userInfo,
              data: res2.data,
              success() {
                that.loginResetUserinFo(res2.data, res2.data.token,
                  res2.msg);
              }
            })
          }

        })
      },
      fail: function (err) {
        wx.showModal({
          title: err.code,
          content: err
        })
      }
    });
  },

  loginResetUserinFo(userInfo, token, msg) {
    var that = this;
    // 缓存登录状态
    wx.setStorage({
      key: sk.loginStatus,
      data: true
    })
    //缓存token
    wx.setStorage({
      key: sk.token,
      data: token,
      success() {
        // 转到项目大厅
        wx.showToast({
          icon: 'none',
          title: msg,
          success() {
            wx.switchTab({
              url: '/pages/project/project'
            })
          }
        })
      }
    })

  },
  
})