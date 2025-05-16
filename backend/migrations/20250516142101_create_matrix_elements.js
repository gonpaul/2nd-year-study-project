/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('matrixElements', (table) => {
    table.increments('id').primary();
    table.integer('matrix_id').notNullable();
    table.integer('row_index').notNullable();
    table.integer('column_index').notNullable();
    table.float('value').notNullable();
    table.foreign('matrix_id').references('matrices.id');
    table.unique(['matrix_id', 'row_index', 'column_index']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('matrixElements');
};
