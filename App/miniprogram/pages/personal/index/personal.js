const app = getApp();

Page({
  data: {
    avatar: '',
    nickname: '',
    newLetterNumber: 0,
    serviceId: '',
    param: app.globalData.param
  },
  onLoad: function () {
    // console.log(app.globalData.userInfo)
    let userStorage = wx.getStorageSync('user');
    if (userStorage) {
      this.setData({
        user: userStorage
      })
    }
    var avatar = ''
    var nickname = ''

    if (app.globalData.userInfo) {
      avatar = app.globalData.userInfo.avatarUrl,
      nickname = app.globalData.userInfo.nickName
    }
    this.setData({
      param: app.globalData.param,
      avatar: avatar,
      nickname: nickname,
    })
  },
  onShow: function () {},
  onReady: function () {},
  /**
   * 进入消息列表
   */
  openMessage: function () {
    wx.navigateTo({
      url: '/pages/personal/message/message?type=0&new_message=0'
    })
  },

  /**
   * 进入话题列表
   */
  opendTopicList: function () {
    wx.navigateTo({
      url: '/pages/personal/topic_list/topic_list'
    })
  },
  /**
   * 进入表白墙列表
   */
  opendPostList: function () {
    wx.navigateTo({
      url: '/pages/personal/post_list/post_list'
    })
  },
  /**
   * 进入卖舍友列表
   */
  openSaleList: function () {
    wx.navigateTo({
      url: '/pages/personal/sale_list/sale_list'
    })
  },
})