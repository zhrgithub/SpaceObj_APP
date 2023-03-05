// pages/help/helpProjectDetail/helpProjectDetail.js


let that;
import sk from '../../../common/StoryKeys.js'
import api from '../../../common/api.js'
import su from '../../../utils/StringUtils.js'
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

				projectHelp: "",

				// 自定义弹出框居中显示
				type: 'center',
				msgType: 'success',
				shareContent: '',
				shareTitle: '',
				shareCancelText: '',
				shareConfirmText: ''
  },

  created() {
    that = this;
  },
  onLoad(e) {
    var str = decodeURIComponent(e.obj);
    var obj = JSON.parse(str);
    that.projectHelp = obj;
  },
  onShareAppMessage(res) {
    if (res.from === 'button') { // 来自页面内分享按钮
    }
    return {
      title: '欢迎体验spaceObj，项目大厅入口',
      path: 'pages/index/index?projectHelpShare=' + encodeURIComponent(JSON.stringify(that.projectHelp))
    }
  },
	copyPid(e) {
    uni.setClipboardData({
      data: e,
      showToast: false,
      success: function() {
        uni.showToast({
          icon: 'none',
          title: '项目编号已复制'
        })
      },
      fail(res) {
        console.log(res)
      }
    });
  },
  dialogClose() {},
  dialogConfirm() {
    // this.$refs.message.open();
  },
  dialogToggle(type) {
    this.msgType = type
    this.$refs.alertDialog.open()
  },
  getAuditStatus(e) {
    if (e == 0) {
      return "助力中";
    }
    if (e == 1) {
      return "助力成功";
    }
    if (e == 2) {
      return "已删除";
    }
    if (e == 3) {
      return "已成交";
    }
  },
  copyPhoneNumber(phoneNumber) {
    uni.showModal({
      title: "联系方式",
      content: phoneNumber,
      cancelText: "取消",
      confirmText: "复制",
      success(e) {
        if (e.confirm) {
          uni.setClipboardData({
            data: phoneNumber,
            success() {
              uni.showToast({
                title: '复制成功',
                icon: 'none'
              })
            },
            fail() {
              uni.showToast({
                title: '复制失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  getUserInfo() {
    
    api.post({
      uuid: that.projectHelp.puuid,
    }, api.getPhoneNumberByProjectId).then(res => {

      if (res.code == 200) {
        that.copyPhoneNumber(res.data);
      }
      if (res.code == 202) {
        // 初始化自定义弹窗内容
        that.shareTitle = '温馨提示';
        that.shareContent = res.msg;
        that.shareCancelText = '放弃';
        that.shareConfirmText = '立即分享';
        that.dialogToggle('info');
        return;
      }
    });
  },





})