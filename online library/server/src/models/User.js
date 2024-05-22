const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const userSchema = new Schema({
    name:{    
        type:String,
        required:true,
        trim:true
    },
    password:{      
        type:String,
        reqiured:true,
        trim:true
    },
    userId:{      
        type:String,
        required:true,
        trim:true
    },
    email:{   
        type:String,
        required:true,
        trim:true
    },
    isDone:{       //로그인 여부
        type:Boolean,
        default:false
    },
    isAdmin:{      //관리자 여부
        type:Boolean,
        default:false
    }
})

const User = mongoose.model("User",userSchema)
module.exports = User