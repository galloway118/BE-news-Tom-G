
exports.up = function(knex) {
  return knex.schema.createTable('user', (userTable) => {
      userTable.string('username').primary().unique();
      userTable.string('avatar-URL').notNullable();
      userTable.string('name').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user');
};
