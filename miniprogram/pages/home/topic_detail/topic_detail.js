// pages/home/post_detail/post_detail.js
const app = getApp()

Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        school: '',
        praiseBorder: '',
        notPraiseBorder: '',
        posts: [],
        baseImageUrl: app.globalData.imageUrl,
        show: 0,
        hidden: false,
        showCommentInput: false,
        showCommentInput: false,
        commentContent: '',
        commentObjId: '',
        commentType: '',
        commentInfo: {
            title: '',
            placeholder: '',
            btn: ''
        },
        refcommentId: '',
        pageSize: 10,
        pageNumber: 1,
        initPageNumber: 1,
        showGeMoreLoadin: false,
        currentTime: '',
        notDataTips: false,
        newMessage: false,
        newMessageNumber: 0,
        select: 1,
        id: '',
        param: app.globalData.param
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        // 帖子id
        wx.showLoading()
        let objId = options.id;

        this.setData({
            id: objId
        })

        this.setData({
            param: app.globalData.param
        })
        // 获取当前帖子
        this.getPost(objId);
    },
    /**
     * 获取最新贴子
     */
    getPost: function(objId) {

        this.setData({
            posts: []
        })
        wx.showLoading({
            title: '加载中...',
        });
        var that = this

        // 读取数据
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('topics')
            .doc(objId)
            .get({
                success(res) {
                    console.log('res', res)
                    // 获取userInfo
                    var userInfo = wx.getStorageSync('userInfo')
                    // console.log('nickanme', userInfo)
                    // 获取自己的openid或昵称
                    var ownernickname = userInfo.nickName
                    var owneropenid = app.globalData.userId

                    let posts = that.data.posts;

                    if (res.errMsg == "document.get:ok") {

                        const datalength = res.data.length
                        let item

                        var data = res.data
                        // 获取点赞列表
                        var pariselist = data.parise
                        var haszan = false

                        // 判断自己是否已点赞
                        if (pariselist.length > 0) {

                            for (var k = 0; k < pariselist.length; k++) {
                                let nickname = pariselist[k].nickname
                                // console.log('nick', nickname)
                                if (nickname === ownernickname) {
                                    haszan = true
                                    continue;
                                }
                            }
                        }
                        // console.log('zan', haszan)
                        item = {
                            "posteropenid": data._openid,
                            "poster": data.poster,
                            "private": data.private,
                            "id": data._id,
                            "follow": "",
                            "topic": data.username,
                            "content": data.content,
                            "attachments": data.attachments,
                            "created_at": data.created_at,
                            "can_delete": "",
                            "praises": pariselist,
                            "comments": data.comment,
                            "haszan": haszan
                        }
                        posts.push(item)

                        that.setData({
                            userInfo: userInfo,
                            newMessageNumber: 0,
                            posts: posts,
                            showGeMoreLoadin: false
                        })
                        wx.hideLoading();

                    } else {
                        wx.showToast({
                            title: res.errMsg,
                            icon: 'none'
                        });
                        setTimeout(function() {
                            wx.hideLoading();
                        }, 700)
                    }

                }
            })

    },
    /**
     * 显示评论输入框
     */
    showCommentInput: function(e) {
        console.log('curdataset', e)
        var objid = e.currentTarget.dataset.objid;
        var index = e.currentTarget.dataset.index
        var refCommenter = e.currentTarget.dataset.refcommenter
        var commentType = e.currentTarget.dataset.type
        var commentInfo
        // 帖子类型
        var obj_type = e.currentTarget.dataset.obj_type

        // 根据不同的评论，显示不同评论框的提示

        commentInfo = this.data.commentInfo
        let title = '@' + refCommenter
        let placeholder = '你想回复 @' + refCommenter + ' 什么呢？'
        let btn = '回复 @' + refCommenter
        commentInfo.title = title
        commentInfo.placeholder = placeholder
        commentInfo.btn = btn

        // 显示输入评论
        // this.showModal()
        this.setData({
            commentInfo: commentInfo,
            refCommenter: e.currentTarget.dataset.refcommenter,
            modalName: e.currentTarget.dataset.target,
            dbname: e.currentTarget.dataset.dbname,
            showCommentInput: true,
            objId: objid,
            objIndex: index,
            // 帖子类型
            obj_type: obj_type,
            posteropenid: e.currentTarget.dataset.posteropenid
        });
    },
    // 隐藏评论输入框
    hideModal: function() {
        var commentInfo = {
            title: '',
            placeholder: '',
            btn: ''
        }
        this.setData({
            commentInfo: commentInfo,
            commentContent: '',
            dbname: '',
            posteropenid: '',
            modalName: null,
            showCommentInput: false
        })
    },

    /**
     * 获取评论框的输入内容
     */
    getCommentContent: function(event) {
        let content = event.detail.value;
        this.setData({
            commentContent: ''
        })
        this.setData({
            commentContent: content
        })
    },
    /**
     * 提交评论
     */
    postComment: function(e) {
        var that = this
        wx.showLoading({
            title: '发送中...',
        });
        // 帖子ID
        let objId = this.data.objId;
        let objIndex = 0
        // 评论人
        var nickname = app.globalData.userInfo.nickName
        // 评论内容
        let content = this.data.commentContent;
        // 回复评论人
        let refCommenter = this.data.refCommenter;
        if (!refCommenter) {
            refCommenter = ''
        }
        // 内容为空，中断评论
        if (content == '') {
            wx.showToast({
                title: '请输入内容！',
            })
            wx.hideLoading()
            return false
        }
        // 已有评论
        let posts = this.data.posts
        let comments = posts[objIndex].comments
        // 将当前评论加入到已有评论
        var newcomment = {
            "objId": objId,
            "can_delete": false,
            "ref_comment": {
                "refCommenter": refCommenter
            },
            "commenter": {
                "nickname": nickname
            },
            "content": content
        }
        comments.push(newcomment)

        // 当前评论数
        var newcomment_number = comments.length

        // messagedata
        var mesdata = {
            nickname: nickname,
            avatar: that.data.userInfo.avatarUrl,
            content: '@' + nickname + ' 评论你：' + content,
            messageuser: that.data.posteropenid,
            objId: objId,
            obj_type: that.data.obj_type
        }

        // 调用云函数，提交评论
        const db = wx.cloud.database()
        wx.cloud.callFunction({
            name: 'FrofessComment',
            data: {
                id: objId,
                dbname: that.data.dbname,
                newcomment_number: newcomment_number,
                comments: comments
            },
            success: res => {
                console.log('评论结果', res)
                // 发送message
                that.message(mesdata)
                // 更新页面信息
                that.setData({
                    posts: posts,
                    commentContent: '',
                    objId: '',
                    obj_type: '',
                    refcommenter: '',
                    modalName: null,
                    showCommentInput: false
                })
                wx.hideLoading()
                wx.showToast({
                    title: '回复成功！',
                })

            },
            fail: err => {
                wx.showModal({
                    title: '加载失败...',
                    content: err,
                })
            }
        })
    },
    // 删除评论
    deleteComment: function(e) {
        var that = this
        // 帖子类型，话题、表白墙
        var type = e.currentTarget.dataset.type
        // 评论位置
        var index = e.currentTarget.dataset.index
        // 评论内容
        var item = e.currentTarget.dataset.item
        // 帖子ID
        var id = item.id
        var comments = item.comments
        // 删除确认
        wx.showModal({
            title: '提示',
            content: '确定删除这条评论吗？',
            success(res) {
                if (res.confirm) {
                    // 确定删除
                    comments.splice(index, 1)
                    wx.cloud.callFunction({
                        name: 'FrofessComment',
                        data: {
                            id: id,
                            dbname: type,
                            newcomment_number: comments.length,
                            comments: comments
                        },
                        success: function() {
                            if (type == 'posts') {
                                that.getPost()
                                that.setData({
                                    select: 1,
                                    showTopic: false,
                                    showposts: true
                                })
                            } else if (type == 'topics') {
                                that.topics()
                                that.setData({
                                    select: 2,
                                    showTopic: true,
                                    showposts: false
                                })
                            }
                        },
                        fail: console.log
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
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
    hiddenComment: function() {},

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