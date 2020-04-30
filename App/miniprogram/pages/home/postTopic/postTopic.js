// pages/home/post/post.js
const app = getApp();

Page({
    data: {
        logs: [],
        imageArray: [],
        attachments: [],
        private: false,
        textContent: '',
        name: '',
        phone: '',
        param: app.globalData.param,

        imgList: [],
        modalName: null,

        icon: {
            width: "100rpx",
            height: "100rpx",
            path: "",
            showImage: true
        },
        canPost: true
    },

    ChooseImage() {
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                if (this.data.imgList.length != 0) {
                    this.setData({
                        attachments: this.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    this.setData({
                        attachments: res.tempFilePaths
                    })
                }
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
    /** 提交 */
    post: function () {
        var that = this
        // 时间
        var nowtime = app.getnowtime()
        console.log(nowtime)
        this.setData({
            canPost: false
        })

        let content = this.data.textContent;
        let attachments = this.data.attachments;
        let privateValue = this.data.private;
        let username = this.data.name;
        let mobile = this.data.phone;

        //获取图片
        this.data.imageArray.map(item => {
            attachments.push(item.uploadResult.key)
        })

        if (content == '' && attachments == '') {
            wx.showLoading({
                title: '内容不能为空！',
            });
            this.setData({
                canPost: true
            })
            setTimeout(function () {
                wx.hideLoading();
            }, 1500)
            return false;
        }

        wx.showLoading({
            title: '发送中..'
        });
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        // 2. 构造查询语句
        // collection 方法获取一个集合的引用
        // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
        // get 方法会触发网络请求，往数据库取数据
        db.collection('topics').add({
            // data 字段表示需新增的 JSON 数据
            data: {
                "poster": {
                    "avatar": app.globalData.userInfo.avatarUrl,
                    "gender": app.globalData.userInfo.gender,
                    "nickname": app.globalData.userInfo.nickName
                },
                'username': username,
                'mobile': mobile,
                "poster_id": app.globalData.userId,
                "college_id": "所属学校",
                "content": content,
                "attachments": attachments,
                "topic": "主题,预留字段",
                "type": "",
                "status": false,
                "private": privateValue,
                "comment_number": 0,
                "parise": [],
                "comment": [],
                "praise_number": 0,
                "view_number":0,
                "created_at": nowtime,
                "updated_at": nowtime
            },
            success(res) {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                console.log('提交结果', res)
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

                if(attachments.length==0){
                    app.globalData.reloadHome = true;
                    wx.navigateBack({
                      comeBack: true
                    });
                    return false
                  }

                wx.cloud.uploadFile({
                    // 指定上传到的云路径
                    cloudPath: path,
                    // 指定要上传的文件的小程序临时文件路径
                    filePath: attachments[0],
                    // 成功回调
                    success: res => {
                        console.log('上传成功', res)
                        that.setData({
                            canPost: true
                        })

                        wx.hideLoading();
                        console.log('w', res.errMsg);
                        // 文件上传成功
                        if (res.errMsg == "cloud.uploadFile:ok") {
                            var fileid = res.fileID
                            db.collection('topics').doc(_id).update({
                                // data 传入需要局部更新的数据
                                data: {
                                    "attachments": [fileid],
                                },
                                success: console.log,
                                fail: console.error
                            })
 
                            // app.globalData.reloadHome = true;
                            app.globalData.isposttopic = true
                            wx.switchTab({
                                url: '../index/index'
                            })
                        } else {
                            wx.showToast({
                                title: res.errMsg,
                                icon: 'none'
                            });
                            setTimeout(function () {
                                wx.hideLoading();
                            }, 1500)
                        }


                    },
                })

            }
        })


        // ##################################################################################
    },
    getName: function (event) {
        let value = event.detail.value;
        this.setData({
            name: value
        });
    },
    getPhone: function (event) {
        let value = event.detail.value;
        this.setData({
            phone: value
        });
    },


    /**
     * 预览图片
     */
    previewImage: function (event) {
        let url = event.target.id;
        wx.previewImage({
            current: '',
            urls: [url]
        })
    },

    /**
     * 设置是否匿
     */
    setPrivate: function (event) {
        this.setData({
            private: event.detail.value
        });
    },

    /**
     * 获取输入内容
     */
    getTextContent: function (event) {
        let value = event.detail.value;
        this.setData({
            textContent: value
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) { },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})