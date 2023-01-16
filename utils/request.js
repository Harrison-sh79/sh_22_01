import config from './config'

export default (url, data={},method='GET') => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      // url: config.mobileHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find((item)=>
          item.indexOf('MUSIC_U') !== -1) : ' '
      },
      success: (res) => {
        if(data.isLogin){
          // 将用户登录的cookies存入本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        // console.log('Success:', res);
        resolve(res.data); 
      },
      fail: (err) => {
        // console.log('Error:', err);
        reject(err);
      }
    })
  })
}