// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    // API 调用都保持和云函数当前所在环境一致
    env: cloud.DYNAMIC_CURRENT_ENV,
    traceUser: true,
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const objId = event.id
    const newpraise_number = event.praise_number
    const praise = event.praise
    try {
        return await db.collection('sale_friends')
            .doc(objId)
            .update({
                // data 传入需要局部更新的数据
                data: {
                    // 表示将 done 字段置为 true
                    praise_number: newpraise_number,
                    praise: praise
                }
            })

    } catch (e) {
        console.error(e)
    }

}