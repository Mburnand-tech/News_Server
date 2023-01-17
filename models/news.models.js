const endPoints = require('../endpoints.json')
const db = require('../db/connection')


const allTopics = () => {
    return db.query('SELECT * FROM topics;').then((response)=> {
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
                })
}

const findArticle = (article_id) => {
    const query = `SELECT * FROM articles
                    WHERE article_id = $1;`
    return db.query(query, [article_id]).then(({rowCount , rows})=> {
        if (rowCount === 0){
            return Promise.reject({status:404, msg: 'Resource does not exist'})
        } 
        else {
            return rows
        }
    })
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
    findArticle,
}