const { request, response } = require('express')

const { allTopics, allArticles ,findArticle , postComment, commentsFromArticle } = require('../models/news.models')


const newsTopics = (request, response, next) => {
    allTopics().then((topics)=> {
        response.status(200).send(topics)
    }).catch((err) => {
        next(err)
    })
}

const newsArticles = (request, response, next) => {
    allArticles().then((articles) => {
        response.status(200).send(articles)
    }).catch((err) => {
        next(err)
    })
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


module.exports = {
    newsTopics,
    newsArticles,
    specficNewsArticle,
    newComment,
    allCommentsById,
}