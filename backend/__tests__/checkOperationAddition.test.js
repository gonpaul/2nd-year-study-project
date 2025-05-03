import db from '../config/database.js';

// Перед тестом запустите добавление операций

// Тест, который выводит все операции из базы данных

  const rows = db.prepare('SELECT * FROM operations').all();
  console.log('All transactions are in the database:', rows);
