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

            expect(body.article[0]).toHaveProperty('author')
            expect(body.article[0]).toHaveProperty('title')
            expect(body.article[0]).toHaveProperty('article_id')
            expect(body.article[0]).toHaveProperty('body')
            expect(body.article[0]).toHaveProperty('topic')
            expect(body.article[0]).toHaveProperty('created_at')
            expect(body.article[0]).toHaveProperty('votes')
            expect(body.article[0]).toHaveProperty('article_img_url')

            expect(body.article[0].article_id).toBe(9)
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
    test('GET /api/users: should return an array of object with 3 properties', () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.length > 0).toBe(true)

            body.forEach((user) => {
                expect(user).toHaveProperty('username')
                expect(user).toHaveProperty('name')
                expect(user).toHaveProperty('avatar_url')
            })
        })

    })
    test('11. GET /api/articles/:article_id: does query return property with comment count', () => {
        return request(app).get('/api/articles/4')
        .expect(200)
        .then(({body}) => {
            expect(body.article[0]).toHaveProperty('comment_count')
            expect(body.article[0].comment_count * 1).toBe(0)
        })
    });
    test('11. GET /api/articles/:article_id: does query return articles with same article id', () => {
        return request(app).get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            expect(body.article[0].article_id).toBe(2)

            expect(body.article[0]).toHaveProperty('article_id')
            expect(body.article[0]).toHaveProperty('author')
            expect(body.article[0]).toHaveProperty('title')
            expect(body.article[0]).toHaveProperty('body')
            expect(body.article[0]).toHaveProperty('topic')
            expect(body.article[0]).toHaveProperty('created_at')
            expect(body.article[0]).toHaveProperty('votes')
            expect(body.article[0]).toHaveProperty('article_img_url')
            expect(body.article[0]).toHaveProperty('comment_count')

        })
    });
    test('11. GET /api/articles/:article_id: query with out of range article_id return error: Resource does not exist', () => {
        return request(app).get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    }); 
    test('13. GET /api', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveProperty("GET /api")
            expect(body).toHaveProperty("GET /api/topics")
            expect(body).toHaveProperty("GET /api/articles")
        })
    });
//-----------------------------
//q17
    test('17. GET /api/users/:username: should return 3 properties; username, name, avatar_url', () => {
        return request(app).get('/api/users/butter_bridge')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(1)

            expect(body[0]).toHaveProperty('username')
            expect(body[0]).toHaveProperty('name')
            expect(body[0]).toHaveProperty('avatar_url')

            expect(body[0].username).toBe('butter_bridge')
        })
    })
    test('17. GET /api/users/:username: should return 3 properties; username, name, avatar_url', () => {
        return request(app).get('/api/users/lurker')
        .expect(200)
        .then(({body}) => {
            expect(body.length).toBe(1)

            expect(body[0]).toHaveProperty('username')
            expect(body[0]).toHaveProperty('name')
            expect(body[0]).toHaveProperty('avatar_url')

            expect(body[0].username).toBe('lurker')
        })
    })
    test('17. GET /api/users/:username: should return error if error msg in user doesnt exist', () => {
        return request(app).get('/api/users/MattyB')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('User does not exist')
        })
    })
    test('17. GET /api/users/:username: should return sql error if error msg in user is invalid', () => {
        return request(app).get('/api/users/20098')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('User does not exist')
        })
    })
//-----------------------------

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
//-----------------------
//q19
    test('19. POST /api/articles: should have unique url and have all expected properties ', () => {
        return request(app).post('/api/articles')
        .send({
            author: 'lurker',
            title: 'Where can I buy a cat',
            body: 'Give me a location!',
            topic: 'cats',
            article_img_url: 'http://cdn.akc.org/content/article-body-image/siberian_husky_cute_puppies.jpg'
        })
        .expect(201)
        .then(({body}) => {

            expect(body[0]).toHaveProperty('author')
            expect(body[0]).toHaveProperty('title')
            expect(body[0]).toHaveProperty('body')
            expect(body[0]).toHaveProperty('topic')
            expect(body[0]).toHaveProperty('article_img_url')
            expect(body[0]).toHaveProperty('article_id')
            expect(body[0]).toHaveProperty('votes')
            expect(body[0]).toHaveProperty('created_at')
            expect(body[0]).toHaveProperty('comment_count')

            expect(body[0].article_img_url).toBe('http://cdn.akc.org/content/article-body-image/siberian_husky_cute_puppies.jpg')
        })
    })
    test('19. POST /api/articles: should make new topic and have default url ', () => {
        return request(app).post('/api/articles')
        .expect(201)
        .send({
            author: 'rogersop',
            title: 'I need to be heard',
            body: 'Something interesting',
            topic: 'paper'
        })
        .then(({body}) => {

            expect(body[0].author).toBe('rogersop')
            expect(body[0].topic).toBe('paper')
            expect(body[0].article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')

        })
    })
    test('19. POST /api/articles: invalid entry should throw error', () => {
        return request(app).post('/api/articles')
        .expect(400)
        .send({
            author: 'rogersop',
            body: 'Something interesting',
            topic: 'paper'
        })
        .then(({body}) => {
            expect(body.msg).toBe('Content missing to post article')
        })
    });
//-----------------------
    test('22. POST /api/topics: should make post request and return with correct properties', () => {
        return request(app).post('/api/topics')
        .send({
        "slug": "Dogs",
        "description": "articles about our favourite dogs"
        })
        .expect(201)
        .then(({body}) => {
            
            expect(body[0]).toHaveProperty('slug')
            expect(body[0]).toHaveProperty('description')

            expect(body[0].slug).toBe('Dogs')

            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                body.forEach((topic) => {
                    if (topic.description === "articles about our favourite dogs"){
                        expect(topic.description).toBe("articles about our favourite dogs")
                    }
                })
            })
        })
    })
    test('22. POST /api/topics: should make post request and return with correct properties', () => {
        return request(app).post('/api/topics')
        .send({
        "slug": "cats",
        "description": "articles about our favourite dogs"
        })
        .expect(404)
        .then(({body}) => {

            expect(body.detail).toBe('Key (slug)=(cats) already exists.')
        })
    });
