// db.js
const mssql = require('mssql');

const sqlConfig = {
  user: 'sa', // Thay đổi với username của bạn
  password: '123', // Thay đổi với password của bạn
  server: 'localhost', // Địa chỉ của SQL Server
  database: 'QuanNuoc', // Tên cơ sở dữ liệu
  options: {
    encrypt: true, // Dành cho Azure SQL Database
    trustServerCertificate: true // Dành cho local development
  }
};

// Tạo kết nối pool
const poolPromise = mssql.connect(sqlConfig);

module.exports = poolPromise;
