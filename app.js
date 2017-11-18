//app.js
App({
  onLaunch: function (options) {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          console.log(res)
          if (res.code) {

            var d = that.globalData;//这里存储了appid、secret、token串    
            var l = 'https://store.lianlianchains.com/wx/getopenid?code=' + res.code;
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
              // header: {}, // 设置请求的 header    
              success: function (res) {
                console.log(res)
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (info) {
                    console.log(info)
                    wx.request({
                      url: 'https://store.lianlianchains.com/wx/decodeUserInfo',
                      data: {
                        openid: res.data.openid,
                        session_key: res.data.session_key,
                        encryptedData: info.encryptedData,
                        iv: info.iv
                      },
                      method: 'GET',  
                      success: function (secr) {
                        console.log(secr)
                        wx.setStorageSync('unionId', secr.data.userInfo.unionId);
                      }
                    });
                  }
                })



                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                obj.session_key = res.data.session_key;
                // console.log(obj);
                wx.setStorageSync('user', obj);//存储openid    
                console.log(wx.getStorageSync('user'));
              }
            });

          } else {
            console.log('获取用户登录态失败！' + res.errMsg)

          }
        }
      });
    }


  },
  globalData: {
    userInfo: null,
    storeid: "00"
  }
})