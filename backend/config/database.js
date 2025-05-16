// ... existing imports ...
require('dotenv').config();
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// Run migrations
async function migrateAndSeedDatabase() {
  try {
    await db.migrate.latest();
    console.log('Database migrated successfully.');
    // await db.seed.run();
    // console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error migrating database:', error);
  }
}

// Call the migration function
migrateAndSeedDatabase();

module.exports = db;