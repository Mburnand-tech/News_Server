const endPoints = require('../endpoints.json')
const db = require('../db/connection')


const allTopics = () => {
    return db.query('SELECT * FROM topics;').then((response)=> {
        //console.log(response)
        //console.log(Error)
        if (!response.rows){
            return Promise.reject({msg: "Matts through a fail from Models.js"})
        }
        return response.rows
    })
}

const allArticles = () => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, 
                articles.topic, articles.created_at, comments.votes, articles.article_img_url
                FROM articles
                JOIN comments
                ON articles.article_id = comments.article_id
                ORDER BY article_id DESC`).then((response)=> {                    
                    
                    return commentCounter(response)
                    }
                )
}

const commentCounter = (queryData) => {
    let commentTemplate = {}
    const data = queryData.rows
    data.forEach((article) => {
        if (commentTemplate.hasOwnProperty(article.article_id)){
            commentTemplate[article.article_id] += 1
        }
        else if (!commentTemplate.hasOwnProperty(article.article_id)){
            commentTemplate[article.article_id] = 1
        }
    })
    Object.keys(commentTemplate).forEach((id) => {
        data.forEach((article) => {
            if (id = article.article_id){
                article['comment_count'] = commentTemplate[id]
            }
        })
    })
    //console.log(data)
    return data
    }

module.exports = {
    allTopics,
    allArticles,
}