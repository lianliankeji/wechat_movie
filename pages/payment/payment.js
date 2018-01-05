// pages/buy/buy.js
import fetch from '../../utils/fetch.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    frt:'',
    money:'',
    codestate: "发 送",
    smsCode: '',
    smsBtn: false,
    password:''
  },
  moneyInput(e) {
    if (e.detail.value-0 > this.data.frt-0) {
      this.setData({
        money: this.data.frt
      });
      return
    }
    this.setData({
      money: e.detail.value
    })
  },
  passwordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    var that = this
    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {

      wx.request({
        url: 'https://store.lianlianchains.com/video/wx/decodePhone/',
        data: {
          openid: wx.getStorageSync('user').openid,
          session_key: wx.getStorageSync('user').session_key,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: 'GET',
        success: function (secr) {
          console.log(secr);

          that.setData({
            mobile: secr.data.ret.phone
          })

        }
      });

    }
  },

  phoneInput(e) {
    this.setData({
      mobile: e.detail.value
    });
  },

  sendMsg() {
    if (this.data.mobile) {
      this.sendSms();
    } else {
      wx.showModal({
        content: '手机号不能为空',
        showCancel: false,
        confirmColor: '#DDBF90'
      });
      return;
    }

    let num = 60;

    var timer = setInterval(() => {
      if (num === 1) {
        this.setData({
          codestate: '发送',
          smsBtn: false
        });
        clearInterval(timer);
      } else {
        num--;
        this.setData({
          codestate: num + ' s',
          smsBtn: true
        });
      }
    }, 1000);
  },

  sendSms() {
    fetch({
      url: "/sms/send",
      //   baseUrl: "http://192.168.50.57:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        mobile: this.data.mobile
      },
      noLoading: true,
      method: "GET",
      //   header: { 'content-type': 'application/x-www-form-urlencoded' }
      header: { 'content-type': 'application/json' }
    }).then(result => {
      if (result.code != 200) {
        wx.showToast({
          title: '发送密码失败'
        })

      } else {

      }
    }).catch(err => {
      console.log(err)
    });
  },

  smsInput(e) {
    this.setData({
      smsCode: e.detail.value
    });
  },

  buy() {
    if (!this.data.money) {
      wx.showModal({
        content: '金额不能为空',
        showCancel: false,
        confirmColor: '#DDBF90'
      });

      return
    }
    if (!this.data.smsCode) {
      wx.showModal({
        content: '验证码不能为空',
        showCancel: false,
        confirmColor: '#DDBF90'
      });

      return
    }
    if (parseInt(this.data.frt) < parseInt(this.data.money)) {
      wx.showModal({
        title: '余额不足请充值',
        showCancel: false,
        confirmColor: '#DDBF90'
      })

    } 

    fetch({
      url: "/sms/verify",
      //   baseUrl: "http://192.168.50.57:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        mobile: this.data.mobile,
        code: this.data.smsCode,
      },
      noLoading: true,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
      // header: { 'content-type': 'application/json' }
    }).then(result => {
      if (result.code == 200) {
        console.log("校验成功")
        var openId = wx.getStorageSync('user').openid;
        var payMoney = 0.01;
        var score = this.data.money;
        this.prepay(openId, payMoney, score);
      } else {
        wx.showToast({
          title: '验证码错误',
          duration: 1500
        })
      }
    }).catch(err => {
      console.log("出错了")
      console.log(err)

    });

  },
  prepay(openId, payMoney, score) {
    console.log("支付钱数：" + payMoney);
    var that = this;
    fetch({
      url: "/video/prepay",
      //  baseUrl: "http://192.168.50.239:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        'openid': openId,
        'fee': payMoney,
        'description': wx.getStorageSync('unionId') + "至" + wx.getStorageSync('reaccID')+"的转账"
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
      that.sign(prepay_id, score);
    }).catch(err => {

    });
  },
  //签名
  sign(prepay_id, score) {
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
      that.requestPayment(result, score);
    }).catch(err => {

    });
  },
  //申请支付
  requestPayment: function (obj, score) {
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
          url: '/frt/invoke',
          // baseUrl: "https://123.207.144.58",
          baseUrl: "https://store.lianlianchains.com",
          data: {
            func: 'transefer',
            ccId: '',
            usr: wx.getStorageSync('unionId'),
            acc: wx.getStorageSync('unionId'),
            reacc: wx.getStorageSync('reaccID'),
            desc: "转账汇款",
            amt: score
          },
          noLoading: false,
          method: "GET",
          header: { 'content-type': 'application/x-www-form-urlencoded' }
          //  header: { 'content-type': 'application/json' }
        }).then(res => {
          console.log(res);
          wx.showModal({
            content: '交易成功',
            showCancel: false,
            confirmColor: '#DDBF90',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../user/user',
                })
              }
            }
          });
        
        }).catch(err => {

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

    fetch({
      url: '/frt/query',
      //   baseUrl: "http://192.168.50.57:9888", 
      baseUrl: "https://store.lianlianchains.com",
      data: {
        func: 'getBalance',
        ccId: '',
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
          frt: res.result,
          money: res.result
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