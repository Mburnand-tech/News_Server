const { allTopics } = require('../models/news.models')

const newsTopics = (request, response, next) => {
    allTopics().then((topics)=> {
        response.status(200).send(topics)
    }).catch((err) => {
        next(err)
    })
}

module.exports = {
    newsTopics,
}