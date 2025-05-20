// routes/orderDetails.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách chi tiết đơn hàng
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM chi_tiet_don_hang');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching order details: ' + err.message);
    }
});

// Thêm chi tiết đơn hàng
router.post('/', async (req, res) => {
    const { hoa_don_id, san_pham_id, so_luong, gia, tong_tien } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('hoa_don_id', mssql.Int, hoa_don_id)
            .input('san_pham_id', mssql.Int, san_pham_id)
            .input('so_luong', mssql.Int, so_luong)
            .input('gia', mssql.Decimal(10, 2), gia)
            .input('tong_tien', mssql.Decimal(10, 2), tong_tien)
            .query(`
                INSERT INTO chi_tiet_don_hang (hoa_don_id, san_pham_id, so_luong, gia, tong_tien)
                VALUES (@hoa_don_id, @san_pham_id, @so_luong, @gia, @tong_tien)
            `);
        res.status(201).send('Order detail added');
    } catch (err) {
        res.status(500).send('Error adding order detail: ' + err.message);
    }
});

module.exports = router;
