const express = require("express")
const User = require("../models/User")

const router = express.Router()
const expressAsyncHandler = require("express-async-handler")
const {generateToken,isAuth} = require("../../auth")

const { validationResult, oneOf } = require('express-validator')
const {
    validateUserName,
    validateUserEmail,
    validateUserPassword
} = require('../../validator')

router.post('/login', (req, res, next) => {
  req.type = null 
  next()
}, [
  validateUserEmail(),
  validateUserPassword()
], expressAsyncHandler(async (req, res, next) => { // /api/users/login
  req.type = null 
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      console.log(errors.array())
      res.status(400).json({
          code: 400,
          message: 'Invalid Form data for user',
          error: errors.array()
      })
  }else{
      console.log(req.body)
      const loginUser = await User.findOne({
          email: req.body.email, 
          password: req.body.password 
      })
      if(!loginUser){
          res.status(401).json({ code: 401, message: 'Invalid Email or Invalid Password '})
      }else{
          const { name, email, userId, isAdmin, createdAt, createdAgo, lastModifiedAgo, status } = loginUser 
          res.json({
              code: 200, 
              token: generateToken(loginUser),
              name, email, userId, isAdmin, createdAt,
              createdAgo, lastModifiedAgo, status
          })
      }
  }
}))
router.post('/register', (req, res, next) => {
  req.type = "register"
  next()
}, [ // 폼검증을 위한 미들웨어 
  validateUserName(),
  validateUserEmail(),
  validateUserPassword()
], expressAsyncHandler(async (req, res, next) => { // /api/users/register
  const errors = validationResult(req)
  if(!errors.isEmpty()){ // 폼 검증에 실패한 경우
      console.log(errors.array())
      res.status(400).json({
          code: 400,
          message: 'Invalid Form data for user',
          error: errors.array()
      })
  }else{
      console.log(req.body)
      const user = new User({
          name: req.body.name, 
          email: req.body.email, 
          userId: req.body.userId, 
          password: req.body.password
      })
      user.save() // 사용자정보 DB 저장 
      .then(() => {
          const {name, email, userId, isAdmin, createdAt } = user
          res.json({
              code: 200,
              token: generateToken(user), // 사용자 식별 + 권한검사를 위한 용도 
              name, email, userId, isAdmin, createdAt, // 사용자에게 보여주기 위한 용도
              status: user.status, 
              createdAgo: user.createdAgo,
              lastModifedAgo: user.lastModifiedAgo 
          })
      })
      .catch(e => {
          console.log(e)
          res.status(400).json({ code: 400, message: 'Invalid User Data'})
      })
  }
}))
router.post("logout",(req,res,next)=>{
    res.json("로그아웃")
})
router.put('/', oneOf([
  validateUserName(),
  validateUserEmail(),
  validateUserPassword()
], {
  message: 'At least one field of user must be provided'
}), isAuth, expressAsyncHandler( async (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      res.status(400).json({
          code: 400,
          message: 'Invalid Form data for user',
          error: errors.array()
      })
  }else{
      const user = await User.findById(req.user._id)
      if(!user){
          res.status(404).json({ code: 404, message: 'User Not Founded'})
      }else{
          user.name = req.body.name || user.name 
          user.email = req.body.email || user.email
          user.password = req.body.password || user.password
          user.isAdmin = req.body.isAdmin || user.isAdmin 
          user.lastModifiedAt = new Date() // 수정시각 업데이트

          const updatedUser = await user.save()
          const { name, email, userId, isAdmin, createdAt } = updatedUser
          res.json({
          code: 200,
          token: generateToken(updatedUser),
          name, email, userId, isAdmin, createdAt,
          status: updatedUser.status,
              createdAgo: updatedUser.createdAgo,
              lastModifiedAgo: updatedUser.lastModifiedAgo
          })
      }
  }
}))
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404).json({ code: 404, message: 'User Not Founded'})
  }else{
    res.status(204).json({ code: 204, message: 'User deleted successfully !' })
  }
}))
module.exports = router

