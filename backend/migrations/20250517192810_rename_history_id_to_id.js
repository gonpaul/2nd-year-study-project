/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('calculationHistory', function(table) {
    // Rename history_id to id
    table.renameColumn('history_id', 'id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('calculationHistory', function(table) {
    // Revert the change if needed
    table.renameColumn('id', 'history_id');
  });
};
