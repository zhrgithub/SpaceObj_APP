// pages/my/auditProject/auditProject.js
let that;
	import sk from '../../../common/StoryKeys.js'
	import api from '../../../common/api.js'
	import su from '../../../utils/StringUtils.js'
Page({

  /**
   * Page initial data
   */
  data: {

    seachText: '',
    list: [],
    projecObj: null,
    currentPage: 1,
    pageSize: 10
  },
  created() {
    that = this;
  },
  onShow() {

    that.list = [];
    that.currentPage = 1;
    that.pageSize = 10;
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
      api.post({
        content: that.seachText,
        currentPage: that.currentPage,
        pageSize: that.pageSize
      }, api.projectQueryListAdmin).then(res => {
        if (res.code == 200) {
          if (res.data.length > 0) {
            that.list = that.list.concat(res.data);
            that.currentPage++;
          }
        }

        uni.showToast({
          icon: 'none',
          title: res.msg
        })
      });
    },
    toAuditProjectDetail(e) {
      uni.navigateTo({
        url: '/pages/my/auditProject/auditProjectDetail/auditProjectDetail?obj=' + encodeURIComponent(
          JSON.stringify(e))
      })
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