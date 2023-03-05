// pages/release/release.js

let that;
import sk from '../../common/StoryKeys.js'
import api from '../../common/api.js'
import su from '../../utils/StringUtils.js'
import config from '../../common/config.js'
Page({

  /**
   * Page initial data
   */
  data: {
    type: 'center',
    seachText: '',
    list: [],
    projecObj: null,
    currentPage: 1,
    pageSize: 10,
    price: "",
    content: " ",
    userInfo: "",
    // 根据屏幕高度显示输入框
    screenHeight: "0px",
    online: 0,
  },

  onLoad() {


    // 获取设备信息
    var deviceModel = uni.getStorageSync(sk.deviceModel);
    that.screenHeight = deviceModel.screenHeight;
    console.log(that.screenHeight)

    that.list = [];
    that.currentPage = 1;
    that.pageSize = 10;
    that.loadList();
  },
  onShow() {
    var userInfo = uni.getStorageSync(sk.userInfo);
    that.userInfo = userInfo;
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
    uni.stopPullDownRefresh();
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },


    touchLoad() {

      that.currentPage = 1;
      that.list = [];
      that.loadList();
    },

    setPrice(e) {
      that.price = e.detail.value;
    },
    setContent(e) {
      that.content = e.detail.value;
    },

    timeStampTurnTime(str) {
      var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      return Y + M + D;
    },

    getAuditStatus(e) {
      if (e == 0) {
        return "待审核";
      }
      if (e == 1) {
        return "审核通过";
      }
      if (e == 2) {
        return "审核不通过";
      }
      if (e == 3) {
        return "已删除";
      }
      if (e == 4) {
        return "已成交";
      }
    },

    loadList() {

      var loginSataus = uni.getStorageSync(sk.loginStatus);
      if (loginSataus) {
        api.post({
          projectType: 1,
          currentPage: that.currentPage,
          pageSize: that.pageSize
        }, api.projectFindList).then(res => {

          if (res.code == 200) {
            if (res.data.length > 0) {
              that.list = that.list.concat(res.data);
              that.currentPage++;
            }
          } else {
            uni.showToast({
              icon: 'none',
              title: res.msg
            })
          }
        });
      } else {

      }


    },
    releaseProject(type) {
      var token = uni.getStorageSync(sk.token);
      if (su.isBlank(token)) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return;
      }
      var userInfo = uni.getStorageSync(sk.userInfo);
      if (su.isBlank(userInfo.email) || su.isBlank(userInfo.phoneNumber)) {
        uni.showModal({
          title: '温馨提示',
          content: '设置邮箱和电话方便乙方联系您',
          cancelText: '不去',
          confirmText: '去啊',
          success(e) {
            if (e.confirm) {
              uni.navigateTo({
                url: '/pages/addEmailPhoneNumber/addEmailPhoneNumber'
              })
            }
          }
        })
        return;
      }


      this.type = type;
      // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
      this.$refs.popup.open(type);
    },
    submit() {
      if (su.isBlank(that.price)) {
        uni.showToast({
          icon: 'none',
          title: '预算不为空',
        })
        return;
      }
      if (that.price < 50) {
        uni.showToast({
          icon: 'none',
          title: '预算低于50元',
        })
        return;
      }

      if (su.isBlank(that.content)) {
        uni.showToast({
          icon: 'none',
          title: '需求内容不为空',
        })
        return;
      }


      api.post({
        content: that.content,
        price: that.price,
        ipAddress: uni.getStorageSync(sk.ipTerritory),
        nickname: that.userInfo.nickName,
      }, api.projectAddProject).then(res => {

        if (res.code == 200) {
          that.content = '';
          that.price = '';
          that.list = [];
          that.currentPage = 1;
          that.pageSize = 10;
          that.loadList();
          this.$refs.popup.close();
        }
        uni.showToast({
          icon: 'none',
          title: res.msg
        })
      });
    },
    cancelSubmit() {
      this.$refs.popup.close();
    },
    toProjecDetail(e) {
      uni.navigateTo({
        url: '/pages/release/releaseProjectDetail/releaseProjectDetail?obj=' + encodeURIComponent(JSON
          .stringify(e))
      })
    },




})