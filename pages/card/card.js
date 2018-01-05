// pages/card/card.js
import fetch from '../../utils/fetch.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [
      // {
      //   url: '../../image/once.png',
      //   score: 20,
      //   fee: 2
      // },
      {
        url: '../../image/month.png',
        score: 50,
        fee: 5,
        time: 31
      },
      {
        url: '../../image/quarter.png',
        score: 100,
        fee: 10,
        time: 93
      },
      {
        url: '../../image/year.png',
        score: 500,
        fee: 30,
        time: 365
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
    let time = e.target.dataset.time;
    let openid = wx.getStorageSync('user').openid;
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    this.prepay(openid, fee, score, time);

  },
  prepay(openId, payMoney, score, time) {
    console.log("支付钱数：" + payMoney);
    var that = this;
    fetch({
      url: "/video/prepay",
      //  baseUrl: "http://192.168.50.239:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        'openid': openId,
        'fee': payMoney,
        'description': "华影欣荣"
        // 'usedScore': this.data.score,
        // 'mch_id': wx.getStorageSync('storeId'),
        // 'storeid': wx.getStorageSync('storeId')
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(result => {
      console.log(result);
      if (result.returncode) {
        wx.showToast({
          title: result.returnmsg,
        })
        return
      }
      var prepay_id = result.prepay_id;
      wx.setStorageSync('orderNo', result.orderNo)
      console.log("统一下单返回 prepay_id:" + prepay_id);
      that.sign(prepay_id, payMoney, score, time);
    }).catch(err => {

    });
  },
  //签名
  sign(prepay_id, payMoney, score, time) {
    console.log("支付钱数：" + payMoney);
    var that = this;
    fetch({
      url: "/video/wxpay/sign",
      //   baseUrl: "http://192.168.50.57:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        'repay_id': prepay_id
      },
      method: "POST",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(result => {
      that.requestPayment(result, payMoney, score, time);
    }).catch(err => {

    });
  },
  //申请支付
  requestPayment: function (obj, payMoney, score, time) {
    let self = this;
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        console.log(res);
        fetch({
          url: '/video/user/vip',
          // baseUrl: "http://192.168.50.239:9777",
          baseUrl: "https://store.lianlianchains.com",
          data: {
            openid: wx.getStorageSync('unionId'),
            time: time
          },
          noLoading: false,
          method: "POST",
          header: { 'content-type': 'application/x-www-form-urlencoded' }
          //  header: { 'content-type': 'application/json' }
        }).then(res => {
          // console.log(res)
          // wx.hideLoading();
          // if (res.code == '0') {

          //   wx.navigateBack({
          //     url: '../user/user',
          //   })
          // }

        }).catch(err => {
          wx.hideLoading();
          console.log("出错了")
          wx.showToast({
            title: '网络繁忙'
          })
          console.log(err)
        })
        fetch({
          url: '/frt/invoke',
          //   baseUrl: "http://192.168.50.57:9888", 
          baseUrl: "https://store.lianlianchains.com",
          data: {
            func: 'transefer',
            ccId: '',
            usr: 'frtcoinpool',
            acc: 'frtcoinpool',
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
        });

      },
      'fail': function (res) {
        console.log('输出失败信息：')
        console.log(res);
        console.log("支付失败")
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