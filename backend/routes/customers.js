// routes/customers.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise; // Kết nối với database
        const result = await pool.request().query('SELECT * FROM khach_hang ORDER BY so_diem_tich_luy DESC'); // Lấy danh sách khách hàng
        res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
    } catch (err) {
        console.error('Database query error:', err); // Log lỗi nếu có
        res.status(500).send('Error fetching customers: ' + err.message); // Trả về lỗi nếu có
    }
});

router.get('/search', async (req, res) => {
    const { so_dien_thoai } = req.query;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .query('SELECT * FROM khach_hang WHERE so_dien_thoai = @so_dien_thoai');

        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy nhân viên với số điện thoại này');
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi khi tìm kiếm khách hàng: ' + err.message);
    }
});
// Thêm khách hàng
router.post('/', async (req, res) => {
    const { ho_ten, so_dien_thoai, so_diem_tich_luy } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ho_ten', mssql.NVarChar, ho_ten)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('so_diem_tich_luy', mssql.Int, so_diem_tich_luy)
            .query(`
                INSERT INTO khach_hang (ho_ten, so_dien_thoai, so_diem_tich_luy)
                VALUES (@ho_ten, @so_dien_thoai, @so_diem_tich_luy)               
            `);
        res.status(201).send('Customer added');
    } catch (err) {
        res.status(500).send('Error adding customer: ' + err.message);
    }
});

// Sửa thông tin khách hàng
router.put('/:id', async (req, res) => {
    const { ho_ten, so_dien_thoai, so_diem_tich_luy } = req.body;
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()

            .input('ho_ten', mssql.NVarChar, ho_ten)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('so_diem_tich_luy', mssql.Int, so_diem_tich_luy)
            .input('id', mssql.Int, id)
            .query(`
                UPDATE khach_hang
                SET ho_ten = @ho_ten, so_dien_thoai = @so_dien_thoai, so_diem_tich_luy = @so_diem_tich_luy
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Customer not found');
        }
        res.send('Customer updated');
    } catch (err) {
        res.status(500).send('Error updating customer: ' + err.message);
    }
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM khach_hang WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Customer not found');
        }
        res.send('Customer deleted');
    } catch (err) {
        res.status(500).send('Error deleting customer: ' + err.message);
    }
});

module.exports = router;
