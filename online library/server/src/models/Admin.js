const mongoose = require('mongoose')

const {Schema} = mongoose
const {Types:{ObjectId}} = Schema

const AdminSchema = new Schema({
    createdAt:{    //추가
        type:String,
        required:true,
        trim:true
    },
    deletedAt:{    //삭제
        type:String,
        required:true,
        trim:true
    },
    updateAt:{     //변경
        type:String,
        required:true,
        trim:true
    }
})

const Admin = mongoose.model("Admin",AdminSchema)
module.exports = Admin