const { request, response } = require('express')


const { allTopics,
    allArticles,
    findArticle,
    commentsFromArticle,
    postComment,
    changeVote,
    selectedArticles,
    allUsers } = require('../models/news.models')



const newsTopics = (request, response, next) => {
    allTopics().then((topics)=> {
        response.status(200).send(topics)
    }).catch((err) => {
        next(err)
    })
}

const newsArticles = (request, response, next) => {
    
        selectedArticles(request.query)
        .then((articles) => {
            response.status(200).send(articles)
        })
        .catch(next)
    
}

const specficNewsArticle = (request, response, next) => {
    const { article_id } = request.params
    findArticle(article_id).then((article) => {
        response.status(200).send(article[0])
    }).catch(next)
}

const newComment = (request, response, next) => {

    const { body, params} = request
    
    findArticle(params.article_id)
    .then(() => {
        return postComment(body, params.article_id)
    })
    .then((comment) => {
        response.status(201).send(comment)
    })
    .catch(next)   
}
  
const allCommentsById = (request, response, next) => {
    const { article_id } = request.params
    findArticle(article_id)
    .then(() => {
        return commentsFromArticle(article_id)
    })
    .then((comments) => {
        response.status(200).send(comments)
    }).catch(next)

}

const updateArticleVotes = (request, response, next) => {
    
    const { article_id } = request.params
    const { body } = request
    findArticle(article_id)
    .then(() => {
        return changeVote(article_id, body)
    }).then((update) => {
        response.status(200).send(update)
    })
    .catch(next)
}

const platformUsers = (request, response, next) => {
    allUsers()
    .then((users) => {
        response.status(200).send(users)
    })
    .catch(next)
}


module.exports = {
    newsTopics,
    newsArticles,
    specficNewsArticle,
    newComment,
    allCommentsById,
    updateArticleVotes,
    platformUsers,
}