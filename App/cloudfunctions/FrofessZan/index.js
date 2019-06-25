// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
    const id = event.id
    const dbname = event.dbname
    const newpraise_number = event.newpraise_number
    const zan = event.zan
    try {
        return await db.collection(dbname)
            .doc(id)
            .update({
                // data 传入需要局部更新的数据
                data: {
                    // 表示将 done 字段置为 true
                    praise_number: newpraise_number,
                    parise: zan
                }
            })

    } catch (e) {
        console.error(e)
    }

}