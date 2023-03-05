// pages/my/auditProject/auditProjectDetail/auditProjectDetail.js
let that;
	import sk from '../../../../common/StoryKeys.js'
	import api from '../../../../common/api.js'
	import su from '../../../../utils/StringUtils.js'
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
dataMessge: "www.spaceobj.com",
projectObj: null,
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },
  onLoad(e) {

    var str = decodeURIComponent(e.obj);
    var obj = JSON.parse(str);
    that.projectObj = obj;
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
    refuse() {
      uni.showModal({
        title: '拒绝通过',
        editable: true,
        success(e) {
          if (e.confirm) {
            that.updateProject(2, e.content);
          }
        }
      })
    },
    approve() {
      uni.showModal({
        content: '确认通过',
        success(e) {
          if (e.confirm) {
            that.updateProject(1, "");
          }
        }
      })
    },
    updateProject(status, message) {
      var obj = that.projectObj;
      api.post({
        pId: obj.pid,
        status: status,
        message: message,
      }, api.auditProject).then(res => {

        uni.showToast({
          title: res.msg,
          icon: 'none',
          success() {
            uni.navigateBack();
          }
        })
      })
    }





})