// pages/personal/sale_list/sale_list.js
const app = getApp();
const util = require("../../../utils/util.js");

let genderArray = ['男', '女', '人妖', '未知生物'];

Page({
  data: {
    baseImageUrl: app.globalData.imageUrl,
    currentTime: '',
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    showGeMoreLoadin: false,
    notDataTips: false,
    newMessage: false,
    newMessageNumber: 0,
    select: 1,

    leftList: [],
    rightList: [],
    leftHeight: 0,
    rightHeigt: 1,
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    });
    // 获取列表
    this.getList();
    //设置当前时间
    this.setData({
      currentTime: util.formatTime(new Date())
    });
  },

  onShow: function() {
      this.setData({
          select: 1,
          sales: []
      })

      this.setData({
          pageNumber: this.data.initPageNumber,
          leftList: [],
          rightList: [],
          leftHeight: 0,
          rightHeigt: 1,
          objType: 1
      });


      this.getList()
    
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '喜欢ta，那就说出来吧',
      path: '/pages/index/index',
      imageUrl: 'http://image.kucaroom.com/sale_friend_bg.jpg',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },

  /**
   * 获取具体类型的贴子
   */
  selected: function(e) {
    let objType = e.target.dataset.type;
    this.setData({
      select: objType,
      sales: []
    })

    this.setData({
      pageNumber: this.data.initPageNumber,
      leftList: [],
      rightList: [],
      leftHeight: 0,
      rightHeigt: 1
    });
    this.getList();
  },

  /**
   * 进入发表页面
   */
  post: function() {
    wx.navigateTo({
      url: '/pages/sale/post_sale/post_sale'
    })
  },

  /**
   * 进入详情页面
   */
  comment: function(e) {
    let id = e.currentTarget.dataset.objid;
    wx.navigateTo({
      url: '/pages/sale/comment_sale/comment_sale?id=' + id
    })
  },

  /**
   * 进入新消息列表
   */
  openMessage: function() {
    wx.navigateTo({
      url: '/pages/personal/message/message?type=0&new_message=1'
    })
  },

  /**
   * 获取贴子列表
   */
  getList: function() {
    var that = this
    let leftList = this.data.leftList;
    let rightList = this.data.rightList;
    let leftHeight = this.data.leftHeight;
    let rightHeigt = this.data.rightHeigt;
    // 获取自己的帖子
    const db = wx.cloud.database()
    db.collection('sale_friends').where({
      _openid: app.globalData.userId // 填入当前用户 openid
    }).get({
      success(res) {
        // console.log(res.data)
        if (res.errMsg == "collection.get:ok") {

          const datalength = res.data.length
          let item

          console.log(res.data.length)

          for (var i = 0; i < datalength; i++) {

            // console.log(i, res.data[i])

            var data = res.data[i]

            item = {
              "poster": data.poster,
              "id": data._id,
              "comment_number": data.comment_number,
              "attachments": data.attachments
            }

            console.log(i, item)

            if (datalength >= 0) {

              // console.log(i, leftHeight, rightHeigt)

              if (leftList.length <= rightList.length) {
                leftList.push(item);
                leftHeight += data.attachments[0]['height'];
              } else {
                rightList.push(item)
                rightHeigt += data.attachments[0]['height'];
              }
            }
            that.setData({
              leftList: leftList,
              rightList: rightList,
              leftHeight: leftHeight,
              rightHeigt: rightHeigt,
            })
          }

        }
        wx.hideLoading();
        that.setData({
          showGeMoreLoadin: false
        });

      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})