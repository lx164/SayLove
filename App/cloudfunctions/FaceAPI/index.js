// 云函数入口文件
// 文件说明
// 阿里云人脸比对API，
const cloud = require('wx-server-sdk')
var request = require('request');
var url = require('url');
var crypto = require('crypto');
cloud.init()

/////////////////////////////////配置信息// 填写AK和请求///////////////////////////////////////////////////////////////////////
// 请填写完整
// 阿里云的AccessKey
var ak_id = '';
// 阿里云的AccessKeySecret 
var ak_secret = '';

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 云函数入口函数
exports.main = async(event, context) => {
    var date = new Date().toUTCString()
    var image1 = event.image1
    var image2 = event.image2

    var options = {
        url: 'https://dtplus-cn-shanghai.data.aliyuncs.com/face/verify',
        method: 'POST',
        body: '{"type": "1", "content_1":"' + image1 + '","content_2":"' + image2 + '"}',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'date': date,
            'Authorization': ''
        }
    };

    md5 = function(buffer) {
        var hash;
        hash = crypto.createHash('md5');
        hash.update(buffer);
        return hash.digest('base64');
    };
    sha1 = function(stringToSign, secret) {
        var signature;
        return signature = crypto.createHmac('sha1', secret).update(stringToSign).digest().toString('base64');
    };

    var body = options.body || '';
    var bodymd5;
    if (body === void 0 || body === '') {
        bodymd5 = body;
    } else {
        bodymd5 = md5(new Buffer(body));
    }

    var stringToSign = options.method + "\n" + options.headers.accept + "\n" + bodymd5 + "\n" + options.headers['content-type'] + "\n" + options.headers.date + "\n" + url.parse(options.url).path;

    var signature = sha1(stringToSign, ak_secret);
    var authHeader = "Dataplus " + ak_id + ":" + signature;
    options.headers.Authorization = authHeader;

    // 封装函数
    let promise = new Promise(function(resolve, reject) {
        request(options, (error, response, body) => {
            // 失败
            if (error) {
                console.log("error", error)
                reject()
            }
            console.log("step4-response body:", response.statusCode, body)
            // 成功
            resolve(body)
        })
    })
    return promise;
}