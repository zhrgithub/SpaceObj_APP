// index.js
// 获取应用实例
const app = getApp();
var that = this;
import sk from "../../common/StoryKeys.js"
import api from "../../common/api.js"
import su from "../../utils/StringUtils.js"
import config from '../../common/config.js'
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad(e) {
    if (!su.isBlank(e)) {
      // 设置邀请人id
      if (!su.isUndefined(e.inviteUserId)) {
        wx.setStorage({
          key: sk.inviteUserId,
          data: e.inviteUserId
        })
      }  
      // 设置项目助力projectHelpShare
      if (!su.isUndefined(e.projectHelpShare)) {
        var str = decodeURIComponent(e.projectHelpShare);
        var projectHelpShare = JSON.parse(str);
        wx.setStorage({
          key: sk.projectHelpShare,
          data: projectHelpShare
        })
      }
    }
  },
  onShow() {
    wx.showLoading({
      title: '加载中...',
    })
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
      wx.setStorage({
        key: sk.otherInfo,
        data: data,
        success() {
          wx.hideLoading();
          wx.switchTab({
            url: '/pages/project/project'
          })
        }
      })
    })
  },
  created() {
    that = this;

    const res = wx.getSystemInfoSync();
    console.log("设备信息：", res)
    wx.setStorage({
      key: sk.deviceModel,
      data: res
    })
    if (res.model != "PC") {

    }
  },

})
