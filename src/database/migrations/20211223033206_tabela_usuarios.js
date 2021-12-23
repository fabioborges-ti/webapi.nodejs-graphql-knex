exports.up = function (knex) {
  return knex.schema
    .createTable('usuarios', table => {
      table.increments('id').primary();
      table.string('nome').notNull();
      table.string('email').notNull().unique();
      table.string('senha', 60).notNull();
      table.boolean('ativo').notNull().default(true);
      table.timestamp('data_criacao').default(knex.fn.now());
    })
    .then(function () {
      return knex('usuarios').insert([
        { nome: 'João Oliveira', email: 'joao@email.com', senha: '1234' },
        { nome: 'Gabriela Gomes', email: 'gabriela@email.com', senha: '1234' },
        { nome: 'Jaime Chaves', email: 'jaime@email.com', senha: '1234' },
      ]);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('usuarios');
};
