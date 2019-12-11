process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
const {expect} = chai;
chai.use(chaiSorted);

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
             expect(err.body.msg).to.equal('Post violates non null constraints')
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
    it('"/" DELETE,PATCH,PUT: 504', () => {
        const badMethods = ['delete', 'put'];
        const methodPromises = badMethods.map(method => {
            return request(server)
                [method]('/api/article/:article_id')
                .expect(405)
                .then(({ body: msg }) => {
                    expect(msg.msg).to.equal('Method not allowed');
                });
        });
        return Promise.all(methodPromises);
    });
    describe('/api/article/:article_id/comments', () => {
        it('Post: 201 ', () => {
            return request(server)
            .post('/api/article/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'this is my body' }
                )
            .expect(201)
            .then(comment=> {
                    expect(comment.body.comment.body).to.equal('this is my body')
                })
             })
             it('Post: 201 ', () => {
                return request(server)
                .post('/api/article/1/comments')
                .send({
                    username: 'butter_bridge',
                    body: 'this is my body' }
                    )
                .expect(201)
                .then(comment=> {
                        expect(comment.body.comment).to.have.keys('comment_id', 'votes', 'created_at', 'author', 'article_id', 'body')
                    })
                 })
        it('ERROR - POST: 400 when passed input with extra column values than there are in the database', () => {
            return request(server)
            .post('/api/article/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'this is my body',
                tidlywinks: 'what is going on'
             })
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Column does not exist') 
            })
        })
        it('ERROR - POST: 400 when post called with empty object', () => {
            return request(server)
            .post('/api/article/1/comments')
            .send({})
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Post violates non null constraints') 
            })
        })
        it('ERROR - POST: 400 when wrong value type passed into database', () => {
            return request(server)
            .post('/api/article/1/comments')
            .send({username: 'yabadabadooo',
            body: 'ssdkdf'})
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('request not valid') 
            })
        })
        it('GET:200: returns an array of comments when given their article_id', () => {
            return request(server)
            .get('/api/article/1/comments')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments[0]).to.have.keys(
                    'comment_id',
                    'votes',
                    'created_at',
                    'author',
                    'body');
            })
        })
        it('GET:200: returns an array sorted by a query when given their article_id', () => {
            return request(server)
            .get('/api/article/1/comments?sort_by=created_at')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments).to.be.descendingBy('created_at')
            })
        })
        it('GET:200: returns an array sorted in ascending order by a query when given their article_id', () => {
            return request(server)
            .get('/api/article/1/comments?sort_by=created_at&order=asc')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments).to.be.ascendingBy('created_at')
            })
        })
        it('ERROR - GET 400 when a valid article_id not in the database', () => {
            return request(server)
            .get('/api/article/999/comments?sort_by=created_at')
            .expect(404)
            .then(err => {
                expect(err.body.msg).to.equal('comments not found')
            })
        })
        it('ERROR - GET 400 when an invalid article_id is used', () => {
            return request(server)
            .get('/api/article/biscuits/comments?sort_by=created_at')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid input type')
            })
        })
        it('ERROR - GET 400 when query is invalid', () => {
            return request(server)
            .get('/api/article/1/comments?sort_by=cheese')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid query')
            })
        })
        it('ERROR - GET 400 when order is invalid', () => {
            return request(server)
            .get('/api/article/1/comments?sort_by=created_at&order=this_is_not_correct')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid order value')
            })
        })
        
    });
    });
  })      
})

