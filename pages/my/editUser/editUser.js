// pages/my/editUser/editUser.js
var that;
	import sk from '../../../common/StoryKeys.js'
	import api from '../../../common/api.js'
	import su from '../../../utils/StringUtils.js'
	import config from '../../../common/config.js'
Page({

  /**
   * Page initial data
   */
  data: {
    photoUrl: '/static/photo.png',
    selectPhotoList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ipTerritory: "未知",
    nickName: "未设置",
    phoneNumber: "未设置",
    account: "未知",
    realNameStatus: '未实名',
    email: '未设置',
    openId: null,
    userId: '',
    deviceModel: '',
    ip: "",
    userInfo: "",
    online: 0,
  },

  onShow() {
    that.deviceModel = uni.getStorageSync(sk.deviceModel);
    that.loadUserInfo();
    // 加载是否上线信息
    var otherInfo = uni.getStorageSync(sk.otherInfo);
    if(su.isBlank(otherInfo)){
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
        uni.setStorage({
          key: sk.otherInfo,
          data: data,
        })
      })
    }else{
      console.log(otherInfo)
      that.online =otherInfo.online;
    }


  },

  onShareAppMessage() {

  },


    loadUserInfo() {
      var userInfo = uni.getStorageSync(sk.userInfo);

      that.userInfo = userInfo;
      console.log(that.userInfo);
      that.photoUrl = su.isBlank(userInfo.photoUrl) ? that.photoUrl : userInfo.photoUrl;
      that.nickName = su.isBlank(userInfo.nickName) ? that.nickName : userInfo.nickName;
      that.phoneNumber = su.isBlank(userInfo.phoneNumber) ? that.phoneNumber : userInfo
        .phoneNumber;
      that.account = su.isBlank(userInfo.account) ? that.account : userInfo.account;
      that.email = su.isBlank(userInfo.email) ? that.email : userInfo.email;
      that.realNameStatus = userInfo.realNameStatus != 1 ? '未实名' : '已实名';
      that.ipTerritory = userInfo.ipTerritory;
      that.openId = userInfo.openId;
      that.userId = userInfo.userId;
      console.log(that.openId);
    },
    bindWechat() {
      uni.login({
        provider: 'weixin',
        success: function(res) {

          api.post({
            code: res.code,
            userId: that.userId
          }, api.bindWechat).then(res2 => {
            // 修改缓存信息
            if (res2.code == 200) {
              uni.setStorage({
                key: sk.userInfo,
                data: res2.data,
                success() {
                  // 重新加载用户信息
                  that.loadUserInfo();
                }
              })
            }

            uni.showToast({
              icon: 'none',
              title: res2.msg
            })
          })


        }
      });
    },
    setEmail(e) {
      that.email = e.detail.value;
    },
    setPhoneNumber(e) {
      that.phoneNumber = e.detail.value;
    },
    setNickName(e) {
      that.nickName = e.detail.value;
    },

    editPhoto() {
      if (that.online == 0) {
        return;
      }
      this.$refs.popup.open('bottom');
      api.post({

      }, api.sysPhotoList).then(res => {
        that.selectPhotoList = res.data;

      });

    },
    setPhoto(e) {
      that.photoUrl = e;
      this.$refs.popup.close();
    },
    logout() {
      api.post({

      }, api.loginOut).then(res => {

        // 设置登录状态为退出
        uni.setStorage({
          key: "loginStatus",
          data: false
        })

        // 移除缓存中的key
        for (var i = 0; i < sk.clearKey.length; i++) {
          uni.removeStorage({
            key: sk.clearKey[i]
          })
        }
        uni.switchTab({
          url: '/pages/my/my'
        })
        uni.showToast({
          title: res.data,
          icon: 'none'
        })
      });

    },
    saveUserInfo() {
      if (su.isBlank(that.phoneNumber)) {
        uni.showToast({
          icon: 'none',
          title: "联系方式不正确"
        })
        return;
      }
      if (su.isBlank(that.nickName)) {
        uni.showToast({
          icon: 'none',
          title: '未设置昵称'
        })
        return;
      }
      if (su.isBlank(that.email)) {
        uni.showToast({
          icon: 'none',
          title: '未设置邮箱'
        })
        return;
      }
      api.post({
        phoneNumber: that.phoneNumber,
        nickName: that.nickName,
        photoUrl: that.photoUrl,
        ipTerritory: that.ipTerritory,
        email: that.email,
        openId: that.openId
      }, api.customerUpdateUserInfo).then(res => {

        if (res.code == 200) {
          uni.setStorage({
            key: sk.userInfo,
            data: res.data
          })
          uni.navigateBack();
        }
        
        uni.showToast({
          icon: 'none',
          title: res.msg
        })

      });
    }


})