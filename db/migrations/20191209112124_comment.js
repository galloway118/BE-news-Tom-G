
exports.up = function(knex) {
  return knex.schema.createTable('comment', (commentTable) => {
      commentTable.increments('comment_id').primary().notNullable();
      commentTable.text('body').notNullable();
      commentTable.string('author').references('users.username').onDelete('CASCADE').notNullable();
      commentTable.integer('votes').defaultTo(0).notNullable();
      commentTable.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
      commentTable.integer('article_id').references('article.article_id').onDelete('CASCADE').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('comment');
};
