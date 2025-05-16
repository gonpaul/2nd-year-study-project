/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // Only use this in dev/test environments
  // await knex('operations').del()

  await knex('operations').insert([
    {id: 1, name: 'Transpose', description: 'Transpose the matrix', is_binary: false},
    {id: 2, name: 'Multiply by scalar', description: 'Multiply the matrix by scalar', is_binary: false},
    {id: 3, name: 'Calculate Determinant', description: 'Calculate the determinant', is_binary: false},
    {id: 4, name: 'Raise to Power', description: 'Raise the matrix to a power', is_binary: false},
    {id: 5, name: 'Calculate Rank', description: 'Find the rank of the matrix', is_binary: false},
    {id: 6, name: 'Calculate Inverse', description: 'Invert the matrix', is_binary: false},
    {id: 7, name: 'Add', description: 'Add two matrices', is_binary: true},
    {id: 8, name: 'Subtract', description: 'Subtract two matrices', is_binary: true},
    {id: 9, name: 'Multiply', description: 'Multiply two matrices', is_binary: true},
  ]);
};


