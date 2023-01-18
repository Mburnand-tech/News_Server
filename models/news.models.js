const endPoints = require('../endpoints.json')
const db = require('../db/connection')



const allTopics = () => {
    return db.query('SELECT * FROM topics;').then((response)=> {
        return response.rows
    })
}

const allArticles = () => {    
    
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`).then(({rows})=> {                    
                    
                    return rows
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





module.exports = {
    allTopics,
    allArticles,
    findArticle,
}