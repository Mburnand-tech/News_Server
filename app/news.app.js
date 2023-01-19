const { response, request } = require('express')
const express = require('express')
const app = express()

const { newsTopics , newsArticles , specficNewsArticle , allCommentsById} = require("../controllers/news.controllers")



app.get('/api/topics', newsTopics)
app.get('/api/articles', newsArticles)
app.get(`/api/articles/:article_id`, specficNewsArticle)
app.get('/api/articles/:article_id/comments', allCommentsById)


app.use((err, request, response, next) => {
    //This is my PSQL error handler
    const errorHandler = 'PSQL'
    if (err.code === '22P02'){
        response.status(400).send({name : err.name, code :err.code,problem: "invalid_text_representation"})
    } else {
        next(err)
    }
})


app.use((err, request, response, next) => {
    //This is my custom error handler
    const errorHandler = 'Express'
    if (err.status === 404){      
        response.status(404).send(err)
    }
})



app.get('/api/*', (request, response) => {
    response.status(404).send({msg: 'Not a valid endpoint'})
})




module.exports = {
    app,
}