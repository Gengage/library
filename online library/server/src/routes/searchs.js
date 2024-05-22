const express = require("express")
const Book = require("../models/Book")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")
//전체 도서 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => { 
    const books = await Book.find({ author: req.user._id }) // req.user 는 isAuth 에서 전달된 값
    if(books.length === 0){
      res.status(404).json({ code: 404, message: 'Fail to find books !'})
    }else{
      res.json({ code: 200, books })
    }
  }))
//특정 도서 조회
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const book = await Book.findOne({ 
      author: req.user._id,  // req.user 는 isAuth 에서 전달된 값
      _id: req.params.id // Book id 
    })
    if(!book){
      res.status(404).json({ code: 404, message: 'Book Not Found '})
    }else{
      res.json({ code: 200, book })
    }
  }))
module.exports = router