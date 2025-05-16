/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('matrices', (table) => {
        table.increments('id').primary();
        table.integer('user_id').notNullable();
        table.integer('rows').notNullable();
        table.integer('columns').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_modified').defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
    })
  
};

//   CREATE TABLE IF NOT EXISTS matrices (
//     matrix_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     rows INTEGER NOT NULL,
//     columns INTEGER NOT NULL,
//     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     last_modified DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(user_id)
//   );

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('matrices');
};
