const { request, response } = require('express')
const { allTopics, allArticles ,findArticle } = require('../models/news.models')

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




module.exports = {
    newsTopics,
    newsArticles,
    specficNewsArticle,
}