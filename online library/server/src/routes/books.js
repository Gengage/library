const express = require("express")
const Book = require("../models/Book")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")


router.post('/',(req,res,next)=>{
    res.json("도서 대출")
})
router.delete("/:id",(req,res,next)=>{
    res.json("도서 반납")
})
router.get("/",(req,res,next)=>{
    res.json("대출 도서 목록 조회")
})
router.get("/:id",(req,res,next)=>{
    res.json("대출 도서 정보 조회")
})
router.get("/history/:id",(req,res,next)=>{
    res.json("대출 내역 조회")
})
router.put("/history/",(req,res,next)=>{
    res.json("대출 내역 변경")
})
router.put("/ext/:id",(req,res,next)=>{
    res.json("대출 연장")
})
router.get("/ext/:id",(req,res,next)=>{
    res.json("연체 확인")
})


module.exports = router