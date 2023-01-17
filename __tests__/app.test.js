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

describe("main test", () => {
    test('should ', () => {
        
    });
})
