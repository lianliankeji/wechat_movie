// pages/transfer/transfer.js
import fetch from '../../utils/fetch.js';
import { timeformat } from '../../utils/date.js'
let orderList = [];
let page = 0;
let pageSize = 10;
let pageStart = 1 + page * pageSize;
let totalpage = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:[],
    hasMore: true
  },
  scanCode() {
    wx.navigateTo({
      url: '../receive/receive',
    })
  },
  pay() {
    wx.scanCode({
      success: (res) => {
        console.log(res);
        wx.setStorageSync('reaccID', res.result)
        wx.navigateTo({
          url: '../payment/payment',
        })
      }
    })
   
  },
  loadMore() {
      fetch({
        url: "/frt/query",
          // baseUrl: "https://123.207.144.58",
        baseUrl: "https://store.lianlianchains.com",
        data: {
            func:'getTransInfo',
            ccId:'',
            usr:'centerBank',
            acc:'centerBank',
            bsq:pageStart,
            cnt:pageSize,
            qacc: wx.getStorageSync('unionId')
        },
        method: "GET",
        noLoading: true,
        header: { 'content-type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        console.log(res);
        if (res.result.records && res.result.records.length < pageSize) {
          this.setData({
            hasMore: false
          });

          if (res.result.records.length > 0) {
            var details = this.data.details.concat(res.result.records);
            for (var i = 0; i < details.length; i++) {
              details[i].time = timeformat(details[i].time, "YYYY/MM/DD");
            }
            this.setData({
              details: details
            });
          }
          if (res.result.records && res.result.records.length == 0) {
            return
          }

          return
        } 

        page++;
        pageStart = 1 + page * pageSize;

        var details = this.data.details.concat(res.result.records);
        for (var i = 0; i < details.length; i++) {
          details[i].time = timeformat(details[i].time, "YYYY/MM/DD");
        }

        this.setData({
          details: details
        });
        
      }).catch(err => {
        console.log("出错了")
        wx.showToast({
          title: '出错了',
        })
        console.log(err)
      });
    // }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0;
    pageStart = 1 + page * pageSize;
    this.loadMore();
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
    if(this.data.hasMore) {
      this.loadMore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})