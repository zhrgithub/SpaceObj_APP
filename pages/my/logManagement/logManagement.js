// pages/my/logManagement/logManagement.js
Page({

  /**
   * Page initial data
   */
  data: {
    fromDate: '开始时间',
    toDate: '结束时间',
    array: ['全部', '业务日志', '异常日志'],
    index: 0,
    inputText: '',
  },


  computed: {
    startDate() {
      return this.getDate('start');
    },
    endDate() {
      return this.getDate('end');
    }
  },
  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },



    bindDateChange: function(e) {
      this.fromDate = e.detail.value
      console.log(this.fromDate)
    },
    toBindDateChange(e) {
      this.toDate = e.detail.value;
      console.log(this.toDate)
    },

    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 60;
      } else if (type === 'end') {
        year = year + 2;
      }
      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      return `${year}-${month}-${day}`;
    },
    bindPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.index = e.detail.value
    },
    doSearch(e) {
      this.inputText = e.detail.value;
      console.log(e.detail.value)
    },
    toLogDetail(){
      uni.navigateTo({
        url:'/pages/my/logManagement/logDetail/logDetail'
      })
    }



})