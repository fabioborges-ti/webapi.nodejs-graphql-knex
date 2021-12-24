exports.up = function (knex) {
  return knex.schema.createTable('usuarios', table => {
    table.increments('id').primary();
    table.string('nome').notNull();
    table.string('email').notNull().unique();
    table.string('senha', 60).notNull();
    table.boolean('ativo').notNull().default(true);
    table.timestamp('data_criacao').default(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuarios');
};
