/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('last_login');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
 
};
