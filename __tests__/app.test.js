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
    test('should return an Array of articles, by default should responsed with all articles, sorted by date in descending order', () => {
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
    test('GET /api/articles (queries): should responsed with all articles, sorted by votes in ascending order', () => {
        return request(app).get('/api/articles?sortby=votes&orderby=asc')
        .expect(200)
        .then(({body}) => {

          expect(body.length).toBe(12)

          expect(body).toBeSortedBy('votes')
        }) 
     });
    test('GET /api/articles (queries): should responsed with articles with only topic mitch, sorted by date in descending order', () => {
        return request(app).get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
          expect()
          body.forEach((article) => {
            expect(article.topic).toBe('mitch')
            
          })
          expect(body).toBeSortedBy('created_at', {descending : true})
        }) 
     })
    test('GET /api/articles (queries): should responsed with articles with topic cats, sorted by title in ascending order', () => {
        return request(app).get('/api/articles?topic=cats&sortby=title&orderby=asc')
        .expect(200)
        .then(({body}) => {
          body.forEach((article) => {
            expect(article.topic).toBe('cats')            
          })
          expect(body).toBeSortedBy('title', {ascending : true})
        }) 
     });
    test('GET /api/articles (queries): if any query param is mis-spelt ignore and return with full result', () => {
        return request(app).get('/api/articles?Itnotright=mitch')
        .expect(200)
        .then(({body}) => {
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
     });
     test('GET /api/articles (queries): if any query is mis-spelt return with a message', () => {
        return request(app).get('/api/articles?orderby=Thisisntright')
        .expect(404)
        .then(({body}) => {
          expect(body.problem).toBe("syntax_error")
        }) 
     });
});

describe('POST requests', () => {
    test('/api/articles/:article_id/comments: should return the posted comment', () => {
        return request(app).post('/api/articles/9/comments')
        .send({
            username : 'icellusedkars',
            body : 'What an interesting post ... Not! Test body'
        })
        .expect(201)
        .then(( {body}) => {

            expect(body[0].author).toBe('icellusedkars')
            expect(body[0].body).toBe('What an interesting post ... Not! Test body')
            body.forEach((insert) => {
                expect(insert).toHaveProperty('body')
                expect(insert).toHaveProperty('votes')
                expect(insert).toHaveProperty('author')
                expect(insert).toHaveProperty('article_id')
                expect(insert).toHaveProperty('created_at')
            })
        })

    });
    test('/api/articles/NotaNumber/comments: should return error', () => {
        return request(app).post('/api/articles/NotaNumber/comments')
        .send({
            username : 'icellusedkars',
            body : 'What an interesting post ... Not! Test body'
        })
        .expect(400)
        .then(({body}) => {
            expect(body.code).toBe('22P02')
        })
    });
    test('/api/articles/9/comments: should return error for missing username', () => {
        return request(app).post('/api/articles/9999/comments')
        .send({
            username : 'NotaUsername',
            body : 'What an interesting post ... Not! Test body'
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    })
    test('should test if no username is given on the body', () => {
        return request(app).post('/api/articles/2/comments')
        .send({
            body : 'What an interesting post ... Not! Test body'
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("Please login or create an account to post")
        })
    })
    test('should test if no content is given on the body', () => {
        return request(app).post('/api/articles/2/comments')
        .send({
            username : 'rogersop'
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe( "Please provide content to post")
        })
    });
});



describe('PATCH requests', () => {
    test('PATCH /api/articles/:article_id: Should update articles votes', () => {
        return request(app).patch('/api/articles/3')
        .send({
            inc_votes : 10 
        })
        .expect(200)
        .then(({body}) => {
            expect(body.length > 0).toBe(true)

            expect(body[0].votes).toBe(10)

            expect(body[0].article_id).toBe(3)
            expect(body[0]).toHaveProperty('title')
            expect(body[0]).toHaveProperty('topic')
            expect(body[0]).toHaveProperty('author')
            expect(body[0]).toHaveProperty('body')
            expect(body[0]).toHaveProperty('created_at')
            expect(body[0]).toHaveProperty('article_img_url')
        })
    })
    test('PATCH /api/articles/:article_id: Should update articles votes', () => {
        return request(app).patch('/api/articles/3')
        .send({
            inc_votes : -25
        })
        .expect(200)
        .then(({body}) => {
            expect(body[0].votes).toBe(-25)
        })
    })
    test('PATCH /api/articles/9999: should return a 404 error', () => {
        return request(app).patch('/api/articles/9999')
        .send({
            inc_votes : 50
        })
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    })
    test('PATCH /api/articles/NotaNumber: should return a 404 error', () => {
        return request(app).patch('/api/articles/NotaNumber')
        .send({
            inc_votes : -25
        })
        .expect(400)
        .then(({body}) => {
            expect(body.problem).toBe("invalid_text_representation")
        })
    })
    test('PATCH /api/articles/3: with incorrect body', () => {
        return request(app).patch('/api/articles/3')
        .send({
            wrong : -25
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Body of request invalid')
        })
    })
    test('PATCH /api/articles/3: with incorrect body', () => {
        return request(app).patch('/api/articles/3')
        .send({
            inc_votes : 'notANumber'
        })
        .expect(400)
        .then(({body}) => {
            expect(body.problem).toBe("invalid_text_representation")
        })
    });
});
