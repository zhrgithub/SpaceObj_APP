// pages/my/userManageMent/userManageMent.js
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
    seachText: '',
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



    setUserName(e) {
      that.userObj.username = e.detail.value;
    },
    setNickName(e) {
      that.userObj.nickName = e.detail.value;
    },
    setPhoneNumber(e) {
      that.userObj.phoneNumber = e.detail.value;
    },
    setEmail(e) {
      that.userObj.email = e.detail.value;
    },
    setInvitationValue(e) {
      that.userObj.invitationValue = e.detail.value;
    },
    loadList() {
      api.post({
        content: that.seachText,
        currentPage: that.currentPage,
        pageSize: that.pageSize
      }, api.findSysUserList).then(res => {
        console.log(res.data)
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
    editUser(e) {
      that.userObj = e;
      this.$refs.popup.open('bottom')
    },
    disabledUser() {
      var userObj = that.userObj;
      if (userObj.disableStatus == 0) {
        that.userObj.disableStatus = 1;
      } else {
        that.userObj.disableStatus = 0;
      }
    },
    save() {
      var userObj = that.userObj;
      api.post(userObj, api.updateSysUser).then(res => {

        if (res.code == 200) {
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
          that.currentPage = 1;
          that.list = [];
          that.loadList();
        }
      });
      this.$refs.popup.close();
    },
    doSearch(e) {
      that.currentPage = 1;
      that.list = [];
      that.loadList();
    },
    inputText(e) {
      this.seachText = e.detail.value
    },
    clearInput() {
      this.seachText = "";
      that.list = [];
      that.currentPage = 1;
      that.loadList();
    },






})