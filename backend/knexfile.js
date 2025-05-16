// Knex configuration to pick environment based on NODE_ENV
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: process.env.DB_SQLITE_FILENAME || './dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations'
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_POSTGRES_HOST,
      port: process.env.DB_POSTGRES_PORT,
      user: process.env.DB_POSTGRES_USER,
      password: process.env.DB_POSTGRES_PASSWORD,
      database: process.env.DB_POSTGRES_DATABASE
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations'
    }
  }
};