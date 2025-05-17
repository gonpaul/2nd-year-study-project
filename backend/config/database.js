// ... existing imports ...
require('dotenv').config();
const knex = require('knex');
const knexConfig = require('../knexfile.js');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// Check if operations table is empty
async function isOperationsTableEmpty() {
  try {
    const count = await db('operations').count('* as count').first();
    return count.count === 0;
  } catch (error) {
    console.error('Error checking operations table:', error);
    return true; // Assume empty if there's an error (table might not exist yet)
  }
}

// Run migrations
async function migrateAndSeedDatabase() {
  try {
    await db.migrate.latest();
    console.log('Database migrated successfully.');
    
    // Check if operations table is empty and seed if needed
    const isEmpty = await isOperationsTableEmpty();
    if (isEmpty) {
      await db.seed.run();
      console.log('Database seeded successfully.');
    } else {
      console.log('Operations table already has data, skipping seed.');
    }
  } catch (error) {
    console.error('Error migrating database:', error);
  }
}

// Call the migration function
migrateAndSeedDatabase();

module.exports = db;