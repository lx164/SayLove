// pages/sale/comment_sale/comment_sale.js
const app = getApp();
let genderArray = ['男', '女', '人妖', '未知生物'];

Page({
    data: {
        sale: [],
        comments: [],
        baseImageUrl: app.globalData.imageUrl,
        showCommentInput: false,
        content: '',
        objId: '',
        objType: '',
        refCommentId: '', 
        attachments: '',
        canFollow: true,
        param: app.globalData.param
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this
        this.setData({
            param: app.globalData.param
        })
        // 当前舍友详情的数据id
        var id = options.id
        // 是否可以删除
        var can_delete = false
        // 获取userInfo
        var userInfo = wx.getStorageSync('userInfo')
        // console.log('nickanme', userInfo)
        // 获取自己的openid或昵称
        var ownernickname = userInfo.nickName
        var owneropenid = app.globalData.userId

        // 数据库
        const db = wx.cloud.database()
        db.collection('sale_friends')
            .where({
                _id: id // 填入当前用户 openid
            }).get({
                success(res) {
                    console.log(res)
                    var data = res.data[0]
                    if (res.errMsg == "collection.get:ok") {
                        let comment_number = data.comments.length
                        let _openid = data._openid
                        var isfollow = true
                        // 判断是否可删除
                        if (owneropenid === _openid) {
                            can_delete = true
                        }
                        // console.log('fll', data.praise.indexOf(owneropenid))
                        // 判断是否已经follow
                        if (data.praise.indexOf(owneropenid) === -1) {
                            // 没有follow
                            isfollow = false
                        }
                        var saledata = {
                            "name": data.name,
                            "gender": data.gender,
                            "major": data.major,
                            "expectation": data.expectation,
                            "introduce": data.introduce,
                            "id": data._id,
                            "follow": isfollow,
                            "follower": data.praise,
                            "follow_number": data.praise_number,
                            "can_delete": can_delete,
                            "comment_number": comment_number,
                            "attachments": data.attachments,
                            "comments": data.comments,
                            "posteropenid": data._openid
                        }
                        that.setData({
                            sale: saledata,
                            objId: data._id,
                            comments: data.comments
                        });
                        wx.hideLoading()
                    }
                },
                fail: function() {
                    wx.hideLoading()
                    wx.showToast({
                        title: '加载失败',
                    })
                }
            })
    },
    // 删除帖子
    deleteSale: function(e) {
        var that = this
        var id = e.currentTarget.dataset.id
        var fileid = e.currentTarget.dataset.fileid

        wx.showModal({
            title: '提示',
            content: '确定删除这个卖舍友吗？',
            success(res) {
                if (res.confirm) {
                    // 获取自己的帖子
                    const db = wx.cloud.database()
                    // 删除帖子
                    db.collection('sale_friends')
                        .doc(id)
                        .remove({
                            success: res => {
                                console.log(res)
                                // 删除帖子的图片
                                wx.cloud.deleteFile({
                                    fileList: [fileid],
                                    success: res => {
                                        // handle success
                                        console.log(res)
                                        console.log(res.fileList)
                                        // 获取删除后的帖子列表
                                        // that.getPost()
                                        wx.showToast({
                                            title: '已删除',
                                        })
                                        wx.navigateBack({

                                        })
                                    },
                                    fail: err => {
                                        wx.showToast({
                                            title: '删除失败',
                                        })
                                    }
                                })
                            },
                            fail: err => {
                                // console.log(err)
                                wx.showToast({
                                    title: '删除失败',
                                })
                            },
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 关闭评论框
    hideModal(e) {
        this.setData({
            content: '',
            modalName: null
        })
    },
    // follow,喜欢
    follow: function(e) {
        var that = this
        var sale = this.data.sale
        var userInfo = wx.getStorageSync('userInfo')
        var owneropenid = app.globalData.userId

        let index = sale.follower.indexOf(owneropenid)
        console.log('index', index)

        // 判断是否已经follow
        if (sale.follower.indexOf(owneropenid) === -1) {
            // 没有follow，可以follow
            sale.follow = true
            sale.follower.push(owneropenid)
            // 保存到喜欢
            const db = wx.cloud.database()
            db.collection('mylike').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                    userid: owneropenid,
                    saleid: that.data.objId
                },
                success(res) {
                    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                    // console.log('mylike结果',res) 
                },
                fail: console.error
            })
        } else {
            // 已经follow，再次点击就取消follow
            sale.follow = false
            let index = sale.follower.indexOf(owneropenid)
            sale.follower.splice(index, 1)
            // 删除mylike
            wx.cloud.callFunction({
                name: 'DeleteMyLike',
                data: {
                    "id": that.data.objId,
                    "dbname": 'mylike'
                },
                success: console.log,
                fail: console.err
            })

        }
        let newpraise_number = sale.follower.length
        sale.follow_number = newpraise_number
        // messagedata
        var mesdata = {
            nickname: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            content: '@' + userInfo.nickName + ' 喜欢你舍友!',
            messageuser: that.data.sale.posteropenid,
            objId: that.data.objId,
            obj_type: 'sale'
        }

        // 调用云函数,更改follow
        wx.cloud.callFunction({
            name: 'SaleZan',
            data: {
                id: that.data.objId,
                praise_number: newpraise_number,
                praise: sale.follower
            },
            success: res => {
                // res 是一个对象， 其中有 _id 字段标记刚创建的记录的 id
                //发送信息
                that.message(mesdata)
            },
            fail: err => {}
        })
        ////////////////
        this.setData({
            sale: sale
        })
    },
    /**
     * 获取评论框的输入内容
     */
    getCommentContent: function(event) {
        let content = event.detail.value;
        this.setData({
            content: content
        })
    },
    /**
     * 评论
     */
    postComment: function(e) {
        var that = this
        wx.showLoading({
            title: '发送中...',
        });
        // 帖子类型ID
        let objType = this.data.objType;
        // 帖子ID
        let objId = this.data.objId;
        // 评论内容
        let content = this.data.content;
        let refCommentId = this.data.refCommentId;
        // 已有评论
        let comments = this.data.sale.comments
        let sale = this.data.sale
        // 将当前评论加入到已有评论
        var newcomment = {
            "avatar": app.globalData.userInfo.avatarUrl,
            "nickname": app.globalData.userInfo.nickName,
            "content": content,
            "created_at": app.getnowtime()
        }
        // console.log(comments)
        comments.push(newcomment)
        sale.comments = comments
        // 当前评论数
        var newcomment_number = comments.length
        sale.comment_number = newcomment_number

        console.log(newcomment_number)

        // 获取userInfo
        var userInfo = wx.getStorageSync('userInfo')
        // messagedata
        var mesdata = {
            nickname: userInfo.nickName,
            avatar: userInfo.avatarUrl,
            content: '@' + userInfo.nickName + ' 来撩你舍友了!他说：' + content,
            messageuser: that.data.sale.posteropenid,
            objId: that.data.objId,
            obj_type: 'sale'
        }

        // 提交评论
        // 调用云函数
        wx.cloud.callFunction({
            name: 'SaleComment',
            data: {
                id: objId,
                newcomment_number: newcomment_number,
                comments: comments
            },
            success: res => {
                // res 是一个对象， 其中有 _id 字段标记刚创建的记录的 id
                // console.log('praise', res)
                wx.hideLoading()
                that.setData({
                    sale: sale,
                    comments: comments,
                    content: '',
                    showCommentInput: false
                })
                //发送信息
                that.message(mesdata)
            },
            fail: err => {

            }
        })

    },
    /** 
     * 预览图片
     */
    previewImage: function(event) {
        let url = event.target.id;
        wx.previewImage({
            current: '',
            urls: [url]
        })
    },

    /**
     * 触摸屏幕后移动触发一些隐藏操作
     */
    hiddenComment: function() {
        this.setData({
            showCommentInput: false
        });
    },

    /**
     * 显示评论输入框
     */
    showCommentInput: function(e) {
        let objid = e.currentTarget.dataset.objid;
        let type = e.currentTarget.dataset.type;
        let refId = e.currentTarget.dataset.refid;
        // 显示输入评论
        // this.showModal()
        this.setData({
            modalName: e.currentTarget.dataset.target,
            showCommentInput: true,
            objId: objid,
            objType: type,
            refCommentId: refId
        });
    },
    /**
     * 分享
     */
    onShareAppMessage: function(res) {
        return {
            title: "卖舍友啦，便宜又好看，五毛钱一个清仓大甩卖...",
            path: '/pages/home/index/index?type=sale_friend&id=' + this.data.sale.id,
            imageUrl: this.data.baseImageUrl + this.data.sale.attachments[0],
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
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
     * 分享
     */
    onShareAppMessage: function(res) {
        return {
            title: "卖舍友啦，便宜又好看，五毛钱一个清仓大甩卖...",
            path: '/pages/home/index/index?type=sale_friend&id=' + this.data.sale.id,
            imageUrl: this.data.baseImageUrl + this.data.sale.attachments[0],
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
})