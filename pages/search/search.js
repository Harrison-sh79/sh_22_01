// pages/search/search.js
import request from '../../utils/request';
let searchValve = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSearchHistory();
    this.getInitData();
  },
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if (historyList) {
      this.setData({
        historyList,
      })
    }
  },
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data,
    });
  },
  handleInputChange(event) {
    let searchContent = event.detail.value.trim();
    if (!searchContent) {
      this.setData({
        searchList: [],
      });
      return;
    }
    this.setData({
      searchContent,
    });
    if (searchValve) return;
    searchValve = true;
    this.getSearchList();
    setTimeout(() => {
      searchValve = false;
    }, 300);

  },
  // 获取搜索列表
  async getSearchList() {
    let {
      searchContent,
      historyList
    } = this.data;
    let searchListData = await request('/search', {
      keywords: searchContent,
      limit: 10
    });
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1)
    }
    historyList.unshift(searchContent);
    wx.setStorageSync('searchHistory', historyList);
    this.setData({
      searchList: searchListData.result.songs,
      historyList
    })
  },
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  deleteSearchHistory() {
    wx.showModal({
      title: '删除历史记录 ',
      content: '确认删除历史记录么？',
      complete: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          this.setData({
            historyList: []
          });
        }
      }
    })

  },
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

  }
})