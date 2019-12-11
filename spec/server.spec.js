process.env.NODE_ENV = 'test';

const chai = require('chai');
//const chaiSorted = require('chai-sorted');
const {expect} = chai;
//chai.use(chaiSorted);

const request = require('supertest');
const {server} = require('../server');
const connection = require('../db/client');

describe('/api', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/sdsd', () => {
		it('GET:404', () => {
			return request(server)
				.get('/api/sdsd')
				.expect(404);
		});
    });
    describe('BAD METHOD: 504, responds with 504 and msg: Method not allowed',() => {
        describe('/topic', () => {
			it('"/" DELETE,PATCH,PUT: 504', () => {
				const badMethods = ['delete', 'patch', 'put'];
				const methodPromises = badMethods.map(method => {
					return request(server)
						[method]('/api/topic')
						.expect(405)
						.then(({ body: msg }) => {
							expect(msg.msg).to.equal('Method not allowed');
						});
				});
				return Promise.all(methodPromises);
			});
		});
    })
    describe('/api/topic', () => {
        it('GET 200: returns all topics', () => {
            return request(server)
            .get('/api/topic')
            .expect(200)
            .then(topics => {
                expect(topics.body).to.have.keys('topics');
                expect(topics.body.topics[0]).to.have.keys('description', 'slug');
            })
         })
    })
    describe('BAD METHOD: 504, responds with 504 and msg: Method not allowed',() => {
        describe('/users', () => {
			it('"/" DELETE,PATCH,PUT: 504', () => {
				const badMethods = ['delete', 'patch', 'put'];
				const methodPromises = badMethods.map(method => {
					return request(server)
						[method]('/api/users/:username')
						.expect(405)
						.then(({ body: msg }) => {
							expect(msg.msg).to.equal('Method not allowed');
						});
				});
				return Promise.all(methodPromises);
			});
        });
    });   
    describe('/api/users', () => {
        it('GET:200: returns user when given their username', () => {
            return request(server)
            .get('/api/users/lurker')
            .expect(200)
            .then(user => {
                expect(user.body.user).to.eql({
                        username: 'lurker',
                        name: 'do_nothing',
                        avatar_url:
                          'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                })
            })
        })
        it('GET - ERROR: 400 when passed a valid but missing id', () => {
            return request(server)
            .get('/api/users/sjsj')
            .expect(404)
            .then(err => {
                expect(err.body.msg).to.equal('user not found');

            })
        })
    });
    describe('/api/article', () => {
        describe('/api/article/:article_id', () => {
        it('GET:200: returns article when given their article_id', () => {
            return request(server)
            .get('/api/article/1')
            .expect(200)
            .then(article => {
                expect(article.body.article).to.have.keys(
                    'article_id',
                    'title',
                    'topic',
                    'author',
                    'body',
                    'created_at',
                    'votes',
                    'comment_count');
            })
        })
        it('ERROR - GET:404 return message when article id not in database', () => {
            return request(server)
            .get('/api/article/999')
            .expect(404)
            .then(error => 
            expect(error.body.msg).to.equal('article not found'));
        })
    
        it('ERROR - GET:400 return message when article id not in database', () => {
            return request(server)
            .get('/api/article/sausages')
            .expect(400)
            .then(error => 
            expect(error.body.msg).to.equal('Invalid input type'));
        })
        it('PATCH: 200 updates the vote column by the increment specified', () => {
    return request(server)
    .patch('/api/article/1')
    .send({inc_votes : 1})
    .expect(200)
    .then(article => {
        expect(article.body.article.votes).to.equal(101)
        })
     })
     it('PATCH: 200 updates the vote column by a negative increment', () => {
        return request(server)
        .patch('/api/article/1')
        .send({inc_votes : -1})
        .expect(200)
        .then(article => {
            expect(article.body.article.votes).to.equal(99)
            })
         })
     it('ERROR - PATCH: 400 when passed invalid id', () => {
         return request(server)
         .patch('/api/article/silly')
         .send({inc_votes : 1})
         .expect(400)
         .then(err => {
             expect(err.body.msg).to.equal('Invalid input type')
         })
     })
     it('ERROR - PATCH 400 when article_id not in the database', () => {
         return request(server)
         .patch('/api/article/9999')
         .send({inc_votes : 1})
         .expect(404)
         .then(err => {
             expect(err.body.msg).to.equal('article not found')
         })
     })
     it('ERROR - PATCH: 400 when passed an empty object', () => {
         return request(server)
         .patch('/api/article/1')
         .send({})
         .expect(400)
         .then(err => {
             expect(err.body.msg).to.equal('nothing to patch')
         })
     })
     it('ERROR - PATCH: 400 when passed an object with an incorrect input value type', () => {
        return request(server)
        .patch('/api/article/1')
        .send({inc_votes: 'peanuts' })
        .expect(400)
        .then(err => {
            expect(err.body.msg).to.equal('Invalid input type')
        })
    })
    describe('/api/article/:article_id/comments', () => {
        it('Post: 200 ', () => {
            return request(server)
            .post()
            .send()
            .expect()
            .then(article => {
                
                })
             })
    });

    });
  })      
})
//tests for negative votes
// test for invalid id
// test for no body sent 
// test for invalid body sent 
// test for valid but no present id 