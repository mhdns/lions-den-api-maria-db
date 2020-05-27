const mariadb = require('mariadb');

const connectDB = async () => {
  const conn = await mariadb.createConnection({
    host: 'mariadb-cluster-ip-service',
    user: 'root',
    password: 'Password123!',

  });
  console.log(conn);
  console.log('Connected to DB...');
  const rows = await conn.query('SELECT 1 as val');
  console.log(rows); // [ {val: 1}, meta: ... ]

  const row = await conn.query('SELECT 2 as val');
  console.log(row);

  await conn.end();
  console.log('connection closed');
};

module.exports = connectDB;
