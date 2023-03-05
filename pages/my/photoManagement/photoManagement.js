// pages/my/photoManagement/photoManagement.js
let that;
	import sk from '../../../common/StoryKeys.js'
	import api from '../../../common/api.js'
	import su from '../../../utils/StringUtils.js'
Page({

  /**
   * Page initial data
   */
  data: {
    photoList: [],
  },

  created() {
    that = this;
  },
  onShow() {
    uni.showLoading({
      title: '加载中...',
    })
    that.loadPhotoList();
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

    loadPhotoList() {
      api.post({

      }, api.sysPhotoList).then(res => {
        that.photoList = res.data;
        
      });
    },
    addPhoto() {
      uni.showModal({
        title: '新增头像',
        editable: true,
        confirmColor: '#000',
        success(e) {
          if (e.confirm) {
            that.addOrUpdatePhoto('', e.content, 0)
          }
        }
      })
    },
    editPhoto(e) {
      var photoId = e.photoId;
      uni.showModal({
        title: '编辑头像',
        placeholderText:e.photoUrl,
        cancelText: '删除头像',
        confirmText: '保存修改',
        confirmColor: '#000',
        editable: true,
        success(e) {
          if(e.content==''){
            uni.showToast({
              title:'请设置URL',
              icon:'none'
            })
          }else{
            if (e.confirm) {
              that.addOrUpdatePhoto(photoId, e.content, 2)
            }
            if (e.cancel) {
              that.delete(photoId);
            }
          }
          
        }
      })
    },
    addOrUpdatePhoto(photoId, photoUrl, operation) {
      api.post({
        photoUrl: photoUrl,
        operation: operation,
        photoId: photoId
      }, api.addOrUpdatePhoto).then(res => {
        if (res.code == 200) {
          that.loadPhotoList();
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
        } else {
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      });
    },
    delete(photoId) {
      api.post({
        photoId: photoId
      }, api.sysPhotoDelete).then(res => {
        if (res.code == 200) {
          that.loadPhotoList();
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
        } else {
          uni.showToast({
            icon: 'none',
            title: res.msg
          })
        }
      });
    }

})