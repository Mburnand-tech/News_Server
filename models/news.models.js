const endPoints = require('../endpoints.json')
const db = require('../db/connection')



const allTopics = () => {
    return db.query('SELECT * FROM topics;').then((response)=> {
        return response.rows
    })
}


const findArticle = (article_id) => {
    
    const query = `SELECT articles.author, articles.title, articles.article_id, articles.body ,articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.article_id)
    AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`
    return db.query(query, [article_id]).then(({rowCount , rows})=> {
        if (rowCount === 0){
            return Promise.reject({status:404, msg: 'Resource does not exist'})
        } 
        return rows
    }).catch((err) => {
        return Promise.reject(err)
    })
}

const postComment = (comment, article_id) => {
    if (!comment.username){
        return Promise.reject({status:404, msg: "Please login or create an account to post"})
    }
    if (!comment.body){
        return Promise.reject({status:404, msg: "Please provide content to post"})
    }


    return db.query(`INSERT INTO comments
                    (body, author, article_id)
                    VALUES
                    ($1, $2, $3) RETURNING *;`, [comment.body, comment.username, article_id])
                    .then(({rows}) => {
                        return rows
                    })
}

const commentsFromArticle = (article_id) => {
    
    return db.query(`SELECT * FROM comments
                    WHERE article_id = $1
                    ORDER BY created_at DESC`, [article_id]).then(({rows}) => {
                        return rows
                    })
}


const changeVote = (article_id, voteUpdate) => {
    
    
    if (!voteUpdate.inc_votes){
        return Promise.reject({status: 400, msg: 'Body of request invalid'})
    }

    const updateBy = voteUpdate.inc_votes

    return db.query(`UPDATE articles
                    SET votes = votes + $1
                    WHERE article_id = $2
                    RETURNING *;
                    `, [updateBy, article_id]).then(({rows}) => {
                        return rows
                    })
}


const selectedArticles = (query) => {

     let querySQL = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.article_id)
        AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id` 

    if (query.topic){
        // Should I iterate for mulitple topics?
        querySQL += `
        WHERE topic='${query.topic}'`
    }

    const sortby = query.sortby ? query.sortby : 'created_at'
    const orderby = query.orderby ? query.orderby : 'DESC'

    querySQL += `
        GROUP BY articles.article_id
        ORDER BY ${sortby} ${orderby};`
    
    return db.query(querySQL)
                    .then(({rows, rowCount}) => {
                        if (rowCount === 0){
                            return Promise.reject({status:404, msg: 'Please broaden filters'})
                        }
                        return rows
                    })
                    .catch((err)=> {
                        return Promise.reject(err)
                    })
}

const allUsers = () => {
    return db.query(`SELECT * 
                    FROM users`).then(({rows, rowCount}) => {
                        return rows
                    })
                
                }



const deleteComment = (comment_id) => {

    return db.query(`DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING *`, [comment_id])
                    .then(({rows, rowCount}) => {
                        if (rowCount === 0){
                            return Promise.reject({status:404, msg: 'Resource does not exist'})
                        }
                        return rows
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
}

const getUser = (username) => {

    return db.query(`SELECT * FROM users
                    WHERE username=$1`, [username.username])
                    .then(({rows, rowCount}) => {
                        if (rowCount === 0){
                            return Promise.reject({status: 404, msg: 'User does not exist'})
                        }
                        return rows
                    })
}

const changeCommentVote = (comment_id, voteUpdate) => {

    if (!voteUpdate.inc_votes){
        return Promise.reject({status: 400, msg: 'Body of request invalid'})
    }

    const updateBy = voteUpdate.inc_votes

    return db.query(`UPDATE comments
                    SET votes = votes + $1
                    WHERE comment_id = $2
                    RETURNING *;
                    `, [updateBy, comment_id]).then(({rows, rowCount}) => {
                    
                        if (rowCount === 0){
                            return Promise.reject({status: 404, msg: 'User does not exist'})
                        }
                        return rows
                    })
}

const postArticle = (content) => {

    if (!content.author ||!content.title ||!content.body ||!content.topic ){
        return Promise.reject({status: 400, msg: 'Content missing to post article'})
    }

    let url = content.article_img_url ? content.article_img_url : 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    return db.query(`INSERT INTO articles
                    (author, title, body, topic, article_img_url)
                    VALUES
                    ($1, $2, $3, $4, $5)
                    RETURNING article_id`, [content.author, content.title, content.body, content.topic, url])
                    .then(({rows}) => {
                        return rows[0].article_id
                    })
                    .catch((err) => {
                        console.log(err)
                        return Promise.reject(err)
                    })

}

const postTopic = (content) =>  {

    if (!content.slug ||!content.description){
        return Promise.reject({status: 400, msg: 'Content missing to post article'})
    }

    return db.query(`INSERT INTO topics
                    (slug, description)
                    VALUES
                    ($1, $2)
                    RETURNING *;`, [content.slug, content.description])
                    .then(({rows}) => {
                        return rows
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
}

const deleteArticle = (article_id) => {
    //console.log('check')
    //console.log(article_id)
    return db.query(`DELETE FROM articles
                    WHERE article_id = $1
                    RETURNING *`, [article_id])
                    .then(({rows}) => {
                        console.log('chjejhs')
                        console.log(rows)
                    })
                    .catch((err) => {
                        console.log(err)
                        return Promise.reject(err)
                    })
                    
}

module.exports = {
    allTopics,
    findArticle,
    postComment,
    commentsFromArticle,
    changeVote,
    selectedArticles,
    allUsers,
    deleteComment,
    getUser,
    changeCommentVote,
    postArticle,
    postTopic,
    deleteArticle,
}