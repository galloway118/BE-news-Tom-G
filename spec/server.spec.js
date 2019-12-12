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
    it('GET:200 returns a list of the available endpoints on the API', () => {
        return request(server)
        .get('/api')
        .expect(200)
        .then(response =>  { expect(response).to.be.a('object')})
    })
    describe('/sdsd', () => {
		it('GET:404', () => {
			return request(server)
				.get('/sdsd')
				.expect(404);
		});
    });
    describe('/api/topic', () => {
        it('GET 200: returns all topics', () => {
            return request(server)
            .get('/api/topics')
            .expect(200)
            .then(topics => {
                expect(topics.body).to.have.keys('topics');
                expect(topics.body.topics[0]).to.have.keys('description', 'slug');
            })
         })
         it('"/" DELETE,PATCH,PUT: 405', () => {
            const badMethods = ['delete', 'put', 'patch'];
            const methodPromises = badMethods.map(method => {
                return request(server)
                    [method]('/api/topics')
                    .expect(405)
                    .then(({ body: msg }) => {
                        expect(msg.msg).to.equal('Method not allowed');
                    });
            });
            return Promise.all(methodPromises);
        }); 
    })   
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
        it('"/" DELETE,PATCH,PUT: 405', () => {
            const badMethods = ['delete', 'put', 'patch'];
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
        it('"/" DELETE,PATCH,PUT: 405', () => { 
        const badMethods = ['delete', 'put', 'patch'];
        const methodPromises = badMethods.map(method => {
            return request(server)
                [method]('/api/articles')
                .expect(405)
                .then(({ body: msg }) => {
                    expect(msg.msg).to.equal('Method not allowed');
                });
        });
        return Promise.all(methodPromises);
    });
        it('GET:200: returns an array of comments when given their article_id', () => {
            return request(server)
            .get('/api/articles')
            .expect(200)
            .then(article => {
                expect(article.body.articles[0]).to.have.keys(
                    'author',
                    'votes',
                    'title',
                    'topic',
                    'created_at',
                    'comment_count',
                    'article_id'
                    );
            })
        })
        it('GET:200: returns an array of objects sorted in descending order', () => {
            return request(server)
            .get('/api/articles?sort_by=created_at')
            .expect(200)
            .then(article => {
                expect(article.body.articles).to.be.descendingBy('created_at')
            })
        })
        it('GET: 200 it should sort by various queries', () => {
			return request(server)
				.get('/api/articles?sort_by=title&order=asc')
				.expect(200)
				.then(article => {
					expect(article.body.articles).to.be.ascendingBy('title');
				});
		});
        it('GET: 200 returns articles when specific search passed in url query', () => {
			return request(server)
				.get('/api/articles?author=icellusedkars')
				.expect(200)
				.then(articleArr => {
					articleArr.body.articles.forEach(article => {
						expect(article.author).to.equal('icellusedkars');
					});
				});
        });
        it('GET:200 sends an empty array of articles when there are no authors in the database', () => {
            return request(server)
              .get('/api/articles?author=lurker')
              .expect(200)
              .then(comment => {
                  //console.log(comment)
                expect(comment.body.articles).to.eql([]);
              });
          });
          it('GET:200 sends an empty array of articles when there are no topics in the database', () => {
            return request(server)
              .get('/api/articles?topic=paper')
              .expect(200)
              .then(comment => {
                expect(comment.body.articles).to.eql([]);
              });
          });



        it('ERROR - GET: 400  return message when column does not exist in DB ', () => {
			return request(server)
				.get('/api/articles?yabadabadooo=icellusedkars')
				.expect(400)
				.then(articles => {
					expect(articles.body.msg).to.equal('Column does not exist');
				});
		});
		it.only('ERROR - GET: 200 returns a empty array when valid query finds no results', () => {
			return request(server)
				.get('/api/articles?topic=whatareyouthinking')
				.expect(200)
				.then(articles => {
					expect(articles.body.articles).to.eql([]);
				});
        });
        it('ERROR - GET: 400 when query is invalid', () => {
			return request(server)
				.get('/api/articles?sort_by=doooo')
				.expect(400) //< changed from 404
				.then(err => {
					expect(err.body.msg).to.equal('Invalid query');
				});
		});
		it('ERROR - GET: 400 when order is invalid', () => {
			return request(server)
				.get('/api/articles?sort_by=topic&order=yourdoingthiswrong')
				.expect(400) 
				.then(err => {
					expect(err.body.msg).to.equal('Invalid order value');
				});
		});
    describe('/api/article/:article_id', () => {
        it('GET:200: returns article when given their article_id', () => {
            return request(server)
            .get('/api/articles/1')
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
            .get('/api/articles/999')
            .expect(404)
            .then(error => 
            expect(error.body.msg).to.equal('article not found'));
        })
    
        it('ERROR - GET:400 return message when article id not valid', () => {
            return request(server)
            .get('/api/articles/sausages')
            .expect(400)
            .then(error => 
            expect(error.body.msg).to.equal('Invalid input type'));
        })
        it('PATCH: 200 updates the vote column by the increment specified', () => {
    return request(server)
    .patch('/api/articles/1')
    .send({inc_votes : 1})
    .expect(200)
    .then(article => {
        expect(article.body.article.votes).to.equal(101)
        })
     })
     it('PATCH: 200 updates the vote column by a negative increment', () => {
        return request(server)
        .patch('/api/articles/1')
        .send({inc_votes : -1})
        .expect(200)
        .then(article => {
            expect(article.body.article.votes).to.equal(99)
            })
         })
     it('ERROR - PATCH: 400 when passed invalid id', () => {
         return request(server)
         .patch('/api/articles/silly')
         .send({inc_votes : 1})
         .expect(400)
         .then(err => {
             expect(err.body.msg).to.equal('Invalid input type')
         })
     })
     it('ERROR - PATCH 404 when article_id not in the database', () => {
         return request(server)
         .patch('/api/articles/9999')
         .send({inc_votes : 1})
         .expect(404)
         .then(err => {
             expect(err.body.msg).to.equal('article not found')
         })
     })
     it('PATCH: 200 when passed an empty object', () => {
         return request(server)
         .patch('/api/articles/1')
         .send({})
         .expect(200)
         .then(article => {
            expect(article.body.article.votes).to.equal(100)
         })
     })
     it('ERROR - PATCH: 400 when passed an object with an incorrect input value type', () => {
        return request(server)
        .patch('/api/articles/1')
        .send({inc_votes: 'peanuts' })
        .expect(400)
        .then(err => {
            expect(err.body.msg).to.equal('Invalid input type')
        })
    })
    it('"/" DELETE,PATCH,PUT: 405', () => {
        const badMethods = ['delete', 'put'];
        const methodPromises = badMethods.map(method => {
            return request(server)
                [method]('/api/articles/:article_id')
                .expect(405)
                .then(({ body: msg }) => {
                    expect(msg.msg).to.equal('Method not allowed');
                });
        });
        return Promise.all(methodPromises);
    });
    describe('/api/articles/:article_id/comments', () => {
        it('"/" DELETE,PATCH,PUT: 405', () => {
            const badMethods = ['delete', 'put'];
            const methodPromises = badMethods.map(method => {
                return request(server)
                    [method]('/api/articles/:article_id/comments')
                    .expect(405)
                    .then(({ body: msg }) => {
                        expect(msg.msg).to.equal('Method not allowed');
                    });
            });
            return Promise.all(methodPromises);
        });
        it('Post: 201 ', () => {
            return request(server)
            .post('/api/articles/1/comments')
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
            .post('/api/articles/1/comments')
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
            .post('/api/articles/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'this is my body',
                tidlywinks: 'what is going on'
             })
            .expect(404)
            .then(err => {
                expect(err.body.msg).to.equal('Column/id does not exist') 
            })
        })
        it('ERROR - POST: 404 when a valid but non existent article_id the database', () => {
            return request(server)
            .post('/api/articles/1/comments')
            .send({
                username: 'butter_bridge',
                body: 'this is my body',
                tidlywinks: 'what is going on'
             })
            .expect(404)
            .then(err => {
                expect(err.body.msg).to.equal('Column/id does not exist') 
            })
        })
        it('ERROR - POST: 400 when post called with empty object', () => {
            return request(server)
            .post('/api/articles/1/comments')
            .send({})
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Post violates non null constraints') 
            })
        })
        it('ERROR - POST: 400 when wrong value type passed into database', () => {
            return request(server)
            .post('/api/articles/1/comments')
            .send({username: 'yabadabadooo',
            body: 'ssdkdf'})
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('request not valid') 
            })
        })
        it('GET:200: returns an array of comments when given their article_id', () => {
            return request(server)
            .get('/api/articles/1/comments')
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
        it('GET:200 sends an empty array of articles when there are no comments in the database', () => {
            return request(server)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(comment => {
                expect(comment.body.comments).to.eql([]);
              });
          });
        it('GET:200: returns an array sorted by a query when given their article_id', () => {
            return request(server)
            .get('/api/articles/1/comments?sort_by=created_at')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments).to.be.descendingBy('created_at')
            })
        })
        it('GET:200: returns an array sorted by a different query when given their article_id', () => {
            return request(server)
            .get('/api/articles/1/comments?sort_by=article_id')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments).to.be.descendingBy('created_at')
            })
        })
        it('GET:200: returns an array sorted in ascending order by a query when given their article_id', () => {
            return request(server)
            .get('/api/articles/1/comments?sort_by=created_at&order=asc')
            .expect(200)
            .then(comment => {
                expect(comment.body.comments).to.be.ascendingBy('created_at')
            })
        })
        it('ERROR - GET 400 when a valid article_id not in the database', () => {
            return request(server)
            .get('/api/articles/999/comments?sort_by=created_at')
            .expect(404)
            .then(err => {
                expect(err.body.msg).to.equal('article_id does not exist')
            })
        })
        it('ERROR - GET 400 when an invalid article_id is used', () => {
            return request(server)
            .get('/api/articles/biscuits/comments?sort_by=created_at')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid input type')
            })
        })
        it('ERROR - GET 400 when query is invalid', () => {
            return request(server)
            .get('/api/articles/1/comments?sort_by=cheese')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid query')
            })
        })
        it('ERROR - GET 400 when order is invalid', () => {
            return request(server)
            .get('/api/articles/1/comments?sort_by=created_at&order=this_is_not_correct')
            .expect(400)
            .then(err => {
                expect(err.body.msg).to.equal('Invalid order value')
            })
        })
    });
    });
  })  
  describe('/api/comment', () => {
    it('"/" DELETE,POST,PUT: 405', () => {
        const badMethods = ['put', 'get'];
        const methodPromises = badMethods.map(method => {
            return request(server)
                [method]('/api/comments/:comment_id')
                .expect(405)
                .then(({ body: msg }) => {
                    expect(msg.msg).to.equal('Method not allowed');
                });
        });
        return Promise.all(methodPromises);
    });
    it('PATCH: 200 updates the vote column by the increment specified', () => {
        return request(server)
        .patch('/api/comments/3')
        .send({inc_votes : 1})
        .expect(200)
        .then(comment => {
            expect(comment.body.comment.votes).to.equal(101)
            })
    })
    it('PATCH: 200 updates the vote column by a negative increment', () => {
            return request(server)
            .patch('/api/comments/3')
            .send({inc_votes : -1})
            .expect(200)
            .then(comment => {
                expect(comment.body.comment.votes).to.equal(99)
                })
    })
    it('ERROR - PATCH: 400 when passed invalid id', () => {
         return request(server)
         .patch('/api/comments/silly')
         .send({inc_votes : 1})
         .expect(400)
         .then(err => {
             expect(err.body.msg).to.equal('Invalid input type')
         })
     })
     it('ERROR - PATCH 400 when article_id not in the database', () => {
         return request(server)
         .patch('/api/comments/9999')
         .send({inc_votes : 1})
         .expect(404)
         .then(err => {
             expect(err.body.msg).to.equal('comment not found')
         })
     })
     it('PATCH: 200 when passed an empty object returns the object unchanged', () => {
         return request(server)
         .patch('/api/comments/1')
         .send({})
         .expect(200)
         .then(comment => {
            expect(comment.body.comment.votes).to.equal(16)
         })
     })
     it('ERROR - PATCH: 400 when passed an object with an incorrect input value type', () => {
        return request(server)
        .patch('/api/comments/1')
        .send({inc_votes: 'peanuts' })
        .expect(400)
        .then(err => {
            expect(err.body.msg).to.equal('Invalid input type')
        })
    })
    it('DELETE: 204 deletes the comment with the specified comment_id and sends no body', () => {
        return request(server)
        .delete('/api/comments/3')
        .expect(204)
         })
    it('ERROR - DELETE: 404 responds with an error message when given a valid but non-existent comment_id', () => {
        return request(server)
        .delete('/api/comments/393939393')
        .expect(404)
        .then(err => {
            expect(err.body.msg).to.equal('comment_id not found')
        })
    }) 
    it('ERROR - DELETE: 400 responds with an error message when given a valid but non-existent comment_id', () => {
        return request(server)
        .delete('/api/comments/aaaarrrrrrgggghhhhh')
        .expect(400)
        .then(err => {
            expect(err.body.msg).to.equal('Invalid input type')
        })
    })   
  });    
})

