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

module.exports = {
    allTopics,
}