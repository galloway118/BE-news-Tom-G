
exports.up = function(knex) {
  return knex.schema.createTable('comment', (commentTable) => {
      commentTable.increments('comment_id').primary();
      commentTable.text('body').notNullable;
      commentTable.string('author').references('users.username').onDelete('CASCADE');
      commentTable.integer('votes').defaultTo(0);
      commentTable.timestamp('created_at').defaultTo(knex.fn.now());
      commentTable.integer('article_id').references('article.article_id').onDelete('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comment');
};
