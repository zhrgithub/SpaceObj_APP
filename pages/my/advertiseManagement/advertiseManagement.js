// pages/my/advertiseManagement/advertiseManagement.js
let that;
import sk from '../../../common/StoryKeys.js'
import api from '../../../common/api.js'
import su from '../../../utils/StringUtils.js'
import config from '../../../common/config.js'
Page({

  /**
   * Page initial data
   */
  data: {

    list: [],
    jdAdCommentNum: null, //商品评论数量
    jdAdCoupon: null, //优惠券描述
    jdAdHyperlink: null, //商品超链接
    jdAdId: null, //商品id
    jdAdImageLink: null, //商品图片链接
    jdAdName: null, //商品名称
    jdAdPrice: null, //商品价格
    jdAdStoreName: null, //商家名称
    operationType: null, //操作类型：0表示修改，1表示新增，默认为null
    online: 0,
  },

  onShow() {
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
    if (that.online == 0) {
      uni.switchTab({
        url: '/pages/project/project'
      })
    }

    that.loadList();
  },

  onShareAppMessage() {

  },

    setAdHyperlink(e) {
      that.jdAdHyperlink = e.detail.value;
    },
    setAdImageLink(e) {
      that.jdAdImageLink = e.detail.value;
    },
    setAdName(e) {
      that.jdAdName = e.detail.value;
    },
    setAdStoreName(e) {
      that.jdAdStoreName = e.detail.value;
    },
    setAdCoupon(e) {
      that.jdAdCoupon = e.detail.value;
    },
    setAdPrice(e) {
      that.jdAdPrice = e.detail.value;
    },
    setAdCommentNum(e) {
      that.jdAdCommentNum = e.detail.value;
    },
    loadList() {
      api.post({

      }, api.jdList).then(res => {
        that.list = res.data;

      });
    },
    editAdvertise(e) {
      that.jdAdCommentNum = e.jdAdCommentNum;
      that.jdAdCoupon = e.jdAdCoupon;
      that.jdAdHyperlink = e.jdAdHyperlink;
      that.jdAdId = e.jdAdId;
      that.jdAdImageLink = e.jdAdImageLink;
      that.jdAdName = e.jdAdName;
      that.jdAdPrice = e.jdAdPrice;
      that.jdAdStoreName = e.jdAdStoreName;

      // 设置成修改的操作类型
      that.operationType = 0;

      this.$refs.popup.open('bottom')

    },
    addAdvertise() {
      // 设置成添加的操作类型
      that.operationType = 1;
      that.jdAdCommentNum = '';
      that.jdAdCoupon = '';
      that.jdAdHyperlink = '';
      that.jdAdId = '';
      that.jdAdImageLink = '';
      that.jdAdName = '';
      that.jdAdPrice = '';
      that.jdAdStoreName = '';
      this.$refs.popup.open('bottom')
    },
    del() {
      this.$refs.popup.close();
      api.post({
        jdAdId: that.jdAdId
      }, api.jdDeleteAdvertise).then(res => {
        if (res.code == 200) {
          that.loadList();
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });


    },
    submit() {
      // 判断是新增还是修改
      var operationType = that.operationType;
      if (that.jdAdHyperlink.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '商品超链接不为空'
        })
        return;
      }

      if (that.jdAdImageLink.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '图片超链接不为空'
        })
        return;
      }
      if (that.jdAdName.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '商品名称不为空'
        })
        return;
      }
      if (that.jdAdStoreName.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '商家名称不为空'
        })
        return;
      }
      if (that.jdAdCoupon.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '优惠卷描述不为空'
        })
        return;
      }
      if (that.jdAdPrice == '') {
        uni.showToast({
          icon: 'none',
          title: '商品价格不为空'
        })
        return;
      }
      if (that.jdAdCommentNum.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '商品好评数不为空'
        })
        return;
      }
      if (operationType == 0) {
        that.update();
      } else {
        that.add();
      }
      this.$refs.popup.close();


    },

    add() {
      api.post({
        jdAdHyperlink: that.jdAdHyperlink,
        jdAdImageLink: that.jdAdImageLink,
        jdAdName: that.jdAdName,
        jdAdStoreName: that.jdAdStoreName,
        jdAdCoupon: that.jdAdCoupon,
        jdAdPrice: that.jdAdPrice,
        jdAdCommentNum: that.jdAdCommentNum,
      }, api.jdSaveAdvertise).then(res => {
        if (res.code == 200) {
          that.loadList();
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    },
    update() {
      if (that.jdAdId == '') {
        uni.showToast({
          icon: 'none',
          title: '商品id不为空'
        })
        return;
      }
      api.post({
        jdAdId: that.jdAdId,
        jdAdHyperlink: that.jdAdHyperlink,
        jdAdImageLink: that.jdAdImageLink,
        jdAdName: that.jdAdName,
        jdAdStoreName: that.jdAdStoreName,
        jdAdCoupon: that.jdAdCoupon,
        jdAdPrice: that.jdAdPrice,
        jdAdCommentNum: that.jdAdCommentNum,
      }, api.jdUpdateAdvertise).then(res => {
        if (res.code == 200) {
          that.loadList();
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          uni.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      });
    },



})