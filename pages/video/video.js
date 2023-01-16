// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [], //导航的标签数据
    videoList: [],
    videoId: '',
    videoTime: [],
    isRefreshed: false,
    navId: '', //导航的标识
    offset: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData();
  },
  /* 获取导航数据 */
   async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list');
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,10),
      navId: videoGroupListData.data[0].id
    })
    //获取视频列表数据
    this.getVideoList(this.data.navId);
   },
   //点击切换导航的回调
   changeNav(event){
    // let navId = event.currentTarget.id;
    if (this.data.navId !== event.currentTarget.dataset.id) {
      this.setData({
        videoList: []
      })
    }
    this.setData({
      //navId: navId>>>0, //表示右移0位，强制转换为number
      navId: event.currentTarget.dataset.id,
      offset: 0
    })
    wx.showLoading({
      title: '加载中...'
    })
    // 动态获取当前导航对应的视频数据
    this.getVideoList(this.data.navId)
   },
   //获取视频列表数据
   async getVideoList(navId, offset = 0){
    if (!navId) return
    if(offset===0){
      this.setData({
        videoList:[]
      })
    }
    let videoListData = await request('/video/group', {id:navId, offset});
    let oldVideoListData=this.data.videoList
    let newVideoListData = await Promise.all(videoListData.datas.map(async item => {
      item.id = item.data.vid
      let result = await request('/video/url', { id: item.id })
      item.url = result.urls[0].url
      return item
    }))
    wx.hideLoading()
    this.setData({
      videoList: [...oldVideoListData,...newVideoListData],
      isRefreshed: false
    })
   },
   // 视频播放/继续播放/暂停都会触发此事件
  handlePlay(event) {
    let id = event.currentTarget.id
    this.videoContext = wx.createVideoContext(id)
    this.setData({
      videoId: id
    })
    // console.log(this.data.videoTime);
    let videoTimeItemData = this.data.videoTime
    let videoItem = videoTimeItemData.find(item => item.id === id)
    if (videoItem) {
      this.videoContext.seek(videoItem.time)
    }
  },
  // 视频存储时长
  handleTimeUpdate(event) {
    let videoTimeObj = this.data.videoTime
    let videoTimeItemData = { id: event.currentTarget.id, time: event.detail.currentTime }
    let videoItem = videoTimeObj.find(item => item.id === event.currentTarget.id)
    if (videoItem) {
      videoItem.time = event.detail.currentTime
    } else {
      videoTimeObj.push(videoTimeItemData)
    }
    this.setData({
      videoTime: videoTimeObj
    })
  },

  // 结束播放重置时长
  handleEnded(event) {
    let videoTimeItemData = this.data.videoTime
    videoTimeItemData.splice(videoTimeItemData.findIndex(item => item.id === event.currentTarget.id), 1)
    this.setData({
      videoTime: videoTimeItemData
    })
  },
  // 下拉刷新
  refresherVideoList() {
    this.getVideoList(this.data.navId)
    this.setData({
      offset:0
    })
  },

  // 触底触发
  handleLower() {
    this.setData({
      offset:this.data.offset+1
    })
    this.getVideoList(this.data.navId,this.data.offset)
  },

  // 跳转搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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
    return {
      title:'HT云音乐-视频',
      path:'/pages/video/video',
      imageUrl: '/static/images/nvsheng.jpg'
    }
  }
})