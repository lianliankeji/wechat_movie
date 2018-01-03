// pages/card/card.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards:[
      // {
      //   url: '../../image/once.png',
      //   score: 20,
      //   fee: 2
      // },
      {
        url: '../../image/month.png',
        score: 50,
        fee: 10
      },
      {
        url: '../../image/quarter.png',
        score: 100,
        fee: 20
      },
      {
        url: '../../image/year.png',
        score: 500,
        fee: 50
      }
    ],
    selectId: 0
  },

  selectCard(e) {
    this.setData({
      selectId: e.target.dataset.index
    });
  },

  buy(e) {
    let fee = e.target.dataset.fee;
    let score = e.target.dataset.score;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
        amt: score
      },
      noLoading: false,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
      //  header: { 'content-type': 'application/json' }
    }).then(res => {
      console.log(res)
      wx.hideLoading();
      if (res.code == '0') {

        wx.navigateBack({
          url: '../user/user',
        })
      }

    }).catch(err => {
      wx.hideLoading();
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