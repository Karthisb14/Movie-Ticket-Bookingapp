const express = require('express')
require('./db/database')
const movierouter = require('./router/movie')
const admincinemarouter = require('./router/admincinema')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(movierouter)
app.use(admincinemarouter)

app.listen(port , () => {
    console.log(`Server is Running on ${port}`)
})