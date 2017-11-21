//request请求封装
export default function (param) {
  console.log(param);
  if (!param.noLoading) {
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    //   duration: 10000
    // })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: param.baseUrl + param.url,
      data: param.data,
      header: param.header || { 'content-type': 'application/json' },
      method: param.method || "GET",// OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        // wx.hideNavigationBarLoading()
        wx.hideToast();
        resolve(res.data)
      },
      fail: function (msg) {
        console.log('reqest error', msg)
        // wx.hideNavigationBarLoading()
        // wx.hideToast();
        reject('fail')
      }
    })
  })
}