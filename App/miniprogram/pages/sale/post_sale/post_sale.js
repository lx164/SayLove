// pages/sale/post_sale/post_sale.js
const app = getApp();
let genderArray = ['男', '女', '人妖', '未知生物'];

Page({
  data: {
    array: genderArray,
    userImage: '',
    name: '',
    major: '',
    gender: '',
    genderValue: '',
    expectation: '',
    introduce: false,
    attachments: [],
    imageArray: [],
    imgList: [],

    icon: {
      "width": "100rpx",
      "height": "100rpx",
      "path": ""
    }
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      gender: genderArray[e.detail.value],
      genderValue: e.detail.value
    })
  },
  ChooseImage() {
    var that = this
    var img
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        // console.log(res)
        let imgdata = that.data.imgList.concat(res.tempFilePaths)
        let imglistlength = that.data.imgList.length
        let imgurl = res.tempFilePaths[0]

        // 获取图片信息
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res) { 
            img = {
              "width": res.width,
              "height": res.height,
              "url": imgurl
            }
            let attachments = that.data.attachments
            console.log(attachments)
            attachments.push(img)

            // console.log(attachments)
            // console.log(imglistlength)
            // console.log(res.width)
            // console.log(res.height)
            if (imglistlength == 0) {
              that.setData({
                attachments:attachments
              })
            } else {
              that.setData({
                attachments: res.tempFilePaths
              })
            }
          }
        })
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            attachments: this.data.imgList
          })
        }
      }
    })
  },
  getName: function(e) {
    let value = e.detail.value;
    this.setData({
      name: value
    });
  },

  getMajor: function(e) {
    let value = e.detail.value;
    this.setData({
      major: value
    });
  },

  getLike: function(e) {
    let value = e.detail.value;
    this.setData({
      expectation: value
    });
  },

  getContent: function(e) {
    let value = e.detail.value;
    this.setData({
      introduce: value
    });
  },
  /**
   * 
   * 提交数据
   */
  post: function() {
    var that = this
    // 时间
    var nowtime = app.getnowtime()
    console.log(nowtime)
    this.setData({
      canPost: false
    })
    let attachments = this.data.attachments;
    let name = this.data.name;
    let gender = this.data.genderValue;
    let major = this.data.major;
    let expectation = this.data.expectation;
    let introduce = this.data.introduce;

    this.data.imageArray.map(item => {
      attachments.push(item.uploadResult.key)
    })

    if (!name) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      })
      return false;
    }

    if (!gender) {
      wx.showToast({
        title: '性别不能为空',
        icon: 'none'
      })
      return false;
    }

    if (attachments.length <= 0) {
      wx.showToast({
        title: '图片不能为空',
        icon: 'none'
      })
      return false;
    }

    wx.showLoading({
      title: '发送中...',
    })

    if ( gender == 0 ){
      gender = '男'
    } else if (gender == 1){
      gender = '女'
    } else if (gender == 2){
      gender = '人妖'
    } else if (gender == 3){
      gender = '未知生物'
    }
    // 1. 获取数据库引用
    const db = wx.cloud.database()
    db.collection('sale_friends').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        "poster": {
          "avatar": app.globalData.userInfo.avatarUrl,
          "gender": app.globalData.userInfo.gender,
          "nickname": app.globalData.userInfo.nickName
        },
        "id": "",
        "owner_id": app.globalData.userId,
        "college_id": "学校Id",
        "name": name,
        "gender": gender,
        "major": major,
        "expectation": expectation,
        "introduce": introduce,
        "attachments": attachments,
        "comment_number": 0,
        "comments": [],
        "praise_number": 0,
        "praise": [],
        "type": "预留字段",
        "status": "预留字段",
        "created_at": nowtime,
        "updated_at": nowtime
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
        var date = new Date
        const year = date.getFullYear().toString()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        var uptime = year + month.toString() + day.toString() + hour + minute + second
        var path = res._id + uptime + '.png'

        var _id = res._id

        console.log(_id)
        
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: path,
          // 指定要上传的文件的小程序临时文件路径
          filePath: attachments[0].url,
          
          // 成功回调
          success: res => {
            console.log('上传成功', res)
            that.setData({
              canPost: true
            })

            wx.hideLoading();
           
            // 文件上传成功
            if (res.errMsg == "cloud.uploadFile:ok") {
              var fileid = res.fileID

              attachments[0].url = res.fileID

              console.log('uuuu',attachments);

              db.collection('sale_friends').doc(_id).update({
                // data 传入需要局部更新的数据
                data: {
                  "attachments": attachments,
                },
                success: console.log,
                fail: console.error
              })
              app.globalData.reloadSale = true;
              wx.navigateBack({
                comeBack: true
              });
            } else {
              wx.showToast({
                title: res.errMsg,
                icon: 'none'
              });
              setTimeout(function() {
                wx.hideLoading();
              }, 1500)
            }
          },
          fail: console.error
        })

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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