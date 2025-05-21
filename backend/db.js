
const mssql = require('mssql');

const sqlConfig = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'QuanNuoc',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};


const poolPromise = mssql.connect(sqlConfig);

module.exports = poolPromise;
