# Northcoders News API

## :memo: **Summary**

This repository contains an example of a RESTful API that was created as part of a one-week solo sprint while I was a student at Northcoders. A sister project to its Front-End [NC_News](https://github.com/Mburnand-tech/NC_News).

It has been designed to provide the functionality for a Reddit-style news aggregation and comments board. The API provides endpoints for managing articles, users, likes and comments. The project demonstrates my proficiency in developing and launching a RESTful API using JavaScript, Node.js, Express.js, and PostgreSQL. It showcases my ability to implement a functional and user-friendly system for managing content.

The API is hosted via Render and can be viewed [here](https://nc-news-matts-personal-project.onrender.com/api).

## **API endpoints**

Users can query the Postgres database using the following implemented endpoints:

- [**`GET /api`**](https://nc-news-matts-personal-project.onrender.com/api) - Serves an endpoint glossary, providing all implemented methods with their available queries, syntax and example responses/inputs.
- [**`GET /api/users`**](https://nc-news-matts-personal-project.onrender.com/api/users) - Serves an array of all available users, including their username, nickname and avatar_url.
- [**`GET /api/topics`**](https://nc-news-matts-personal-project.onrender.com/api/topics)- Serves an array of all available topics, including their descriptions.
- [**`GET /api/articles`**](https://nc-news-matts-personal-project.onrender.com/api/articles) - Serves an array of all available articles, by default sorted in descending order by creation date. Accepts queries for filtering results by the author name, topic name, article title, amount of votes, amount of comments and creation date. Additionally being able to sort by in Ascending/Descending order.
- [**`GET /api/articles/:article_id`**](https://nc-news-matts-personal-project.onrender.com/api/articles/1) - Serves the article associated with provided article ID and all relevant article data. (also includes the body text from the article)
- [**`GET /api/articles/:article_id/comments`**](https://nc-news-matts-personal-project.onrender.com/api/1/comments) - Serves comment data associated with the provided article ID.
- [**`GET /api/users/:username`**](https://nc-news-matts-personal-project.onrender.com/api/users/grumpy19) - Serves information on a specific user associated with the username. Return Error Message if user's invalid.

- **`POST /api/articles/:article_id`** - Posts a comment and responds with the posted comment.
- **`POST /api/articles`** - Posts a article and responds with the posted article.


- **`PATCH /api/articles/:article_id`** - Allows incrementing/decrementing of the votes property of the article associated with provided article ID, using the votes property provided by JSON object in request body. Serves modified article with new votes value.
- **`PATCH /api/comments/:comment_id`** - Creates a new comment with provided comment ID assigned to it, uses JSON object in request body for username and body properties, automatically creates values for remaining properties. Serves newly created comment.


- **`DELETE /api/comments/:comment_id`** - Deletes the comment and all relevant data associated with the provided comment ID. 


For more specific information, please see `endpoints.json` or use the [`GET /api`](https://nc-news-matts-personal-project.onrender.com/api) endpoint


## **Setup**

### **Requirements**

- **Node.js**: 19.0.0 or later
- **PostgreSQL**: 12.12 or later

### **Cloning repository**

Clone with:

```bash
$ git clone https://github.com/Mburnand-tech/News_Server.git
```

And finally, ensure you are in the correct directory by running:

```bash
$ cd News_Server
```

### **Installing dependencies**

To install dependencies, simply run the command:

```bash
$ npm install
```

### **Creating Development/Test environment files**

Creation of `.env` files in the project root directory is required to use this project.

The contents must be as follows:

**.env.development:**

```
PGDATABASE=nc_news
```

**.env.test:**

```
PGDATABASE=nc_news_test
```

### **Database creation/seeding**

Run the following script in the root directory to create the development and test databases:

```bash
$ npm run setup-dbs
```

Then run:

```bash
$ npm run seed
```

To seed the databases with data.

### **Tests**

You can test that everything has been setup and is working correctly by using the command

```bash
$ npm test
```

---

## **Dependencies**

This project requires the following Node.JS packages:

### **Production dependencies**

| **Package** | **Version** | **Usage**                                             |
| ----------- | ----------- | ----------------------------------------------------- |
| dotenv      | ^16.0.0     | _Handles environment variable files_                  |
| express     | ^4.18.2     | _Routes API requests_                                 |
| pg          | ^8.10.0      | _Queries postgreSQL database_                         |
| pg-format   | ^1.0.4      | _Formats postgreSQL queries to prevent SQL injection_ |

### **Developer dependencies**

| **Package**   | **Version** | **Usage**                                             |
| ------------- | ----------- | ----------------------------------------------------- |
| husky         | ^8.0.2      | _Validates commit by running tests before committing_ |
| jest          | ^27.5.1     | _Provides framework for testing functionality_        |
| jest-extended | ^2.0.0      | _Adds additional jest testing identifiers_            |
| jest-sorted   | ^1.0.14     | _Adds sort testing for jest_                          |
| supertest     | ^6.3.3      | _Adds simplified web request testing_                 |
