# Toms news project

## Background

This is an API to request and retrieve news information from a database with a variety of endpoints from a PSQL database using Knex to interact with the database.

The API accepts a variety of query as explained in the endpoints.json to following endpoints

* GET /api/topics

* GET /api/users/:username

* GET /api/articles/:article_id
* PATCH /api/articles/:article_id

* POST /api/articles/:article_id/comments
* GET /api/articles/:article_id/comments

* GET /api/articles

* PATCH /api/comments/:comment_id
* DELETE /api/comments/:comment_id

* GET /api

## Setting up your own repository

clone this repo:

git clone https://github.com/galloway118/BE-news-Tom-G.git 

### Prerequisites

The requirements for **NODE.js** and **Postgres** are

* NODE - "version": "1.0.5"
* Postgres - "version": "v12.10.0

In order to use the API you will need the following scripts in the package.json

"name": "be-nc-news",
  "version": "1.0.0",
  "description": "bc-nc-news",
  "main": "index.js",
  "scripts": {
    "seed:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex seed:run",
    "migrate-latest:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest",
    "migrate-rollback:prod": "NODE_ENV=production DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback",
    "setup-dbs": "psql -f ./db/setup.sql",
    "seed-dev": "npm run setup-dbs && knex seed:run",
    "seed-test": " npm run setup-dbs && knex seed:run",
    "test-utils": "mocha spec/utils.spec.js",
    "test": "mocha spec/server.spec.js ",
    "migrate-make": "knex migrate:make",
    "migrate-latest": "knex migrate:latest",
    "migrate-rollback": "knex migrate:rollback",
    "start": "node server.js"

### Installing

In order for the API to run you need to install the following dependencies

 run npm install (*)

* (*)"knex": "^0.20.4",
* (*)"pg": "^7.14.0",
* (*)"express": "^4.17.1"

You will also need to install the following dev dependencies 

  run npm install (*) -D


* (*)"chai": "^4.2.0",
* (*)"mocha": "^6.2.2",
* (*)"chai-sorted": "^0.2.0",
* (*)"supertest": "^4.0.2"

## Setting up a knex file 

You need to set up a knexfile.js wiht the following code:

const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};
const customConfig = {
  development: {
    connection: {
      database: 'nc_news'
    }
  },
  test: {
    connection: {
      database: 'nc_news_test'  
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
};

module.exports = { ...customConfig[ENV], ...baseConfig };

## Seeding 

In order to fill the database you will need to seed it, to do this use **npm seed-test** for testing

## Running the tests

In order to run the tests you should run

 **npm test**

## Accessing hosted version

The hosted version can be accessed at the following link 

https://git.heroku.com/tom-news-app.git

## Authors 

Tom G




