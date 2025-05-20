const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Import các route từ các file riêng biệt
const employeesRoutes = require('./routes/employees');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');
const invoicesRoutes = require('./routes/invoices');
const orderDetailsRoutes = require('./routes/orderDetails');
const tablesRoutes = require('./routes/tables');
const stockRoutes = require('./routes/stock');
const authRoutes = require('./routes/auth');
const vouchersRoutes = require('./routes/vouchers');

// Các route API
app.use('/api/employees', employeesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/orderDetails', orderDetailsRoutes);
app.use('/api/tables', tablesRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vouchers', vouchersRoutes);

// Route cho trang chính
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Khởi động server


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});