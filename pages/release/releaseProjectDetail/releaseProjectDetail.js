// pages/release/releaseProjectDetail/releaseProjectDetail.js
let that;
import api from '../../../common/api.js'
Page({

  /**
   * Page initial data
   */
  data: {
    //项目状态，如果甲方已关闭，那么拒绝获取客户联系方式
    projectStatus: 1,
    //用户的邀请值>1,或者助力值>10
    helpValue: 0, //助力值
    inviteValue: 0, //邀请值
    //用户已经获取过
    getStatus: false,
    type: 'center',

    projectObj: ""
  },


  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
  created() {
    that = this;
  },
  onLoad(e) {
    var str = decodeURIComponent(e.obj);
    var obj = JSON.parse(str);
    that.projectObj = obj;
    if (obj.status == 2) {
      uni.showModal({
        title: "审核不通过",
        content: obj.message,
        showCancel: false
      })
    }
  },
  copyPid(e) {
    uni.setClipboardData({
      data: e,
      showToast: false,
      success: function () {
        uni.showToast({
          icon: 'none',
          title: '项目编号已复制'
        })
      }
    });
  },
  setPrice(e) {
    that.projectObj.price = e.detail.value;
  },
  setContent(e) {
    that.projectObj.content = e.detail.value;
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
  cancelRelease() {
    uni.showModal({
      content: "删除后其他人将无法联系您",
      success(e) {
        if (e.confirm) {
          that.projectObj.status = 3;
          that.updateProject();
        }
      }
    })
  },
  repeatRelease(type) {
    this.type = type;
    // open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
    this.$refs.popup.open(type)
  },
  cancel() {
    this.$refs.popup.close();
  },

  submit() {
    this.$refs.popup.close();
    uni.showModal({
      title: "确认提交",
      success(e) {
        if (e.confirm) {
          that.updateProject();
        }
      }
    })

  },

  updateProject() {
    var obj = that.projectObj;
    api.postJson(obj, api.projectUpdateProject).then(res => {

      uni.showToast({
        title: res.msg,
        icon: 'none',
        success() {
          if (res.code == 200) {
            uni.navigateBack();
          }
        }
      })
    })
  },


})