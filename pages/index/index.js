// pages/index/index.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图的数据
    recommendList:[], //推荐歌单数据
    topList:[], //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    // 获取最上方轮播图的数据
    let bannerListData = await request('/banner', {type: 2});
    this.setData({
      bannerList: bannerListData.banners
    })
    // 获取Scroll内容的数据
    let recommendListData = await request('/personalized', {limit: 10});
    this.setData({
      recommendList: recommendListData.result
    })
    // 获取排行榜的数据
    let index = 0;
    let resultArr = [];
    let ids=[3779629,19723756,2884035,3778678,10520166,180106]
    while (index < 6) {
      let topListData = await request('/playlist/detail', {id: ids[index++]});
      let topListItem = {
        name: topListData.playlist.name, 
        tracks: topListData.playlist.tracks.slice(0, 3)
      };
      resultArr.push(topListItem); 
      this.setData({
        topList: resultArr
      })
    }
    /* this.setData({
      topList: resultArr
    }) */
  },

  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSongs/recommendSongs',
    })
  },
  toOther(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
    })
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