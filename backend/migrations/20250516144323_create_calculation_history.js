/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('calculationHistory', (table) => {
        table.increments('history_id').primary();
        table.integer('user_id').notNullable();
        table.integer('operation_id').notNullable();
        table.integer('result_matrix_id');
        table.integer('matrix_a_id');
        table.integer('matrix_b_id').nullable();
        table.float('scalar_value').nullable();
        table.timestamp('timestamp').notNullable().defaultTo(knex.fn.now());
        table.foreign('user_id').references('users.id');
        table.foreign('operation_id').references('operations.id');
        table.foreign('result_matrix_id').references('matrices.id');
        table.foreign('matrix_a_id').references('matrices.id');
        table.foreign('matrix_b_id').references('matrices.id');
    });
};

//     history_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     operation_id INTEGER NOT NULL,
//     result_matrix_id INTEGER,
//     matrix_a_id INTEGER,
//     matrix_b_id INTEGER,
//     scalar_value REAL,
//     timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(user_id),
//     FOREIGN KEY (operation_id) REFERENCES operations(operation_id),
//     FOREIGN KEY (result_matrix_id) REFERENCES matrices(matrix_id),
//     FOREIGN KEY (matrix_a_id) REFERENCES matrices(matrix_id),
//     FOREIGN KEY (matrix_b_id) REFERENCES matrices(matrix_id)
//   );

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
