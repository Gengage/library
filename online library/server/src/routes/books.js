const express = require("express")
const Book = require("../models/Book")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")

const { validationResult } = require('express-validator')
const {
  validateBookTitle,
  validateBookDescription,
  validateBookCategory
} = require('../../validator')

router.post('/', [
    validateBookTitle(),
    validateBookDescription(),
    validateBookCategory()
  ], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({ 
          code: 400, 
          message: '책 데이터가 틀렸습니다',
          error: errors.array()
      })
    }else{
      const searchedBook = await Book.findOne({
        author: req.user._id, 
        title: req.body.title,
      })
      if(searchedBook){
        res.status(204).json({ code: 204, message: '책을 대출 하였습니다 !'})
      }else{
        const book = new Book({
          author: req.user._id, // 사용자 id
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          imgUrl: req.body.imgUrl
        })
        const newBook = await book.save()
        if(!newBook){
          res.status(401).json({ code: 401, message: '대출 할수 없는 책입니다'})
        }else{
          res.status(201).json({ 
            code: 201, 
            message: '대출 완료',
            newBook 
          })
        }
      }
    }
  }))
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
    const book = await Book.findOne({         //도서 반납
      author: req.user._id,  // req.user 는 isAuth 에서 전달된 값
      _id: req.params.id // BOOK id d
    })
    if(!book){
      res.status(404).json({ code: 404, message: '책을 찾을수가 없습니다 '})
    }else{
      await Book.deleteOne({ 
        author: req.user._id,  // req.user 는 isAuth 에서 전달된 값
        _id: req.params.id // Book id 
      })
      res.status(204).json({ code: 204, message: '반납 되었습니다 !' })
    }
  }))
  router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => { // /api/books/
    const books = await Book.find({ author: req.user._id }).populate('author', ['name', 'userId']) // 수정
    if(books.length === 0){
        res.status(404).json({ code: 404, message: '책을 찾을수가 없습니다!'})
    }else{
        res.json({ code: 200, books })
    }
}))
  router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {

    const book = await Book.findOne({ 
      author: req.user._id,  // req.user 는 isAuth 에서 전달된 값
      _id: req.params.id // Book id 
    })
    if(!book){
      res.status(404).json({ code: 404, message: '책을 찾을수가 없습니다 '})
    }else{
      res.json({ code: 200, book })
    }
  }))
router.get("/history/:id",(req,res,next)=>{
    res.json("대출 내역 조회")
})
router.put('/:id', [
    validateBookTitle(),
    validateBookDescription(),
    validateBookCategory()
  ], isAuth, expressAsyncHandler(async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({ 
          code: 400, 
          message: '책 데이터가 틀렸습니다',
          error: errors.array()
      })
    }else{
      const book = await Book.findOne({ 
        author: req.user._id,  // req.user 는 isAuth 에서 전달된 값
        _id: req.params.id // id 
      })
      if(!book){
        res.status(404).json({ code: 404, message: '책을 찾을수가 없습니다 '})
      }else{
        book.title = req.body.title || book.title
        book.description = req.body.description || book.description
        book.isDone = req.body.isDone || book.isDone
        book.lastModifiedAt = new Date() // 수정시각 업데이트
        book.finishedAt = book.isDone ? book.lastModifiedAt : book.finishedAt
        
        const updatedBook = await book.save()
        res.json({
          code: 200,
          message: '변경완료',
          updatedBook
        })
      } 
    }
  }))
router.put("/ext/:id",(req,res,next)=>{
    res.json("대출 연장")
})
router.get("/ext/:id",(req,res,next)=>{
    res.json("연체 확인")
})


module.exports = router

