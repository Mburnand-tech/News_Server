const { response, request } = require('express')
const express = require('express')
const app = express()


const { newsTopics,
        newsArticles,
        specficNewsArticle,
        allCommentsById,
        newComment,
        updateArticleVotes,
        platformUsers,
        endPointInfo,
        removeComment,
        specificUser,
        updateCommentVotes,
        newArticle,
        newTopic,
        removeArticle,
     } = require("../controllers/news.controllers")


app.use(express.json())

app.get('/api/topics', newsTopics)
app.get('/api/articles', newsArticles)
app.get(`/api/articles/:article_id`, specficNewsArticle)
app.get('/api/articles/:article_id/comments', allCommentsById)
app.get('/api/users', platformUsers)
app.get('/api', endPointInfo)
app.get('/api/users/:username', specificUser)

app.post('/api/articles/:article_id/comments', newComment)
app.post('/api/articles', newArticle)
app.post('/api/topics', newTopic)

app.patch('/api/articles/:article_id', updateArticleVotes)
app.patch('/api/comments/:comment_id', updateCommentVotes)

app.delete('/api/comments/:comment_id', removeComment)
app.delete('/api/articles/:article_id', removeArticle)


app.use((err, request, response, next) => {
    //This is my PSQL error handler
    const errorHandler = 'PSQL'
    if (err.code === '22P02'){
        response.status(400).send({name : err.name, code :err.code,problem: "invalid_text_representation"})
    }
    if (err.code === '08P01'){
        response.status(400).send({name : err.name, code :err.code,problem: "protocol_violation"})
    } 
    if (err.code === '42601'){
        response.status(404).send({name : err.name, code :err.code,problem: "syntax_error"})
    }
    if (err.code === '22003'){
        response.status(404).send({name : err.name, code :err.code,problem: "numeric_value_out_of_range"})
    } 
    if (err.code === '23505'){
        response.status(404).send({name : err.name, code :err.code,problem: "unique_violation", detail: err.detail})
    }   
    else {
        next(err)
    }
})



app.use((err, request, response, next) => {
    //This is my custom error handler
    const errorHandler = 'Express'
    if (err.status === 400){     
        response.status(400).send(err)
    }
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