
exports.up = function(knex) {
    return knex.schema.createTable('article', (articleTable) => {
        articleTable.increments('article_id').primary();
        articleTable.string('title').notNullable();
        articleTable.string('body').notNullable();
        articleTable.integer('votes').defaultTo(0);
        articleTable.string('topic').references('topic.slug');
        articleTable.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {

    return knex.schema.dropTable('article');
};
