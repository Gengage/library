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

userSchema.path('email').validate(function(value){
    return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
}, 'email `{VALUE}` 는 잘못된 이메일 형식입니다.')

// 숫자, 특수문자 최소 1개 포함하기 (7~15자)
userSchema.path('password').validate(function(value){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(value)
}, 'password `{VALUE}` 는 잘못된 비밀번호 형식입니다.')