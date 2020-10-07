require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const port = 3000;

app.use(express.json())

const posts = [
  {
    username: 'Athul',
    title: 'Post 1'
  },
  {
    username: 'Krishna',
    title: 'Post 2'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  // res.json(posts.filter(post => post.username === req.user.name))
  res.json({"status": "Success"});
})

let refreshTokens = []


app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const title = req.body.title;
  const user = { name: username, head: title }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1500s' })
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user

    console.log(req.user);

    next()
  })
}

app.listen(port, () => {
  console.log("Server is listening on port" +port);
});