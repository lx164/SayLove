const app = getApp();
const config = require("../../../config.js");
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
        messagefunc: Object
    },
    // 创建新的消息盒子
    message: function(data) {
        // 评论、点赞人昵称
        var nickname = data.nickname
        // 评论、点赞人头像
        var avatar = data.avatar
        // 更新时间
        var updatetime = app.getnowtime()
        // 评论、点赞内容
        var content = data.content
        // 接收的用户openid
        var messageuser = data.messageuser
        // 当前帖子id
        var objId = data.objId
        // 帖子类型
        var obj_type = data.obj_type
        // 更新消息
        const db = wx.cloud.database()
        db.collection('message').add({
            data: {
                "from_user": {
                    "avatar": avatar,
                    "nickname": nickname
                },
                "created_at": updatetime,
                "content": content,
                "isread": false,
                "messageuser": messageuser,
                "objId": objId,
                "obj_type": obj_type

            },
            success(res) {
                // console.log('messageres',res)
            },
            fail: console.log
        })
    },
    // 获取新的消息盒子提醒
    newmessage: function() {
        var that = this
        const db = wx.cloud.database()
        db.collection('message')
            .orderBy('created_at', 'desc')
            .where({
                messageuser: app.globalData.userId
            })
            .get({
                success(res) {
                    console.log('newmessage', res)
                    var data = res.data
                    // 未读新消息数,初始化为0
                    var newMessageNumber = 0
                    var list = []
                    for (var i = 0; i < data.length; i++) {
                        // 未读消息
                        if (!data[i].isread) {
                            newMessageNumber = newMessageNumber + 1
                        }
                        // 未读消息id
                        // list.push(data[i]._id)
                    }
                    // 判断是否有新消息
                    if (newMessageNumber > 0) {
                        that.setData({
                            newMessageNumber: newMessageNumber,
                            newMessage: true
                        })
                    }
                }
            })
    },
    // 进入消息页面
    openMessage: function() {
        console.log(app.globalData.userId)
        var that = this
        wx.cloud.callFunction({
            name: 'Message',
            data: {
                id: app.globalData.userId
            },
            success: res => {
                console.log,
                    wx.navigateTo({
                        url: '../../personal/message/message'
                    })
                that.setData({
                    newMessageNumber: 0,
                    newMessage: false
                })
            },
            fail: console.error
        })
    },
    // 页面加载
    onLoad: function() {
        var that = this
        wx.showLoading({
            title: '加载中',
        });
        this.getList();
        // 获取新消息提醒,每20秒刷新一次
        // 刷新消息
        this.setData({
            messagefunc: setInterval(function() {
                that.newmessage()
                console.log('flash')
            }, config.FLASHTIME)
        })
    },

    onShow: function() {
        var that = this
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
        // 清除定时任务
        clearInterval(this.data.messagefunc)
        // 获取新消息提醒,每20秒刷新一次
        // 刷新消息
        this.setData({
            messagefunc: setInterval(function() {
                that.newmessage()
                console.log('flash')
            }, config.FLASHTIME)
        })

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

        if (objType == 1) {
            // 全部
            this.getList()
        } else if (objType == 2) {
            // 喜欢
            this.mylike()
        } else if (objType == 3) {
            // 最新
            this.newest()
            console.log('new')
        } else if (objType == 4) {
            // 最热
            this.host()
        }
    },
    // 获取帖子
    getList: function() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        let leftList = this.data.leftList;
        let rightList = this.data.rightList;
        let leftHeight = this.data.leftHeight;
        let rightHeigt = this.data.rightHeigt;
        // 读取数据
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('sale_friends')
            .get({
                success(res) {
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        let comment_number
                        for (var i = 0; i < datalength; i++) {
                            var data = res.data[i]
                            item = {
                                "poster": data.poster,
                                "id": data._id,
                                "comment_number": data.comment_number,
                                "praise_number": data.praise_number,
                                "attachments": data.attachments
                            }
                            if (datalength >= 1) {
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

    // 喜欢
    mylike: function() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        let leftList = this.data.leftList;
        let rightList = this.data.rightList;
        let leftHeight = this.data.leftHeight;
        let rightHeigt = this.data.rightHeigt;
        // 读取数据
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('mylike')
            .where({
                _openid: app.globalData.userId
            })
            .get({
                success(res) {
                    // console.log(res)
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        for (var i = 0; i < datalength; i++) {
                            var saleid = res.data[i].saleid
                            var currid = i
                            //   console.log(currid)
                            db.collection('sale_friends')
                                .where({
                                    _id: saleid
                                })
                                .get({
                                    success(res) {
                                        // console.log(res)
                                        let data = res.data[0]
                                        item = {
                                            "poster": data.poster,
                                            "id": data._id,
                                            "comment_number": data.comment_number,
                                            "praise_number": data.praise_number,
                                            "attachments": data.attachments
                                        }
                                        // console.log(currid)
                                        // console.log(datalength)
                                        if (datalength >= 1) {
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
    // 最新
    newest: function() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        let leftList = this.data.leftList;
        let rightList = this.data.rightList;
        let leftHeight = this.data.leftHeight;
        let rightHeigt = this.data.rightHeigt;
        // 读取数据
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('sale_friends')
            .orderBy('updated_at', 'desc')
            .get({
                success(res) {
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        let comment_number
                        for (var i = 0; i < datalength; i++) {
                            var data = res.data[i]
                            comment_number = data.comments.length
                            item = {
                                "poster": data.poster,
                                "id": data._id,
                                "comment_number": comment_number,
                                "praise_number": data.praise_number,
                                "attachments": data.attachments
                            }
                            if (datalength >= 1) {
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
    // 最热
    host: function() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        let leftList = this.data.leftList;
        let rightList = this.data.rightList;
        let leftHeight = this.data.leftHeight;
        let rightHeigt = this.data.rightHeigt;
        // 读取数据
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('sale_friends')
            .orderBy('comments', 'desc')
            .orderBy('praise_number', 'desc')
            .get({
                success(res) {
                    console.log('hostest', res)
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        let comment_number
                        for (var i = 0; i < datalength; i++) {
                            var data = res.data[i]
                            comment_number = data.comments.length
                            item = {
                                "poster": data.poster,
                                "id": data._id,
                                "comment_number": comment_number,
                                "praise_number": data.praise_number,
                                "attachments": data.attachments
                            }
                            if (datalength >= 1) {
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
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        console.log('onhidden')
        clearInterval(this.data.messagefunc)
    },
})