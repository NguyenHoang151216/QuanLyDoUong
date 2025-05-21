const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));


const employeesRoutes = require('./routes/employees');
const customersRoutes = require('./routes/customers');
const productsRoutes = require('./routes/products');
const invoicesRoutes = require('./routes/invoices');
const orderDetailsRoutes = require('./routes/orderDetails');

const stockRoutes = require('./routes/stock');

const vouchersRoutes = require('./routes/vouchers');

app.use('/api/employees', employeesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/orderDetails', orderDetailsRoutes);
app.use('/api/stock', stockRoutes);

app.use('/api/vouchers', vouchersRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});