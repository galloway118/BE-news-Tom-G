
exports.up = function(knex) {
    return knex.schema.createTable('article', (articleTable) => {
        articleTable.increments('article_id').primary().notNullable();
        articleTable.string('title').notNullable();
        articleTable.string('topic').references('topic.slug').onDelete('CASCADE').notNullable();
        articleTable.string('author').references('users.username').onDelete('CASCADE').notNullable();
        articleTable.text('body').notNullable();
        articleTable.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        articleTable.integer('votes').defaultTo(0).notNullable();
    });
};

exports.down = function(knex) {

    return knex.schema.dropTable('article');
};
