const endPoints = require('../endpoints.json')
const { request, response } = require('express')


const { allTopics,
    allArticles,
    findArticle,
    commentsFromArticle,
    postComment,
    changeVote,
    allUsers,
    selectedArticles,
    deleteComment,
    getUser,
    changeCommentVote,
    postArticle } = require('../models/news.models')


const endPointInfo = (request, response, next) => {
        response.status(200).send(endPoints)
}

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
            response.status(200).send({article})
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

const removeComment = (request, response, next) => {
    deleteComment(request.params.comment_id)
    .then((deletedComment) => {
        response.status(204).send(deletedComment)
    })
    .catch(next)
}

const specificUser = (request, response, next) => {
    getUser(request.params)
    .then((user) => {
        response.status(200).send(user)
    })
    .catch(next)
}

const updateCommentVotes = (request, response, next) => {
        
    const { comment_id } = request.params
    const { body } = request

    changeCommentVote(comment_id, body)
    .then((update) => {
        response.status(200).send(update)
    })
    .catch(next)
}

const newArticle = (request, response, next) => {
    postArticle(request.body)
    .then((article_id) => {
        return findArticle(article_id)
    })
    .then((article) => {
        response.status(201).send(article)
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
    endPointInfo,
    removeComment,
    specificUser,
    updateCommentVotes,
    newArticle,
}