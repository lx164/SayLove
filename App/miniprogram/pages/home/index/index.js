// pages/home/index/index.js
const app = getApp()
const config = require("../../../config.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showselect: false,
        show_auth: false,
        userInfo: {},
        hasUserInfo: false,
        school: '',
        praiseBorder: '',
        notPraiseBorder: '',
        posts: [],
        postType: 1,
        baseImageUrl: app.globalData.imageUrl,
        show: 0,
        hidden: false,
        showCommentInput: false,
        commentContent: '',
        commentObjId: '',
        commentType: '',
        refcommentId: '',
        posteropenid: '',
        filter: '',
        pageSize: 10,
        pageNumber: 1,
        initPageNumber: 1,
        showGeMoreLoadin: false,
        currentTime: '',
        notDataTips: false,
        newMessage: false,
        newMessageNumber: 0,
        select: 1,
        animationData: {},
        commentValue: '',
        showNormal: false,
        showAudit: false,
        topic: {
            content: '',
            attachments: '',
            praise_number: '',
            id: ''
        },
        commentInfo: {
            title: '',
            placeholder: '',
            btn: ''
        },
        showpostbtn: true,
        showposts: true,
        showTopic: false,
        showSelect: false,
        showBegin: true,
        showCancel: false,
        showReport: false,
        bindReport: false,
        showSubmit: false,
        showSearch: false,
        tryAgant: false,
        imageLeft: '',
        imageRight: '',
        postImageLeft: '',
        PostImageRight: '',
        rate: 0,
        face: '',
        conclusion: '',
        canComment: true,
        sharecomeIn: false,
        shareId: '',
        shareType: '',
        param: app.globalData.param,
        messagefunc: Object,
        zanstatu: []
    },
    // showselect
    showselect: function() {
        this.setData({
            showselect: true
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        // 判断是否为发表话题跳转回来的
        if (app.globalData.isposttopic) {
            this.topics()
            this.setData({
                select: 2,
                showTopic: true,
                showposts: false
            })
        } else {
            // this.getPost()
            this.setData({
                select: 1, 
                showTopic:false,
                showposts:true
            })
        }
        wx.showLoading({
            title: '加载中...',
        });
        // this.getPost();
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
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log('onready')
        app.getParam(res => {
            let resData = res.data;
            if (resData.error_code == 0) {
                this.setData({
                    param: resData.data == 2 ? true : false
                })
                app.globalData.param = this.data.param;
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(option) {
        console.log('onshow')
        // 刷新消息
        var that = this
        // // 判断是否为发表话题跳转回来的
        // 判断是否为发表话题跳转回来的
        if (app.globalData.isposttopic) {
            this.topics()
            this.setData({
                select: 2,
                showTopic: true,
                showposts: false
            })
        } else{
            this.getPost()
            this.setData({
                select: 1,
                showTopic: false,
                showposts: true
            })
        }
        // 清除定时任务
        clearInterval(this.data.messagefunc)
        // 刷新消息
        this.setData({
            messagefunc: setInterval(function() {
                that.newmessage()
                console.log('flash')
            }, config.FLASHTIME)
        })
    },

    /**
     * 显示评论输入框
     */
    showCommentInput: function(e) {
        // console.log('curdataset', e)
        var objid = e.currentTarget.dataset.objid;
        var index = e.currentTarget.dataset.index
        var refCommenter = e.currentTarget.dataset.refcommenter
        var commentType = e.currentTarget.dataset.type
        var commentInfo
        // 帖子类型
        var obj_type = e.currentTarget.dataset.obj_type

        // 根据不同的评论，显示不同评论框的提示
        if (commentType == 'normalcomment') {
            // 正常的评论
            commentInfo = this.data.commentInfo
            commentInfo.title = '请输入评论内容'
            commentInfo.placeholder = '你对这个帖子有啥看法呢？'
            commentInfo.btn = '发布评论'
        } else if (commentType == 'refcomment') {
            commentInfo = this.data.commentInfo
            let title = '回复 @' + refCommenter
            let placeholder = '你想回复 @' + refCommenter + ' 什么呢？'
            let btn = '回复 @' + refCommenter
            commentInfo.title = title
            commentInfo.placeholder = placeholder
            commentInfo.btn = btn
        } else {
            this.hideModal()
        }
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
        let objIndex = this.data.objIndex
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

        // 如果objIndex为空，则计算出objIndex
        if (!objIndex) {
            // console.log('objIndex', objIndex)
            for (let i = 0; i < posts.length; i++) {
                // 找到onjIndex,返回index
                if (objId === posts[i].id) {
                    objIndex = i
                    continue;
                }
            }
        }
        // console.log('objIndex', objIndex)

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
                // console.log('评论结果',res)
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
                            if (type == 'posts'){
                                that.getPost()
                                that.setData({
                                    select: 1,
                                    showTopic: false,
                                    showposts: true
                                })
                            }else if(type == 'topics'){
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

    // 赞、取消赞
    zan: function(e) {
        // iszan为true,代表已经点赞，可取消赞
        // iszan为false,代表没有点赞，可以点赞
        var iszan = e.currentTarget.dataset.iszan
        // 当前内容的id
        var id = e.currentTarget.dataset.id
        // 当前赞信息
        var index = e.currentTarget.dataset.index
        var zan = this.data.posts[index].praises
        var dbname = e.currentTarget.dataset.dbname
        // 接收的用户openid
        var posteropenid = e.currentTarget.dataset.posteropenid
        // 帖子类型
        var obj_type = e.currentTarget.dataset.obj_type
        // 修改赞状态
        this.changezan(id, zan, dbname, index, iszan, posteropenid, obj_type)
    },

    changezan: function(id, zan, dbname, index, iszan, posteropenid, obj_type) {
        var that = this
        var content
        // iszan == true 已赞，可以取消赞
        if (iszan === 'true') {
            // console.log('zan1', zan)
            var userInfo = wx.getStorageSync('userInfo')
            var ownernickname = userInfo.nickName
            // 删除已赞
            for (let i = 0; i < zan.length; i++) {
                if (ownernickname == zan[i].nickname) {
                    zan.splice(i, 1);
                    // console.log('zan1',zan)
                }
            }
            // 更新点赞数
            var newpraise_number = zan.length
            // console.log(newpraise_number)
            iszan = false
            //messagedata
            content = '@' + that.data.userInfo.nickName + ' 取消了赞!'
            // console.log('zan2',zan)
        } else {
            // iszan == false 未赞，可以赞
            var item = {
                "id": id,
                "nickname": that.data.userInfo.nickName,
                "avatar": that.data.userInfo.avatarUrl
            }
            // 添加赞
            zan.push(item)
            // console.log('zan', zan)
            // 更新点赞数
            var newpraise_number = zan.length
            // console.log(newpraise_number)
            //messagedata
            content = '@' + that.data.userInfo.nickName + ' 给你点赞了!'
        }

        // messagedata
        var mesdata = {
            nickname: that.data.userInfo.nickName,
            avatar: that.data.userInfo.avatarUrl,
            content: content,
            messageuser: posteropenid,
            objId: id,
            obj_type: obj_type
        }

        // 调用云函数,点赞
        wx.cloud.callFunction({
            name: 'FrofessZan',
            data: {
                id: id,
                dbname: dbname,
                newpraise_number: newpraise_number,
                zan: zan
            },
            success: res => {
                // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                // console.log('praise', res)

                // 发送message
                that.message(mesdata)

                // 修改本地显示
                var posts = that.data.posts
                posts[index].praises = zan
                posts[index].haszan = iszan
                that.setData({
                    posts: posts
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

    /**
     * 获取具体类型的贴子
     */
    selected(e) {
        let objType = e.target.dataset.type;
        let thisTopic = this.data.topic;
        // 最新帖子
        if (objType == 1 && thisTopic != null) {

            // console.log('new')
            this.setData({
                showpostbtn: true,
                showTopic: false,
                showposts: true,
                posts: []
            });
            this.getPost();
        } else {
            this.setData({

                showTopic: false,
                showposts: true
            });
        }
        // 今日话题
        if (objType == 2 && thisTopic != null) {
            this.topics();
            // console.log('topic')
            this.setData({
                showpostbtn: false,
                showTopic: true,
                showposts: false,
                posts: []
            });
            this.setData({
                showTopic: true,
                showposts: true,
                posts: []
            });

        } else {
            this.setData({
                showTopic: false
            });
        }
        // 最热帖子
        if (objType == 4 && thisTopic != null) {
            this.gethotpost()
            // console.log('hot')
            this.setData({
                showpostbtn: true,
                showTopic: false,
                showposts: true,
                posts: []
            });
        } else {
            this.setData({
                showTopic: false
            });
        }

        if (objType == 5) {
            this.setData({
                showSearch: true,
                showTopic: false,
                showposts: true
            });
        } else {
            this.setData({
                showSearch: false,
            });
        }

        this.setData({
            select: objType,
            postType: objType,
            posts: [],
            filter: ''
        })

        this.setData({
            pageNumber: this.data.initPageNumber
        });

        if (objType != 5) {
            // this.getPost();
        }

    },


    /**
     ** 获取今日话题
     */
    topics: function() {
        var that = this
        this.setData({
            posts: []
        })
        wx.showLoading({
            title: '加载中...',
        });
        // 1. 获取数据库引用
        const db = wx.cloud.database()
        db.collection('topics')
            .orderBy('praise_number', 'desc')
            .orderBy('comment_number', 'desc')
            .orderBy('updated_at', 'desc')
            .get({
                success(res) {
                    console.log('res', res)
                    let topic = that.data.topic
                    // 存在话题
                    if (res.data.length > 0) {
                        topic.content = res.data[0].content
                        topic.attachments = res.data[0].attachments
                        topic.praise_number = res.data[0].praise_number
                        topic.view_number = res.data[0].view_number
                        topic.comment_number = res.data[0].comment_number
                        topic.id = res.data[0]._id
                    } else {
                        // 没有话题
                        topic.content = '没有话题'
                    }

                    // 获取userInfo
                    var userInfo = wx.getStorageSync('userInfo')
                    // 获取自己的openid或昵称
                    var ownernickname = userInfo.nickName
                    var owneropenid = app.globalData.userId
                    let posts = that.data.posts;
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        for (var i = 0; i < datalength; i++) {
                            // console.log(i, res.data[i])
                            var data = res.data[i]
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
                                    }
                                }
                            }
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
                        }
                        that.setData({
                            topic: topic,
                            showTopic: true,
                            showposts: false,
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
     * 获取最新贴子
     */
    getPost: function(objType = null) {

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
        db.collection('posts')
            .orderBy('created_at', 'desc')
            .get({
                success(res) {
                    // 获取userInfo
                    var userInfo = wx.getStorageSync('userInfo')
                    // console.log('nickanme', userInfo)
                    // 获取自己的openid或昵称
                    var ownernickname = userInfo.nickName
                    var owneropenid = app.globalData.userId

                    let posts = that.data.posts;

                    if (res.errMsg == "collection.get:ok") {

                        const datalength = res.data.length
                        let item

                        for (var i = 0; i < datalength; i++) {

                            var data = res.data[i]
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

                        }

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

    // 获取最热帖子
    gethotpost: function() {
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
        db.collection('posts')
            .orderBy('praise_number', 'desc')
            .orderBy('comment_number', 'desc')
            .get({
                success(res) {
                    // 获取userInfo
                    var userInfo = wx.getStorageSync('userInfo')
                    // 获取自己的openid或昵称
                    var ownernickname = userInfo.nickName
                    var owneropenid = app.globalData.userId
                    let posts = that.data.posts;
                    if (res.errMsg == "collection.get:ok") {
                        const datalength = res.data.length
                        let item
                        for (var i = 0; i < datalength; i++) {
                            // console.log(i, res.data[i])
                            var data = res.data[i]
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
                                    }
                                }

                            }

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
                        }

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
     * 分享
     */
    onShareAppMessage: function(res) {
        return {
            title: 'hi，同学，有人跟你表白了',
            path: '/pages/home/index/index',
            imageUrl: 'http://image.kucaroom.com/share1.jpg',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

    /**
     * 上拉加载更多
     */
    onReachBottom: function() {
        this.setData({
            showGeMoreLoadin: true
        });
        this.getPost();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.setData({
            pageNumber: this.data.initPageNumber,
            posts: []
        });
        this.getPost();
    },
    /** 
     * 进入发表页面
     */
    post: function(e) {
        let page = e.currentTarget.dataset.page
        console.log(e)
        wx.navigateTo({
            url: page
        })
    },
    // 查看帖子详情
    postdetail: function(e) {
        // console.log(e)
        // 文章Id
        // var id = e.currentTarget.dataset.id
        // wx.navigateTo({
        //     url: '../../home/post_detail/post_detail?id=' + id,
        // })
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
     * 预览图片
     */
    previewMoreImage: function(event) {
        let images = event.currentTarget.dataset.obj.map(item => {
            return this.data.baseImageUrl + item;
        });
        let url = event.target.id;
        wx.previewImage({
            current: url,
            urls: images
        })
    },
    // 话题详情
    topicdetial: function(e) {
        var id = e.currentTarget.dataset.id
        var view_number = this.data.topic.view_number + 1
        // 更改view_number
        wx.cloud.callFunction({
            name:'ViewNumber',
            data:{
                id:id,
                dbname:'topics',
                view_number: view_number
            },
            success:res=>{
                wx.navigateTo({
                    url: '../topic_detail/topic_detail?id=' + id,
                })
            },
            fail:console.log
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        console.log('onhidden')
        clearInterval(this.data.messagefunc)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        console.log('onunload')
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