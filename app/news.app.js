const { response, request } = require('express')
const express = require('express')
const app = express()

const { newsTopics , newsArticles } = require("../controllers/news.controllers")


app.get('/api/topics', newsTopics)
app.get('/api/articles', newsArticles)
app.get('/api/*', (request, response) => {
    response.status(404).send({msg: 'Not a valid endpoint'})
    /*
    From comment: https://github.com/Mburnand-tech/News_Server/pull/1#discussion_r1071382866
    Is this what you meant? 
    Is it correct logic: because it will sit furthest down the page it is conditional logic for anyting else that isn't satisfied before it.
    Why would we not handle this like an error? Where we send off the query, the query has an error which we then pass back down the error handling chain to be dealt with.   
    */
})

app.use((err, request, response, next) => {
    console.log(err)
    response.send(err)
})


module.exports = {
    app,
}