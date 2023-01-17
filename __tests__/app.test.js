const request = require("supertest")

const endPointJSON = require("../endpoints.json")
const seed  = require('../db/seeds/seed')
const { app } = require('../app/news.app')
const data = require('../db/data/test-data')
//const data = require('../db/data/development-data')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

//console.log()

describe('GET requests', () => {
    test('should return 404 for invalid end point', () => {
        return request(app).get('/api/NotaValidEndpoint')
        .expect(404)
        .then(( { body }) => {
            //console.log(response.body)
            expect(body.msg).toBe('Not a valid endpoint')
        })
    });
    test('Status 200: Using endPoint /api/topics, it should respond with object of topics with properties slug and description', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(( { body } ) => {
            body.forEach((element) => {
                expect(element).toHaveProperty('slug')
                expect(element).toHaveProperty('description')
            })
            expect(body.length).toBe(3)
        })
    })
    test('should return an Array of articles, additional columns of article_id and commend_count', () => {
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
            expect(body).toBeSortedBy('article_id' , {descending: true})
        }) 
    })
    test('should give a Article_id param, it should return a object 8 specific properties representing that unique article', () => {
        return request(app).get('/api/articles/9')
        .expect(200)
        .then(( result ) => {
            const requestPath = result.req.path
            const body = result.body
            expect(body[0]).toHaveProperty('author')
            expect(body[0]).toHaveProperty('title')
            expect(body[0]).toHaveProperty('article_id')
            expect(body[0]).toHaveProperty('body')
            expect(body[0]).toHaveProperty('topic')
            expect(body[0]).toHaveProperty('created_at')
            expect(body[0]).toHaveProperty('votes')
            expect(body[0]).toHaveProperty('article_img_url')

            const article_idGiven = requestPath.slice(requestPath.indexOf('s/') + 2, requestPath.length) * 1
            expect(body[0].article_id).toBe(article_idGiven)
        })
    });
    test('With resource not found should return a 404 error', () => {
        return request(app).get('/api/articles/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.from).toBe('Express')
        })
    })
    test('With invalid parameter should return with a 400 error Bad request', () => {
        return request(app).get('/api/articles/NotaNumber')
        .expect(400)
        .then(({body}) => {
            expect(body.from).toBe('PSQL')
        })
    });
});

