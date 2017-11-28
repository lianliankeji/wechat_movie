// pages/user/user.js
import fetch from '../../utils/fetch.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    frt: 0
  },

  recharge() {

    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  
  queryfrt() {

    fetch({
      url: '/frt/query',
      //   baseUrl: "http://192.168.50.57:9888", 
      baseUrl: "https://store.lianlianchains.com",
      data: {
        func: 'query',
        ccId: '39304981a1b8d8a2dba6dc1b318267daa5c7ba4acfea4a99dab15e7ef9aee2c2',
        usr: wx.getStorageSync('unionId'),
        acc: wx.getStorageSync('unionId')
      },
      noLoading: false,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
      //  header: { 'content-type': 'application/json' }
    }).then(res => {
      console.log(res)
      if (res.code == '0') {

        this.setData({
          frt: res.result
        })

      }
    }).catch(err => {

      console.log("出错了")
      wx.showToast({
        title: '网络繁忙'
      })
      console.log(err)
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo.nickName)
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
      },
      fail: function (err) {
        that.setData({
          avatarUrl: '../../image/user.png'
        })
      }
    });

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
    this.queryfrt()
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