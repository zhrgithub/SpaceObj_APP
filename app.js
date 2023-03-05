// app.js
import sk from './common/StoryKeys'
import api from './common/api'
import su from './utils/StringUtils'

App({

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, wxonId
      }
    })


    // 获取广告
    api.post({}, api.jdList).then(res => {
      if (res.code == 200) {
        wx.setStorage({
          key: sk.shopList,
          data: res.data
        })
      }
    })
    // 获取ip
    api.get({}, api.GET_IP).then(res => {
      var ip = su.getIp(res);

      console.log(ip);
      // 获取ip属地
      api.get({
        ip: ip
      }, api.ipTerritory).then(res => {
        console.log("ip属地", res);
        if (!su.isBlank(res) && res.code == 200) {
          var ip_Territory = res.country + res.province + res.city + res.isp;
          wx.setStorage({
            key: sk.ipTerritory,
            data: ip_Territory
          })
        } else {
          wx.setStorage({
            key: sk.ipTerritory,
            data: "中国大陆"
          })

          wx.setStorage({
            key: sk.ip,
            data: "未知"
          })
        }
      });
    });

    // 获取设备信息
    const res = wx.getSystemInfoSync();
    wx.setStorage({
      key: sk.deviceModel,
      data: res
    })



  },
  globalData: {
    userInfo: null
  }
})