//-----------------------
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
//----------------------
//q18
    test('18. PATCH /api/comments/:comment_id: should return comments with 5 properties', () => {
        return request(app).patch('/api/comments/3')
        .send({ inc_votes : -5 })
        .then(({body}) => {

            expect(body[0]).toHaveProperty('comment_id')
            expect(body[0]).toHaveProperty('body')
            expect(body[0]).toHaveProperty('votes')
            expect(body[0]).toHaveProperty('author')
            expect(body[0]).toHaveProperty('article_id')
            expect(body[0]).toHaveProperty('created_at')

            expect(body[0].votes).toBe(95)
        })
    });
    test('18. PATCH /api/comments/:comment_id: should return comments with 5 properties', () => {
        return request(app).patch('/api/comments/2')
        .send({ inc_votes : -1 })
        .then(({body}) => {
            expect(body[0].votes).toBe(13)

            return request(app).patch('/api/comments/2')
            .send({ inc_votes : 5 })
            .then(({body}) => {
                expect(body[0].votes).toBe(18)
            })
        })
    });
    test('18. PATCH /api/comments/:comment_id: should return comments with 5 properties', () => {
        return request(app).patch('/api/comments/NotaNumber')
        .send({ inc_votes : -1 })
        .expect(400)
        .then(({body}) => {
            expect(body.problem).toBe("invalid_text_representation")
        })
    })
    test('18. PATCH /api/comments/:comment_id: should return comments with 5 properties', () => {
        return request(app).patch('/api/comments/1009090909090')
        .send({ inc_votes : -1 })
        .expect(404)
        .then(({body}) => {
            expect(body.problem).toBe("numeric_value_out_of_range")
        })
    });
//----------------------
});


describe('DELETE requests', () => {
    test('shows comment exists', () => {
        return request(app).get('/api/articles/9/comments')
        .expect(200)
        .then(({body}) => {
            expect(body[0].comment_id).toBe(1)
        })
    })
    test('12. DELETE /api/comments/:comment_id: delete comment_id 1 from article 9, then do a Get request wher article id 1 isnt there', () => {
        return request(app).delete('/api/comments/1')
        .expect(204)
        .then(() => {
            return request(app).get('/api/articles/9/comments')
            .expect(200)
            .then(({body}) => {
                body.forEach((comment) => {
                    expect(comment.comment_id).not.toBe(1)
                })
            })
        })
    })
    test('12. DELETE /api/comments/:comment_id: error handle if comment doesnt exists', () => {
        return request(app).delete('/api/comments/98989898')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Resource does not exist')
        })
    })
    test('12. DELETE /api/comments/:comment_id: error handle if comment doesnt exists', () => {
        return request(app).delete('/api/comments/NotValid')
        .expect(400)
        .then(({body}) => {
            expect(body.problem).toBe("invalid_text_representation")
        })
    })
//THESE DON'T WORK !



    // test.only('23. DELETE /api/articles/:article_id: should respond with status 204', () => {
    //     return request(app).delete('/api/articles/1')
    //     .expect(204)
    // });
    // test('23. DELETE /api/articles/:article_id: should respond with status 204', () => {
    //     return request(app).get('/api/articles/9')
    //     .expect(200)
    //     .then(() => {
    //         return request(app).delete('/api/articles/9')
    //         .expect(204)
    //         .then(() => {
                
    //             return request(app).get('/api/articles/9')
    //             .expect(404)
    //             .then(({body}) => {
    //                 expect(body.msg).toBe('Resource does not exist')
    //             })
    //         })
    //     })
    // });
    //test if doesn't exists
});