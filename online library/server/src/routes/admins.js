const express = require("express")
const Admin = require("../models/Admin")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")

router.post('/', (req, res, next) => {
  res.json("도서 추가")
})
router.put("/:id",(req,res,next)=>{
    res.json("도서 수정")
})
router.delete("/:id",(req,res,next)=>{
    res.json("도서 삭제")
})

module.exports = router