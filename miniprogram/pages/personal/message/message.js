const app = getApp();
Page({
    data: {
        image: 'tmp/wx46d5674c81153f30.o6zAJs3oh85Zb1lJE8oWix57vny0.2b862a6493fd893b7fbc37bd8dfd424f.jpg',
        baseImageUrl: app.globalData.imageUrl,
        messageList: [],
        pageSize: 10,
        pageNumber: 1,
        initPageNumber: 1,
        showGeMoreLoadin: false,
        notDataTips: false,
        param: app.globalData.param,
        message_number:0
    },
    onLoad: function(option) {
        let objType = option.type;
        let messageType = option.new_message;
        // this.getInboxList(objType, messageType);
        this.setData({
            param: app.globalData.param
        })
    },
    onShow: function (option){
        this.getInboxList();
        this.setData({
            param: app.globalData.param
        })
    },
    /**
     * 获取消息列表
     */
    getInboxList: function() {
        let that = this
        wx.showLoading({
            title: '加载中...',
        })
        that.setData({
            messageList:[],
            message_number:0,
            param: true
        })
        // 获取数据
        const db = wx.cloud.database()
        db.collection('message')
            .where({
                messageuser: app.globalData.userId // 填入当前用户 openid
            })
            .orderBy('created_at', 'desc')
            .get({
                success(res) {
                    console.log('message', res)
                    var data = res.data
                    var datalength = data.length
                    var messageList = that.data.messageList
                    var item
                    for (var i = 0; i < datalength; i++) {
                        // console.log(data[i])
                        item = {
                            "obj_id":data[i].objId,
                            "from_user":data[i].from_user,
                            "content": data[i].content,
                            "created_at": data[i].created_at,
                            "obj_type":data[i].obj_type
                        }
                        messageList.push(item)
                    }
                    console.log(messageList)

                    that.setData({
                        messageList: messageList,
                        message_number: datalength,
                        param:true
                    })
                    wx.hideLoading()
                }
            })
    },
    // 清空消息列表
    clearnmassage:function(){
        var that = this
        wx.showLoading({
            title: '正在清除...',
        })
        // 调用自定义云函数
        wx.cloud.callFunction({
            name:'DeleteMessage',
            data:{
                id: app.globalData.userId ,
                dbname:'message'
            },
            success:res=>{
                wx.hideLoading()
                wx.showToast({
                    title: '消息已清除',
                })
                that.getInboxList()
            },
            fail:res=>{
                wx.hideLoading()
                wx.showToast({
                    title: '清除失败！',
                })
            }
        })
    },
    /**
     * 上拉加载跟多
     */
    onReachBottom: function() {
        // this.getInboxList();
        // this.setData({
        //     showGeMoreLoadin: true
        // });
    },
    /**
     * 打开详情
     */
    opendDetail: function(e) {
        console.log(e)
        let objType = e.currentTarget.dataset.type
        let objid = e.currentTarget.dataset.objid
        
        if (objType == 'posts') {
            console.log(objType)
            wx.navigateTo({
                url: '../../home/post_detail/post_detail?id=' + objid
            })
            return false;
        }

        if (objType == 'sale') {
            wx.navigateTo({
                url: '../../sale/comment_sale/comment_sale?id=' + objid
            })
            return false;
        }

        if (objType == 'topic') {
            wx.navigateTo({
                url: '../../home/topic_detail/topic_detail?id=' + objid
            })
            return false;
        }

    }
})