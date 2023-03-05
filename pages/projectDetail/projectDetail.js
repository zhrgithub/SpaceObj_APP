// pages/projectDetail/projectDetail.js
import sk from '../../common/StoryKeys.js';
import api from '../../common/api.js';
import su from '../../utils/StringUtils.js';
import config from '../../common/config.js';
Page({

  /**
   * Page initial data
   */
  data: {

    projectObj: '',

    projectHelp: '',
    // 自定义弹出框居中显示
    type: 'center',
    msgType: 'success',
    shareContent: '',
    shareTitle: '',
    shareCancelText: '',
    shareConfirmText: '',
    online: 0
  },

  onShow() {
    var that = this;
		var otherInfo = wx.getStorageSync(sk.otherInfo);
		if (su.isBlank(otherInfo)) {
			// 获取其它
			api.post({}, api.getOther).then(res => {
				console.log(res);
				var data = res.data;
				var version = res.data.version;
				// 判断后端传递过来的版本号和当前APP的版本号是否一致，如果不一致，就设置上线状态为0，一致则设置为1
				if (version == config.system_version) {
					data.online = 1;
				} else {
					data.online = 0;
        }
        that.setData({
          online:data.online
        })
				wx.setStorage({
					key: sk.otherInfo,
					data: data
				});
			});
		} else {
			console.log(otherInfo);
      that.setData({
        online:otherInfo.online
      })
		}
	},
	onLoad(e) {
    var that = this;
		var str = decodeURIComponent(e.obj);
    var obj = JSON.parse(str);
    that.setData({
      projectObj:obj
    })
		that.addViews(obj);
	},
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

		copyPid(e) {
			wx.setClipboardData({
				data: e,
				showToast: false,
				success: function() {
					wx.showToast({
						icon: 'none',
						title: '项目编号已复制'
					});
				}
			});
		},
		addViews(obj) {
			api.post(
				{
					uuid: obj.uuid
				},
				api.projectAddPageViews
			).then(res => {});
		},
		dialogClose() {},
		dialogConfirm() {},
		dialogToggle(type) {
			this.msgType = type;
			this.$refs.alertDialog.open();
		},
		getAuditStatus(e) {
			if (e == 0) {
				return '待审核';
			}
			if (e == 1) {
				return '审核通过';
			}
			if (e == 2) {
				return '审核不通过';
			}
			if (e == 3) {
				return '已删除';
			}
			if (e == 4) {
				return '已成交';
			}
		},
		copyPhoneNumber(phoneNumber) {
			wx.showModal({
				title: '联系方式',
				content: phoneNumber,
				cancelText: '取消',
				confirmText: '复制',
				success(e) {
					if (e.confirm) {
						wx.setClipboardData({
							data: phoneNumber,
							success() {
								wx.showToast({
									title: '复制成功',
									icon: 'none'
								});
							},
							fail() {
								wx.showToast({
									title: '复制失败',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		getUserInfo() {
      var that = this;
			api.post(
				{
					uuid: that.data.projectObj.uuid
				},
				api.getPhoneNumberByProjectId
			).then(res => {
				if (res.code == 500) {
					wx.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else if (res.code == 200) {
					that.copyPhoneNumber(res.data);
				} else if (res.code == 202) {
					let userInfo = wx.getStorageSync(sk.userInfo);
					if (!userInfo.phoneNumber || !userInfo.email) {
							wx.showModal({
								title: '提示',
								content: "请到个人中心设置邮箱和联系电话",
								success: function(res) {
									if (res.confirm) {
										wx.navigateTo({
											url: '/pages/my/editUser/editUser'
										});
									}
								}
							});
						return;
					}
					// 提前生成助力链接
					that.getShareProjectHelp();
          // 初始化自定义弹窗内容
          that.setData({
            shareTitle:"温馨提示",
            shareContent:res.msg,
            shareCancelText:"放弃",
            shareConfirmText:"立即分享",
          })
				
					// that.dialogToggle('info');
					return;
				}
			});
		},
		getShareProjectHelp() {
			api.post(
				{
					pUUID: that.data.projectObj.uuid
				},
				api.createProjectHelpLink
			).then(res => {
				if (res.code == 200) {
          that.setData({
            projectHelp:res.data
          })
					wx.setStorage({
						key: sk.projectHelpShare,
						data: res.data
					});
				}
			});
		}

})