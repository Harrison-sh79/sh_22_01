// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  /**
   * 表单项发生问题的回调函数 
   */
  handleInput(event) {
    // let type = event.currentTarget.id; 
    let type = event.currentTarget.dataset.type;
    this.setData({
      [type]: event.detail.value
    })
  },

  async login() {
    let {
      phone,
      password
    } = this.data;
    //前端验证
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'error'
      })
      return;
    }
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'error'
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'error'
      })
      return;
    };
    //后端验证
    let result = await request('/login/cellphone', {phone,password,isLogin:true}) 
    if(result.code === 200){
       wx.showToast({
         title: '登陆成功',
         icon:'success'
       })
       wx.setStorageSync('userInfo', JSON.stringify(result.profile))
       wx.reLaunch({
         url: '/pages/personal/personal',
       })
    }else if(result.code === 501 || result.code === 502){
      wx.showToast({
        title: '账号或密码错误',
        icon:'error'
      })
    }else {
      wx.showToast({
        title: '登陆失败，请重新登录',
        icon:'error'
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})