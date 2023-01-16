const { allTopics, allArticles } = require('../models/news.models')

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

module.exports = {
    newsTopics,
    newsArticles,
}