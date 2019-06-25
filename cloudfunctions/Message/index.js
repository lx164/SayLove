// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const objId = event.id
    try {
        return await db.collection('message')
            .where({ messageuser: objId })
            .update({
                data: {
                    isread: true
                },
                success: console.log,
                fail: console.error
            })

    } catch (e) {
        console.error(e)
    }

}