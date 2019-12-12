
exports.up = function(knex) {
    return knex.schema.createTable('article', (articleTable) => {
        articleTable.increments('article_id').primary();
        articleTable.string('title').notNullable();
        articleTable.string('topic').references('topic.slug').onDelete('CASCADE');
        articleTable.string('author').references('users.username').onDelete('CASCADE');
        articleTable.text('body').notNullable();
        articleTable.timestamp('created_at').defaultTo(knex.fn.now());
        articleTable.integer('votes').defaultTo(0);
    });
};

exports.down = function(knex) {

    return knex.schema.dropTable('article');
};
