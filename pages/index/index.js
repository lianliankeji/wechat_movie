// pages/index/index.js
import fetch from '../../utils/fetch.js'

let movieList = []
let page = 0
let totalpage = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vurl: 'https://store.lianlianchains.com/videos/',
    vid: '0'
  },
  play(e) {

    console.log(e)

    this.data.vid = e.target.dataset.vid;
    this.data.up = e.target.dataset.up;
    this.videoContext = wx.createVideoContext(this.data.vid + '')

    if (wx.getStorageSync('unionId') == this.data.up) {
      return
    }

    fetch({
      url: '/video/validate',
      //   baseUrl: "http://192.168.50.57:9888", 
      baseUrl: "https://store.lianlianchains.com",
      data: {
        'id': this.data.vid,
        'openid': wx.getStorageSync('unionId')
      },
      noLoading: false,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
      //  header: { 'content-type': 'application/json' }
    }).then(res => {
      console.log(res)

      if (res.ec == '000000') {

        if (res.data == '0') {

          this.videoContext.pause();

          wx.navigateTo({
            url: '../buy/buy?vid=' + this.data.vid + '&up=' + this.data.up,
          })

        }
      }


    }).catch(err => {

      console.log("出错了")
      wx.showToast({
        title: '网络繁忙'
      })
      console.log(err)
    })

  },
  querymovie() {

    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading'
    // });

    fetch({
      url: "/video/queryvideo",
      //   baseUrl: "http://192.168.50.57:9888",
      baseUrl: "https://store.lianlianchains.com",
      data: {
        'page': page,
        'pagenum': 5
      },
      method: "GET",
      noLoading: true,
      header: { 'content-type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      console.log(res)

      totalpage = res.data.totalpage
      movieList = movieList.concat(res.data.video)

      console.log(movieList)

      this.setData({
        movieList: movieList
      })

      // wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();

      //wx.hideToast();

    }).catch(err => {

      wx.showToast({
        title: '出错了',
      })
      console.log(err)

      this.data.hasOrder = true
    })

  },
  loadMore() {

    console.log(totalpage)
    console.log(page)

    if (page >= totalpage - 1) {

      console.log("没有更多了")
      page = totalpage

      wx.hideToast();

    } else {

      console.log("加载更多")
      page++

      this.querymovie()
    }
  },
  initfrt() {

    fetch({
      url: '/frt/query',
      //   baseUrl: "http://192.168.50.57:9888", 
      baseUrl: "https://store.lianlianchains.com",
      data: {
        func: 'queryAcc',
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

        if (res.result == '0') {

          // 开户
          this.createfrt();

        } else {

          // 查询
          this.queryfrt();
        }

      }
    }).catch(err => {

      console.log("出错了")
      wx.showToast({
        title: '网络繁忙'
      })
      console.log(err)
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
  createfrt() {

    fetch({
      url: '/frt/register',
      //   baseUrl: "http://192.168.50.57:9888", 
      baseUrl: "https://store.lianlianchains.com",
      data: {
        func: 'account',
        ccId: '39304981a1b8d8a2dba6dc1b318267daa5c7ba4acfea4a99dab15e7ef9aee2c2',
        usr: wx.getStorageSync('unionId'),
        acc: wx.getStorageSync('unionId')
      },
      noLoading: false,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' }
      //  header: { 'content-type': 'application/json' }
    }).then(result => {

      console.log(result)
      if (result.code == '0') {
        this.setData({
          frt: 0
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
    // frt
    this.initfrt();
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

    movieList = []
    page = 0
    totalpage = 0

    this.querymovie();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('hide')

    this.videoContext = wx.createVideoContext(this.data.vid + '')
    this.videoContext.pause()

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

    console.log('onPullDownRefresh')

    // wx.showNavigationBarLoading()

    movieList = []
    page = 0
    totalpage = 0

    this.querymovie();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})