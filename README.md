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

In order to use the API you will need the following scripts in the package.json

 "name": "be-nc-news",
  "version": "1.0.0",
  "description": "bc-nc-news",
  "main": "index.js",
  "scripts": {
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

In order for the API to run you need to install the following npm programs

npm install (*)

* (*)knex
* (*)pg
* (*)express
* (*)chai
* (*)mocha
* (*)chaiSorted
* (*)supertest

## Seeding 

In order to fill the database you will need to seed it, to do this use **npm seed-test** for testing

## Running the tests

In order to run the tests you should run **npm test**

## Authors 

Tom G




