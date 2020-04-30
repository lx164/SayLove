// pages/compare_face/face.js
const config = require("./../../config.js");
const app = getApp()

Page({
    data: {
        baseImageUrl: app.globalData.imageUrl,
        showSelect: false,
        showBegin: true,
        showCancel: false,
        showReport: false,
        bindReport: false,
        showSubmit: false,
        tryAgant: false,
        imageLeft: '',
        imageRight: '',
        postImageLeft: '',
        postImageRight: '',
        rate: 0,
        face: '',
        conclusion: '',
        icon: {
            width: "250rpx",
            height: "250rpx",
            path: "http://image.kucaroom.com/tmp/wx0f587d7c97a68e2b.o6zAJs3oh85Zb1lJE8oWix57vny0.LnBKkU9zx3EP4d2e331c723875767480754faf0248b7.png",
            showImage: true
        },
    },
    onLoad: function (option) {
        this.hiddenSelect();
    },
    //  人脸比对
    compareface: function (image1, image2) {
        var that = this
        wx.cloud.init({
            env: config.CLOUNDID
        })
        wx.cloud.callFunction({
                // 云函数名称
                name: 'FaceAPI',
                // 传给云函数的参数
                data: {
                    "image1": image1,
                    "image2": image2
                },
            })
            .then(res => {
                console.log('face', res)
                try {
                    var result = JSON.parse(res.result)
                    console.log(typeof (result))
                    console.log(result)
                    console.log(result.confidence)
                    const errmsg = res.errMsg
                    // 云函数调用成功
                    if (errmsg == 'cloud.callFunction:ok') {
                        // 生成报告
                        var data = that.aliDataAny(result.confidence.toFixed(2))

                        wx.hideLoading();
                        that.setData({
                            rate: data.confidence,
                            face: data.key_world,
                            conclusion: data.message,
                            showReport: true,
                            bindReport: true,
                        });
                    } else {
                        wx.showToast({
                            title: '网络错误，检测失败！',
                            icon: 'none'
                        })
                        setTimeout(function () {
                            wx.hideLoading();
                        }, 2000);
                        return false;
                    }
                } catch (err) {
                    wx.showToast({
                        title: '抱歉，无法检测，请更换照片重试',
                        icon: 'none'
                    })
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 2000);
                    return false;
                }
            })
    },
    // 解析阿里云接口返回的数据
    aliDataAny: function (confidence) {
        var confidence
        var keyWorld
        var message
        var level = 1;
        if (confidence >= 0 && confidence < 3) {
            keyWorld = '半毛钱脸';
            level = 0;
            message = '很严肃的告诉你，你们血缘上没有半毛钱关系！';
        } else if (confidence >= 3 && confidence < 10) {
            keyWorld = '路人脸';
            level = 1;
            message = '很愉快的告诉你，你们绝对不会是同父异母的兄弟姐妹！';
        } else if (confidence >= 10 && confidence < 20) {
            keyWorld = '情侣脸';
            level = 2;
            message = '你们的情侣脸指数跟（赵又廷、高圆圆）（黄晓明、杨颖）差不多，是标准的情侣脸。';
        } else if (confidence >= 20 && confidence < 30) {
            keyWorld = '七年情侣脸';
            level = 3;
            message = '你们在一起的时间越长，就会越像对方，就像邓超和孙俪那样。';
        } else if (confidence >= 30 && confidence < 46) {
            keyWorld = '夫妻脸';
            level = 4;
            message = '你们上辈子肯定是夫妻关系，国民夫妻相。';
        } else if (confidence >= 46 && confidence < 70) {
            keyWorld = '兄弟姐妹脸';
            level = 5;
            message = '你们不是兄弟姐妹吗？';
        } else if (confidence >= 70 && confidence < 80) {
            keyWorld = '镜子脸';
            level = 6;
            message = '自己的照片吧，简直一模一样。';
        } else if (confidence >= 80 && confidence <= 100) {
            keyWorld = '自己脸';
            level = 7;
            message = '别闹了，难道你喜欢你自己？';
        } else {
            keyWorld = '外星脸'; //系统检测，你不是地球人
            level = 8;
            message = '系统检测，你（系）们（统）不（出）是（bug）地(了)球人';
        }
        const data = {
            'key_world': keyWorld,
            'level': level,
            'message': message,
            'confidence': confidence
        }
        return data

    },
    // 上传图片
    showSelect: function () {
        this.setData({
            showSelect: true,
            showBegin: false,
            showCancel: true
        });
    },

    hiddenSelect: function () {
        this.setData({
            showSelect: false,
            showReport: false,
            bindReport: false
        });
    },

    cancelSelect: function () {
        this.setData({
            showSelect: false,
            showBegin: true,
            showCancel: false,
            bindReport: false,
            imageLeft: '',
            imageRight: ''
        });
    },

    selectLeft: function () {
        this.setData({
            showReport: false
        })
        this.ChooseImage('imageleft')
    },

    selectRight: function () {
        this.setData({
            showReport: false
        })
        this.ChooseImage('imageright')
    },
    // 图片
    ChooseImage(data) {
        var that = this
        wx.chooseImage({
            count: 4, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (res) => {
                console.log(res)

                //图片转为base64
                // 阿里云接口---注意：如使用JS调用，请在生成图片的base64编码前缀中去掉data: image / jpeg; base64
                let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64')

                // base64 = 'data:image/png;base64,' + base64
                // console.log(base64)

                if (data == 'imageleft') {
                    that.setData({
                        imageLeft: res.tempFilePaths[0],
                        postImageLeft: base64
                    })
                } else if (data == 'imageright') {
                    that.setData({
                        imageRight: res.tempFilePaths[0],
                        postImageRight: base64
                    })
                }
                var showSubmit
                if (that.data.imageLeft && that.data.imageRight) {
                    showSubmit = true
                } else {
                    showSubmit = false
                }
                that.setData({
                    showSubmit: showSubmit
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
    // 提交检测
    submit: function () {
        var that = this
        if (this.data.postImageLeft == '') {
            wx.showToast({
                title: '左图上传失败，请重试',
                icon: 'none'
            })
            return false;
        }

        if (this.data.postImageRight == '') {
            wx.showToast({
                title: '右图上传失败，请重试',
                icon: 'none'
            })
            return false;
        }

        wx.showLoading({
            title: '检测中...',
        });
        // 返回结果
        // 进行解析
        // 图片1
        var image1 = that.data.postImageLeft
        // 图片2
        var image2 = that.data.postImageRight
        // 调用比对函数
        that.compareface(image1, image2)
    },

    // 再试一次
    tryAgant: function () {
        this.setData({
            rate: 0,
            face: '',
            conclusion: '',
            showReport: false,
            bindReport: false,
            showCancel: true,
            tryAgant: false,
            showBegin: false,
            showSubmit: false,
            postImageLeft: '',
            PostImageRight: '',
            imageLeft: '',
            imageRight: '',
        });
    },

    onShareAppMessage: function (res) {
        return {
            title: '喜欢ta，那就说出来吧',
            path: '/pages/index/index',
            imageUrl: 'http://image.kucaroom.com/compare_face.jpg',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },


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