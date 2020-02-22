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
    console.log(event)
    const objId = event.id
    const dbname = event.dbname
    const view_number = event.view_number
    try {
        return await db.collection(dbname)
            .doc(objId)
            .update({
                // data 传入需要局部更新的数据
                data: {
                    // 表示将 done 字段置为 true
                    view_number: view_number
                }
            })
    } catch (e) {
        console.error(e)
    }
}