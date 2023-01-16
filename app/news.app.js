const { response } = require('express')
const express = require('express')
const app = express()

const { newsTopics } = require("../controllers/news.controllers")


app.get('/api/topics', newsTopics)


app.use((err, request, response, next) => {
    console.log(err)
    response.send(err)
})


module.exports = {
    app,
}