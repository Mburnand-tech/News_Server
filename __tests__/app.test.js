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


describe('GET requests', () => {
    test('should return 404 for invalid end point', () => {
        return request(app).get('/api/NotaValidEndpoint')
        .expect(404)
        .then(( { body }) => {
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
    test('should return an Array of articles, additional columns of article_id and comment_count', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(( { body }) => {
            
            expect(body.length).toBe(12)

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
            expect(body).toBeSortedBy('created_at' , {descending: true})
        }) 
    })
    test('should give a Article_id param, it should return a object 8 specific properties representing that unique article', () => {
        return request(app).get('/api/articles/9')
        .expect(200)
        .then(( {body}) => {

            expect(body).toHaveProperty('author')
            expect(body).toHaveProperty('title')
            expect(body).toHaveProperty('article_id')
            expect(body).toHaveProperty('body')
            expect(body).toHaveProperty('topic')
            expect(body).toHaveProperty('created_at')
            expect(body).toHaveProperty('votes')
            expect(body).toHaveProperty('article_img_url')

            expect(body.article_id).toBe(9)
        })
    });
    test('With resource not found should return a 404 error', () => {
        return request(app).get('/api/articles/9999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    })
    test('With invalid parameter should return with a 400 error Bad request', () => {
        return request(app).get('/api/articles/NotaNumber')
        .expect(400)
        .then(({body}) => {
            expect(body.code).toBe('22P02')
        })
    });
    test('GET /api/articles/:article_id/comments, it should return an array of comments for the given article_id', () => {
            return request(app).get('/api/articles/9/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.length > 0).toBe(true)
                body.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment).toHaveProperty('article_id')
                })
            })
        })
    test('GET /api/articles/1/comments, should return all comment, checking length of array and order of data', () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(11)
            expect(body).toBeSortedBy('created_at' , { descending : true})
        })
    });
    test('Searching comments but invalid id should return a 404 error', () => {
        return request(app).get('/api/articles/9975/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    })
    test('With invalid parameter on comments endpoint should return with a 400 error Bad request', () => {
        return request(app).get('/api/articles/NotaNumber/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.code).toBe('22P02')
        })
    });
});

