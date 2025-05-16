/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('operations', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.text('description');
        table.boolean('is_binary').notNullable();
    });
};

//   CREATE TABLE IF NOT EXISTS operations (
//     operation_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     operation_name TEXT NOT NULL UNIQUE,
//     description TEXT,
//     is_binary INTEGER NOT NULL
//   );

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('operations');
};
