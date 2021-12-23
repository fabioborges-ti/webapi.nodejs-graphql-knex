module.exports = {
  client: 'postgresql',
  connection: {
    database: 'exercicios',
    user: 'postgres',
    password: 'aline123',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations',
  },
};
