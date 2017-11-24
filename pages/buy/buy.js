// pages/buy/buy.js
import fetch from '../../utils/fetch.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codestate: "发送"
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {

      wx.request({
        url: 'https://store.lianlianchains.com/video/wx/decodeUserInfo',
        data: {
          openid: wx.getStorageSync('user').openid,
          session_key: wx.getStorageSync('user').session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'GET',
        success: function (secr) {
          console.log(secr)
          
        }
      });

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) { }
      })
    }
  },  

  buy() {

    if (parseInt(this.data.frt) < parseInt(this.data.amt)) {

      wx.showModal({
        title: '余额不足请充值',
        success: function (res) {
          if (res.confirm) {

            console.log('确定')
            wx.switchTab({
              url: '../user/user',
            })
          } else if (res.cancel) {

            console.log('取消')
          }
        }
      })

    } else {

      fetch({
        url: '/frt/invoke',
        //   baseUrl: "http://192.168.50.57:9888", 
        baseUrl: "https://store.lianlianchains.com",
        data: {
          func: 'transefer',
          ccId: '39304981a1b8d8a2dba6dc1b318267daa5c7ba4acfea4a99dab15e7ef9aee2c2',
          usr: wx.getStorageSync('unionId'),
          acc: wx.getStorageSync('unionId'),
          reacc: 'frtpool',
          amt: this.data.amt
        },
        noLoading: false,
        method: "GET",
        header: { 'content-type': 'application/x-www-form-urlencoded' }
        //  header: { 'content-type': 'application/json' }
      }).then(res => {
        console.log(res)

        if (res.code == '0') {

          fetch({
            url: '/video/buy',
            //   baseUrl: "http://192.168.50.57:9888", 
            baseUrl: "https://store.lianlianchains.com",
            data: {
              'id': this.data.vid,
              'openid': wx.getStorageSync('user').openid
            },
            noLoading: false,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' }
            //  header: { 'content-type': 'application/json' }
          }).then(res => {
            console.log(res)

            wx.navigateBack({
              url: '../index/index'
            })

          }).catch(err => {

            console.log("出错了")
            wx.showToast({
              title: '网络繁忙'
            })
            console.log(err)
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.vid = options.vid
    this.data.amt = 10
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