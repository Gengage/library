const express = require("express")
const app = express()
const cors = require("cors")
const logger = require("morgan")
const mongoose = require("mongoose")
const axios = require("axios")
const adminsRouter = require("./src/routes/admins")
const booksRouter = require("./src/routes/books")
const searchsRouter = require("./src/routes/searchs")
const usersRouter = require("./src/routes/users")
const config = require("./config")
const corsOptions = { // CORS 옵션
    origin: '*',
    credentials: true
}
const CONNECT_URL = 'mongodb://localhost:27017/syleemomo'
mongoose.connect(CONNECT_URL)
.then(() => console.log("mongodb connected ..."))
.catch(e => console.log(`failed to connect mongodb: ${e}`))

app.use(cors(corsOptions)) // CORS 설정
app.use(express.json()) // request body 파싱
app.use(logger('tiny')) // Logger 설정 

app.use('/api/admins',adminsRouter)
app.use('/api/books',booksRouter)
app.use('/api/searchs',searchsRouter)
app.use('/api/users',usersRouter)

app.get('/hello', (req, res) => { // URL 응답 테스트
  res.json('hello world !')
})
app.post('/hello', (req, res) => { // POST 요청 테스트 
  console.log(req.body)
  res.json({ userId: req.body.userId, email: req.body.email })
})
app.get('/error', (req, res) => { // 오류 테스트 
  throw new Error('서버에 치명적인 에러가 발생했습니다.')
})
app.get('/fetch', async (req, res) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
  res.send(response.data)
})

// 폴백 핸들러 (fallback handler)
app.use( (req, res, next) => {  // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page")
})
app.use( (err, req, res, next) => { // 서버 내부 오류 처리
    console.error(err.stack)
    res.status(500).send("something is broken on server !")
})
app.listen(5000, () => { // 5000 포트로 서버 오픈
    console.log('server is running on port 5000 ...')
})