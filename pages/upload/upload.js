// pages/upload/upload.js
import fetch from '../../utils/fetch.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },
  setDr(e) {
    this.data.director = e.detail.value
  },
  setAc(e) {
    this.data.actor = e.detail.value
  },
  setDis(e) {
    this.data.description = e.detail.value
  },
  uploadimg() {

    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res)
        that.setData({
          videosrc: res.tempFilePath,
          show: true
        })
      }
    })

  },
  upload() {

    wx.uploadFile({
      url: 'https://store.lianlianchains.com/video/upload', //仅为示例，非真实的接口地址
      filePath: this.data.videosrc,
      name: 'file',
      formData: {
        user: 'test',
        openid: wx.getStorageSync('user').openid,
        director: this.data.director,
        actor: this.data.actor,
        description: this.data.description
      },
      success: function (res) {
        console.log(res)

        fetch({
          url: '/frt/invoke',
          //   baseUrl: "http://192.168.50.57:9888", 
          baseUrl: "https://store.lianlianchains.com",
          data: {
            func: 'transefer',
            ccId: '39304981a1b8d8a2dba6dc1b318267daa5c7ba4acfea4a99dab15e7ef9aee2c2',
            usr: 'frtpool',
            acc: 'frtpool',
            reacc: wx.getStorageSync('unionId'),
            amt: 10
          },
          noLoading: false,
          method: "GET",
          header: { 'content-type': 'application/x-www-form-urlencoded' }
          //  header: { 'content-type': 'application/json' }
        }).then(res => {
          console.log(res)

          if (res.code == '0') {

            wx.redirectTo({
              url: '../result/result',
            })

          }

        }).catch(err => {

          console.log("出错了")
          wx.showToast({
            title: '网络繁忙'
          })
          console.log(err)
        })

      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      director: '',
      actor: '',
      description: ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})