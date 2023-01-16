const request = require("supertest")

const endPointJSON = require("../endpoints.json")
const seed  = require('../db/seeds/seed')
const { app } = require('../app/news.app')
const data = require('../db/data/test-data')
//const data = require('../db/data/dev-data')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})



describe('GET requests', () => {
    test('Status 200: Using endPoint /api/topics, it should respond with object of topics with properties slug and description', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(( {body} ) => {
            body.forEach((element) => {
                expect(element).toHaveProperty('slug')
                expect(element).toHaveProperty('description')
            })
        })
    })
    test.only('should return an Array of articles, additional columns of article_id and commend_count', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(( { body }) => {
            
            body.forEach((element) => {
                expect(element).toHaveProperty('author')
                expect(element).toHaveProperty('title')
                expect(element).toHaveProperty('article_id')
                expect(element).toHaveProperty('topic')
                expect(element).toHaveProperty('created_at')
                expect(element).toHaveProperty('votes')
                expect(element).toHaveProperty('article_img_url')
                expect(element).toHaveProperty('comment_count')
            })
            //expect([3, 2, 1]).toBeSorted({ descending: true })
            //expect(body).toBeSortedBy('created_at')
            // console.log(body, "Was this it?")
            expect(body).toBeSortedBy('article_id' , {descending: true})
        }) 
    });
});

