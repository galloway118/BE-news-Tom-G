
exports.up = function(knex) {
    return knex.schema.createTable('topic', (topicTable)=> {
        topicTable.string('slug').primary().unique().notNullable();
        topicTable.string('description').notNullable();
    })
};

exports.down = function(knex) {
  return knex.schema.dropTable('topic');
};
