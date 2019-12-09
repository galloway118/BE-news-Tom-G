
exports.up = function(knex) {
  return knex.schema.createTable('comment', (commentTable) => {
      commentTable.increments('comment_id').primary();
      commentTable.string('author').references('user.username');
      commentTable.integer('article_id').references('article.article_id');
      commentTable.timestamp('created_at');
      commentTable.integer('votes');
      commentTable.string('body');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comment');
};
