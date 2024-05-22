const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const BookSchema = new Schema({
    title:{         //제목
        type:String,
        required:true,
        trim:true
    },
    author:{       //저자
        type:String,
        required:true,
        trim:true
    },
    createdAt:{    //등록날짜
        type:Date,
        default:Date.now,
    },
    lastModifiedAt:{     //수정날짜
        type:Date,
        default:Date.now,
    },
    isDone:{      // 대출 가능 여부
        type:Boolean,
        default:false
    },
    description:{      //도서 설명
        type:String,
        required:true,
        trim:true
    }
})

const Book = mongoose.model("Book",BookSchema)
module.exports = Book