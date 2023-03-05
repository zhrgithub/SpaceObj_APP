// pages/my/otherManagement/otherManagement.js
let that;
	import sk from '../../../common/StoryKeys.js'
	import api from '../../../common/api.js'
	import su from '../../../utils/StringUtils.js'

Page({

  /**
   * Page initial data
   */
  data: {
    downloadUrl: null,
    wechat: null,
    otherInfo: null,
    online: null,
    version: null,
  },
  onShow() {
    that.timer = setTimeout(() => {
      var otherInfo = uni.getStorageSync(sk.otherInfo);
      that.downloadUrl = otherInfo.downloadUrl;
      that.wechat = otherInfo.wechat;
      that.online = otherInfo.online;
      that.version = otherInfo.version;
    }, 200);
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },


    setOnline() {
      var online = that.online;
      if (online == 0) {
        that.online = 1;
      } else {
        that.online = 0;
      }
    },
    setWechat(e) {
      that.wechat = e.detail.value;
    },
    serVersion(e) {
      that.version = e.detail.value;
    },
    setDownLoad(e) {
      that.downloadUrl = e.detail.value;
    },
    save() {
      if (that.downloadUrl == '') {
        uni.showToast({
          icon: 'none',
          title: '下载链接不为空'
        })
        return;
      }
      if (that.wechat == '') {
        uni.showToast({
          icon: 'none',
          title: '客服微信不为空'
        })
        return;
      }
      if (that.version == '') {
        uni.showToast({
          icon: 'none',
          title: '请设置版本号'
        })
        return;
      }
      api.post({
        wechat: that.wechat,
        downloadUrl: that.downloadUrl,
        online: that.online,
        version: that.version
      }, api.updateOther).then(res => {
        if (res.code == 200) {
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
          uni.setStorage({
            key: sk.otherInfo,
            data: res.data
          })
        }
      })
    }






})