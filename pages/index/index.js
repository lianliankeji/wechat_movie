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
    hidden: false,
    vurl: 'https://store.lianlianchains.com/videos/'
  },
  showvideo() {

    this.data.vid = 1;

    fetch({
      url: '/video/validate',
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

      if (res.ec == '000000') {

        if (res.data == '0') {

          wx.navigateTo({
            url: '../buy/buy?vid=' + this.data.vid,
          })

        } else {

          this.setData({
            hidden: true
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
      this.setData({
        movieList: res.data.video  
      })

      wx.stopPullDownRefresh();

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

    } else {

      console.log("加载更多")
      page++

      this.querymovie()
    }
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

    this.videoContext = wx.createVideoContext('myVideo')
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

    this.videoContext.stop;
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