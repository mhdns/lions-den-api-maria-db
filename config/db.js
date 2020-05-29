const mariadb = require('mariadb');

const genPool = (db = null) => {
  let pool = mariadb.createPool({
    host: 'mariadb-cluster-ip-service',
    user: 'root',
    password: 'Password123!',
    connectionLimit: 5
  });

  if (db) {
    pool = mariadb.createPool({
      host: 'mariadb-cluster-ip-service',
      user: 'root',
      database: `${db}`,
      password: 'Password123!',
      connectionLimit: 100
    });
  }

  return pool;
};


const connectDB = async (db = null) => {
  const pool = genPool(db);
  const conn = await pool.getConnection();
  return conn;
};

const createDb = async (dbName) => {
  const conn = connectDB();

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);

  await conn.end();
};

const createTable = async (db, tableName, fields) => {
  const conn = connectDB(db);

  let colType = '';
  Object.keys(fields).forEach((key, index) => {
    colType += `${key} ${index},\n`;
  });
  colType = colType.substr(0, colType.length - 2);

  await conn.query(`CREATE TABLE IF NOT EXISTS ${tableName} (${colType});`);

  await conn.end();
};


module.exports = connectDB;
