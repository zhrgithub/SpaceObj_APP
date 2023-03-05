// pages/project/project.js

import sk from '../../common/StoryKeys.js'
import api from '../../common/api.js'
import su from '../../utils/StringUtils.js'
import config from '../../common/config.js'

Page({

  /**
   * Page initial data
   */
  data: {

    list: [],
    type: 'center',
    seachText: "",
    // 默认激活样式是第一个
    act: '',
    shopList: [],

    projecObj: null,
    currentPage: 1,
    pageSize: 10,
    price: "",
    content: "",
    userInfo: "",
    online: 0,
  },

 
  onLoad() {
    var that = this;

    that.setData({
      list:[],
      currentPage:1,
      pageSize:10
    })
    that.loadList();
  },
  onShow() {
    var that = this;
    var otherInfo = wx.getStorageSync(sk.otherInfo);
    if(su.isBlank(otherInfo)){
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
        that.setData({
          online:data.online
        })
        wx.setStorage({
          key: sk.otherInfo,
          data: data,
        })
      })
    }else{
      console.log(otherInfo)
      that.setData({
        online:otherInfo.online
      })
    }

    var userInfo = wx.getStorageSync(sk.userInfo);
    that.setData({
      shopList:wx.getStorageSync(sk.shopList),
      userInfo:userInfo
    })

    // 校验用户是否登录 
    var loginStatus = wx.getStorageSync(sk.loginStatus);
    if (loginStatus) {
      // 登录成功，帮助好友更新项目助力信息
      that.doUpdateProjectHelp();
    }
  },
  // 触底加载更多
  onReachBottom() {
    var that = this;

    that.loadList();
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this;
    that.setData({
      currentPage:1,
      list:[],
    })
    that.loadList();
    wx.stopPullDownRefresh();
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },


    touchLoad() {

      var that = this;
      that.setData({
        currentPage:1,
        list:[]
      })
      that.loadList();
    },

    doUpdateProjectHelp() {
      var that = this;
      var projectHelpShare = wx.getStorageSync(sk.projectHelpShare);
      var createUserId = projectHelpShare.createUserId;
      var userInfo = that.data.userInfo;
      if (userInfo.userId == createUserId) {
        return;
      }

      console.log(projectHelpShare);
      if (!su.isUndefined(projectHelpShare) && !su.isBlank(projectHelpShare)) {
        api.post({
          hpId: projectHelpShare.hpId,
        }, api.updateProjectHelpNumber).then(res => {
          if (res.code == 200) {
            wx.removeStorage({
              key: sk.projectHelpShare
            })
          }
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        });
      }
    },
    copyAdLink(e) {
      wx.setClipboardData({
        data: e,
        showToast: false,
        success: function() {
          wx.showToast({
            icon: 'none',
            title: '已复制商品链接,可在浏览器打开'
          })
        }
      });
    },

    setPrice(e) {
      var that =this;
      that.setData({
        price:e.detail.value
      })
    },
    setContent(e) {
      var that = this;
      that.setData({
        content:e.detail.value
      })
    },

    timeStampTurnTime(str) {
      var date = new Date(str); // 参数需要毫秒数，所以这里将秒数乘于 1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      return Y + M + D;
    },



    loadList() {
      var that = this;
      api.post({
        content: that.data.seachText,
        projectType: 0,
        currentPage: that.data.currentPage,
        pageSize: that.data.pageSize
      }, api.projectFindList).then(res => {

        if (res.code == 200) {
          if (res.data.length > 0) {
            that.setData({
              list:that.data.list.concat(res.data),
              currentPage:that.data.currentPage+1
            })
          }else{
            wx.showToast({
              icon:'none',
              title: "已加载全部"
            })
          }
        } else {
          wx.showToast({
            title: res.msg
          })
        }
      });
    },
    releaseProject(type) {
      var that = this;
      var token = wx.getStorageSync(sk.token);
      if (su.isBlank(token)) {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return;
      }
      var userInfo = wx.getStorageSync(sk.userInfo);
      if (su.isBlank(userInfo.email) || su.isBlank(userInfo.phoneNumber)) {
        wx.showModal({
          title: '温馨提示',
          content: '设置邮箱和电话方便乙方联系您',
          cancelText: '不去',
          confirmText: '去啊',
          success(e) {
            if (e.confirm) {
              wx.navigateTo({
                url: '/pages/addEmailPhoneNumber/addEmailPhoneNumber'
              })
            }
          }
        })
        return;
      }

      that.setData({
        type:type
      })
      // open 方法传入参数 等同在 wx-popup 组件上绑定 type属性
      // that.$refs.popup.open(type);
    },
    submit() {
      var that  = this;
      if (su.isBlank(that.data.price)) {
        wx.showToast({
          icon: 'none',
          title: '预算不为空',
        })
        return;
      }
      if (that.data.price < 50) {
        wx.showToast({
          icon: 'none',
          title: '预算低于50元',
        })
        return;
      }

      if (su.isBlank(that.data.content)) {
        wx.showToast({
          icon: 'none',
          title: '需求内容不为空',
        })
        return;
      }


      api.post({
        content: that.data.content,
        price: that.data.price,
        ipAddress: wx.getStorageSync(sk.ipTerritory),
        nickname: that.data.userInfo.nickName,
      }, api.projectAddProject).then(res => {

        if (res.code == 200) {

          that.setData({
            content:'',
            price:'',
            list:[],
            currentPage:1,
            pageSize:10,

          })
         
          that.loadList();

          wx.navigateTo({
            url: '/pages/release/release'
          })
        }
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      });
    },
    cancelSubmit() {
      // that.$refs.popup.close();
    },

    toProjecDetail(e) {
      console.log(e);
      var obj = e.currentTarget.dataset.item;
      var userinfo = wx.getStorageSync(sk.userInfo);
      console.log(userinfo);
      if(su.isBlank(userinfo)){
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return;
      }
      wx.navigateTo({
        url: '/pages/projectDetail/projectDetail?obj=' + encodeURIComponent(JSON.stringify(obj))
      })
    },
    doSearch(e) {
      var that = this;
      that.setData({
        currentPage:1,
        list:[],
      })
      that.loadList();
    },
    inputText(e) {

      var that = this;
      that.setData({
        seachText:e.detail.value
      })
    },
    clearInput() {
      var that = this;
      that.setData({
        seachText:"",
        list:[],
        currentPage:1,
      })
      that.loadList();
    },
    getItem(e) {
      that.setData({
        act:e.detail.current
      })
    },



})