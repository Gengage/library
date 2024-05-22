const jwt = require("jsonwebtoken")

const token = jwt.sign({email:"test@gmail.com"},"비밀키",{expiresln:"1d"})
console.log(token)

const decodedResult = jwt.verify(token+'sss','비밀키')
console.log(decodedResult)