# 基于微信云开发 SayLove 表白墙微信小程序

![image](https://img.shields.io/badge/TAG-云开发-blue.svg) ![image](https://img.shields.io/badge/TAG-表白墙-blue.svg) ![image](https://img.shields.io/badge/TAG-微信小程序-blue.svg)

[![image](https://img.shields.io/badge/author-lx164-orange.svg)](https://github.com/lx164/) [![image](https://img.shields.io/badge/CSDN-lx9625_鹤鹤-orange.svg)](https://blog.csdn.net/github_38967228) [![image](https://img.shields.io/badge/博客园-LiangSenCheng小森森-orange.svg)](https://www.cnblogs.com/LiangSenCheng/)


项目地址：https://github.com/lx164/SayLove

***如需小程序定制「包括但不限于课设、毕设等」可联系我，联系方式请点击> [博客园](https://www.cnblogs.com/LiangSenCheng)< 的首页；***

> 发现有问题？欢迎加我微信一起探讨，或者直接提Issues
> 无法下载或者下载太慢？可以直接找我要安装包；
> 
> 联系方式在这里的首页：https://www.cnblogs.com/LiangSenCheng/p/11083714.html

- [其他开源项目]

1. 基于微信小程序云开发-租房微信小程序-带管理员后台 https://github.com/lx164/house
2. https://www.cnblogs.com/LiangSenCheng/p/12543230.html

> Bug修复更新日历

- [2020-09-05] 温馨提示：

***`情侣脸` 功能因阿里云的接口改了，建议直接去掉就好了。***

- [2020-05-22] 小bug修复：

1.修复组件的bug；
2.修复首页showModal导致出错的bug；

- [2020-04-30] 更新：

1. 修复“`情侣脸`”云函数bug；
2. 优化“`情侣脸`”交互逻辑，当无法识别时中断当前操作；
3. 修复“`发布表白`”、“`发布话题`”时，没添加图片一直显示加载中的问题；
4. 删除云函数不必要的依赖包；
5. 全新版本的表白墙正在筹备中....


- [2020-05-20] 说明更新：

小程序没有做后台，但是需要后台的可以参考这个官方提供的方案，https://mp.weixin.qq.com/s/HZCVnnau3grmKA06E-M-yg 和 https://mp.weixin.qq.com/s/TFc2fj-gOVwAvs603WZG_A

> 注意：
* “`情侣脸`”云函数 `FaceAPI` 的wx-server-sdk依赖需要更新才能正常使用，这里的都是旧版本的,上传云函数前请自行使用npm更新。
* `登录鉴权`：（现在这个不适用了，因为微信小程序的规则改了，这个不符合新规，需要自己根据实际情况修改）
* `后台管理`：暂时没有做后台管理界面，直接在云开发后台即可查看管理，您也可以根据自己需要自己写一个简单的管理界面放在小程序端，然后把入口隐藏起来，限制指定用户使用即可。

[TOC]

## 程序结构
```
|--App 小程序代码目录
|--|-- cloudfunctions 云函数
|--|--|--|-- DeleteMessage 
|--|--|--|-- DeleteMyLike
|--|--|--|-- Deletes
|--|--|--|-- FaceAPI 情侣脸(阿里云人脸识别API封装)
|--|--|--|-- FrofessComment
|--|--|--|-- FrofessZan
|--|--|--|-- Message
|--|--|--|-- SaleComment
|--|--|--|-- SaleZan
|--|--|--|-- ViewNumber
|--|--|--|-- login
|--|-- miniprogram 小程序页面
|--|--|--|-- 略
|--README.md
|--Images 截图

```

## 说明

 《SayLove》表白墙微信小程序，前台基于校园情书微信小程序进行大量的修改，虽然样式看起来都差不多，但是做了大量的修改。特别是后台部分，后台完全使用微信小程序云开发，不依赖服务器。前台代码由于是在原作者的基础上根据实际情况做了修改，所以跟原来作者的看起来很像,但并没有照搬照抄。
 
 为什么我要改写原作者的小程序？因为我尝试过根据原作者的所写的ReadMe进行配置，发现过程过于复杂，而且依赖因素太多，尝试了很多次都无法成功。在自己的好奇心驱使下，就基于原项目进行的改写，后台改写为微信小程序云开发，使其安装配置变得非常简单，拿来就可以直接使用了。

> 参考源项目的内容如下：

* 主要是参考了他的点子，并不是完全照搬照抄
* 界面的大体布局，比如：板块布局、配色没有修改，
* 除了大布局上以外，基本所有小布局都有更改（具体见下面的）
* 【注】：我的初衷目的，并不是为了直接拿别人的项目修修改改，然后就说这是我的成果。
* 我看到原作者的项目是一个偶然的机会，当时有恰好我在学微信小程序的云开发，所以就参考原作者的项目进行了云开发的修改适配，作为学习成果的验证。除了这个以外并没有其他的目的，也因此把我自己的也开源了。
* <b>参考的源项目作者地址为：</b><https://github.com/oubingbing/school_wechat>
* <b>本项目的地址：</b><https://github.com/lx164/SayLove>

>重构率超过了60%以上，如果不是借鉴了源项目的点子话，基本上可以说是自己重写的了，
大修改部分如下：

* 后台：自己构造，完全依赖于云开发，无需搭建后台服务器
* 所有数据的结构：完全是自己构造的（因为后台不一样，所以数据的构造完全不一样）
* 登录鉴权：自己重新写的（现在这个不可以用了，因为微信小程序的规则改了，这个不符合新规，需要自己修改）
* 首页新消息通知：自己重新写的（没有直接使用参考的原项目）
* 各个板块的点赞、评论：重新根据自己的需要重新编写，对其进行了提升（因为后台不一样，所以数据的结构需要重新构造）
* 各个板块的图片上传：界面以及逻辑代码是自己重新的（参考的源项目使用的是插件，这里改为了原生的），图片保存在云开发的后台
* 卖舍友板块：瀑布流重写，没有使用原来的瀑布流
* 发布话题、发布卖舍友部分重写：根据自己的需要进行了重写
* 情侣脸板块：自己封装阿里云人脸识别的接口，来适配云开发
* 个人中心板块重写：自己重新构造了消息通知

本程序已经经过测试，拿来按照说明简单配置就可以直接使用,界面可以自己进行修改。本人热爱小程序，目前上线并维护的有两个，后面看情况再找时间进行开源。

 由于本人的能力有限，还有很多地方没法完善，望指正！


[附：(微信小程序云函数) 阿里云人脸比对API封装 https://www.cnblogs.com/LiangSenCheng/p/10922979.html ](https://www.cnblogs.com/LiangSenCheng/p/10922979.html )

## 配置过程

因为项目里含有微信小程序云开发用到的依赖，因此体积比较大。

1. 直接下载源码,源码地址：https://github.com/lx164/SayLove/tree/master

或者clone项目 `git clone https://github.com/lx164/SayLove/tree/master/App`

2. 打开微信开发者工具，导入项目（导入的时候请选择 `APP` 文件夹）；

3. 填写APPID；

4. 开通云开发环境（[请参考官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/quickstart.html)）；

5. 新建以下数据库集合,一行为一个集合名（不要写错）：

```
    comment
    message
    mylike
    parise
    posts
    sale_friends
    topics
```
然后把以上的集合权限修改为：`所有用户可读，仅创建者可读写`。

6. 填写小程序相关配置信息；

配置文件在 `App/miniprogram/config.js` ,填写以下的配置信息：

```javascrpt
    // 小程序APPID
    const APPID = ''
    // 小程序SECRET
    const SECRET = ""
    // 云开发环境ID
    const CLOUNDID = ''
    // 消息刷新时间，单位：毫秒
    // 默认10秒刷新一次，即10000毫秒
    // 根据实际需要进行调节
    const FLASHTIME = 10000000
```

 如下图：

![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164801877-1009585188.png)


7.填写阿里云面部识别相关配置信息【**`选填`**】：

> 注意：如果不需要使用 `情侣脸` 功能的话，请跳过该步骤

- 7.1 阿里云的`AccessKey`和`AccessKeySecret`的获取，以及人脸识别服务的开通请[参考官方文档](https://help.aliyun.com/knowledge_detail/53535.html?spm=a2c4g.11174283.3.4.6f9f5d0dyGRUGn)。 

```
    // 请填写完整
    // 阿里云的AccessKey
    var ak_id = '';
    // 阿里云的AccessKeySecret 
    var ak_secret = '';
```

`AccessKey`和`AccessKeySecret`的填写位置如图：

![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164811375-1183587206.png)

- 7.2 检查云函数 `FaceAPI` 所需要的依赖是否已安装；
```javaSciipt
    // 1. 如果已经安装请自行使用npm更新；
    // 2. 如果没有安装，则使用下面命令安装：
    npm install crypto
    npm install request
    npm install url
    npm install wx-server-sdk
```
 


- 7.3 上传云函数 `APP/cloudfunctions/FaceAPI`，上传时选择 `上传并部署：所有文件`；


8. 上传 `APP/cloudfunctions` 文件夹下（除了`APP/cloudfunctions/FaceAPI`以外）所有的云函数，上传时选择 `上传并部署：云端安装依赖`；

9. 编译运行。


## 结语

 欢迎一起探讨，如果你觉得还可以，您可以给我点一个start，或者赞赏我

![award](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164529400-127816623.jpg)

## 程序效果图

![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164625354-461794641.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164701306-838686484.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164707877-1407077927.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164714142-1549713777.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164720769-1248107178.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164727627-748356212.png) ![](https://img2018.cnblogs.com/blog/1697917/201906/1697917-20190625164737005-591696446.png)


## 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

- [人脸比对API调用说明文档](https://help.aliyun.com/knowledge_detail/53535.html?spm=a2c4g.11174283.3.4.6f9f5d0dyGRUGn)


