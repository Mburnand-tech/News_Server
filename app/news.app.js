const { response, request } = require('express')
const express = require('express')
const app = express()

const { newsTopics , newsArticles , specficNewsArticle } = require("../controllers/news.controllers")


app.get('/api/topics', newsTopics)
app.get('/api/articles', newsArticles)
app.get(`/api/articles/:article_id`, specficNewsArticle)

app.use((err, request, response, next) => {
    //This is my PSQL error handler
    const errorHandler = 'PSQL'
    if (err.code === '22P02'){
        response.status(400).send({status: err.status , from: errorHandler ,msg: '22P02: invalid_text_representation from Matt'})
    } else {
        next(err)
    }
})


app.use((err, request, response, next) => {
    //This is my custom error handler
    const errorHandler = 'Express'
    if (err.status === 404){
        response.status(404).send({status: err.status , from: errorHandler , msg: '22P02: invalid_text_representation from Matt'})
    }
})



app.get('/api/*', (request, response) => {
    response.status(404).send({msg: 'Not a valid endpoint'})
})




module.exports = {
    app,
}