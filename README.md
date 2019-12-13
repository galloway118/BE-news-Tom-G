# **Toms news project**

## **Background**

This is an API to request and retrieve news information from a variety of endpoints from a PSQL database using Knex to interact with the database.

The API accepts a variety of query as explained in the endpoints.json

### **Prerequisites**

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

### **Installing**

## **Running the tests





