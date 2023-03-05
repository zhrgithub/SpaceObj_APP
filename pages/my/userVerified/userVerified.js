// pages/my/userVerified/userVerified.js
var that;
	import sk from '../../../common/StoryKeys.js'
	import su from '../../../utils/StringUtils.js'
	import api from '../../../common/api.js'
	import config from '../../../common/config.js'
Page({

  /**
   * Page initial data
   */
  data: {
    realNameStatus: 3,
    idCardPic: '',
    username: '',
    idCardNum: '',
    online: 0,
  },
  onShow() {



    this.timer = setTimeout(() => {
      // 第二步加载其它信息
      var otherInfo = uni.getStorageSync(sk.otherInfo);
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
          uni.setStorage({
            key: sk.otherInfo,
            data: data,
          })
        })
      } else {
        console.log(otherInfo)
        that.online = otherInfo.online;
      }


      // 第一步：加载用户基本信息
      that.loginStatus = uni.getStorageSync(sk.loginStatus);
      var userInfo = uni.getStorageSync(sk.userInfo);
      if (userInfo != '') {
        that.realNameStatus = userInfo.realNameStatus;
        that.idCardPic = userInfo.idCardPic;
        that.username = su.isBlank(userInfo.username) ? '' : userInfo.username;
        that.idCardNum = su.isBlank(userInfo.idCardNum) ? '' : userInfo.idCardNum;
        if (that.realNameStatus == 3) {
          uni.showModal({
            showCancel: false,
            title: "审核结果",
            content: userInfo.auditMsg
          })
        }
      }
    })

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
    setUserName(e) {
      that.username = e.detail.value;
    },
    setIdCardNumber(e) {
      that.idCardNum = e.detail.value;
    },
    submit() {
      var username = that.username;
      var userInfo = uni.getStorageSync(sk.userInfo);
      var idCardNum = that.idCardNum;
      var idCardPic = that.idCardPic;
      if (su.isBlank(username)) {
        uni.showToast({
          icon: 'none',
          title: '用户名不为空'
        })
        return;
      }
      if (su.isBlank(idCardNum) || idCardNum.length != 18) {
        uni.showToast({
          icon: 'none',
          title: '身份证号格式不正确'
        })
        return;
      }
      if (su.isBlank(idCardPic)) {
        uni.showToast({
          icon: 'none',
          title: '请上传图片'
        })
        return;
      }
      userInfo.username = username;
      userInfo.idCardNum = idCardNum;
      userInfo.idCardPic = idCardPic;


      api.post(userInfo, api.realName).then(res => {

        if (res.code == 200) {
          uni.setStorage({
            key: sk.userInfo,
            data: res.data
          })
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
        }

      });
    },
    uploadImageItem() {
      var token = uni.getStorageSync(sk.token);
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          const uploadTask = uni.uploadFile({
            url: api.upLoadFile, //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'satoken': token != '' ? token : ''
            },
            formData: {
              'file': tempFilePaths
            },
            success: (uploadFileRes) => {
              var data = JSON.parse(uploadFileRes.data);
              if (data.code == 200) {
                that.idCardPic = data.data;
              }
              uni.showToast({
                title: data.msg,
                icon: 'none'
              })
            }
          });
        }
      });
    }


})