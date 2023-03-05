// pages/my/userVerifiedMangeMent/userVerifiedMangeMent.js
let that;
	import sk from '../../../common/StoryKeys.js'
	import api from '../../../common/api.js'
	import su from '../../../utils/StringUtils.js'
Page({

  /**
   * Page initial data
   */
  data: {

    auditStatus: 3,
    imageUrl: '',
    name: '',
    idCard: '',
    phone: '',

    list: [],
    userObj: null,
    currentPage: 1,
    pageSize: 10
  },



  created() {
    that = this;
  },
  onShow() {
    that.loadList();
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

    loadList() {
      api.post({
        currentPage: that.currentPage,
        pageSize: that.pageSize,
        realNameStatus: 2,
      }, api.findSysUserList).then(res => {
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
    },
    auditUser(e) {
      that.userObj = e;
      this.$refs.popup.open('bottom');
    },
    saveBtn(e) {
      this.$refs.popup.close();
      var userObj = that.userObj;
      // 审核不通过
      if (e == 0) {
        uni.showModal({
          editable: true,
          title: '未通过原因',
          confirmColor: '#000',
          success(e) {
            if (e.confirm) {
              userObj.auditMsg = e.content;
              userObj.realNameStatus = 3;
              that.save(userObj);
            }
          }
        })
      }
      // 审核通过
      if (e == 1) {
        userObj.realNameStatus = 1;
        that.save(userObj);
      }
    },
    save(userObj) {
      api.post(userObj, api.updateSysUser).then(res => {

        if (res.code == 200) {
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
          uni.showToast({
            title: res.msg,
            icon: 'none'
          })
          that.currentPage = 1;
          that.list = [];
          that.loadList();
        }
      });
    }

})