const express = require("express")
const Admin = require("../models/Admin")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")

router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    const searchedTodo = await Todo.findOne({
      author: req.user._id, 
      title: req.body.title,
    })
    if(searchedTodo){
      res.status(204).json({ code: 204, message: 'Todo you want to create already exists in DB !'})
    }else{
      const todo = new Todo({
        author: req.user._id, // 사용자 id
        title: req.body.title,
        description: req.body.description,
      })
      const newTodo = await todo.save()
      if(!newTodo){
        res.status(401).json({ code: 401, message: 'Failed to save todo'})
      }else{
        res.status(201).json({ 
          code: 201, 
          message: 'New Todo Created',
          newTodo // DB에 저장된 할일
        })
      }
    }
  }))
router.put("/:id",(req,res,next)=>{
    res.json("도서 수정")
})
router.delete("/:id",(req,res,next)=>{
    res.json("도서 삭제")
})

module.exports = router