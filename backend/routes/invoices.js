// routes/invoices.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách hóa đơn
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM hoa_don');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching invoices: ' + err.message);
    }
});

// Thêm hóa đơn
router.post('/', async (req, res) => {
    const { ten_nhan_vien, ten_khach_hang, so_dien_thoai, ngay_lap, tong_tien, giam_gia, tong_sau_giam } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ten_nhan_vien', mssql.NVarChar, ten_nhan_vien)
            .input('ten_khach_hang', mssql.NVarChar, ten_khach_hang)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('ngay_lap', mssql.Date, ngay_lap)
            .input('tong_tien', mssql.Decimal(10, 2), tong_tien)
            .input('giam_gia', mssql.Decimal(10, 2), giam_gia)
            .input('tong_sau_giam', mssql.Decimal(10, 2), tong_sau_giam)
            .query(`
                INSERT INTO hoa_don (ten_nhan_vien, ten_khach_hang, so_dien_thoai, ngay_lap, tong_tien, giam_gia, tong_sau_giam)
                VALUES (@ten_nhan_vien, @ten_khach_hang, @so_dien_thoai, @ngay_lap, @tong_tien, @giam_gia, @tong_sau_giam)
            `);
        res.status(201).send('Invoice added');
    } catch (err) {
        res.status(500).send('Error adding invoice: ' + err.message);
    }
});

// Sửa thông tin hóa đơn
router.put('/:id', async (req, res) => {
    const { ten_nhan_vien, ten_khach_hang, so_dien_thoai, ngay_lap, tong_tien, giam_gia, tong_sau_giam } = req.body;
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ten_nhan_vien', mssql.NVarChar, ten_nhan_vien)
            .input('ten_khach_hang', mssql.NVarChar, ten_khach_hang)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('ngay_lap', mssql.Date, ngay_lap)
            .input('tong_tien', mssql.Decimal(10, 2), tong_tien)
            .input('giam_gia', mssql.Decimal(10, 2), giam_gia)
            .input('tong_sau_giam', mssql.Decimal(10, 2), tong_sau_giam)
            .input('id', mssql.Int, id)
            .query(`
                UPDATE hoa_don
                SET ten_nhan_vien = @ten_nhan_vien, ten_khach_hang = @ten_khach_hang, so_dien_thoai = @so_dien_thoai,
                    ngay_lap = @ngay_lap, tong_tien = @tong_tien, giam_gia = @giam_gia, tong_sau_giam = @tong_sau_giam
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Invoice not found');
        }
        res.send('Invoice updated');
    } catch (err) {
        res.status(500).send('Error updating invoice: ' + err.message);
    }
});

// Xóa hóa đơn
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM hoa_don WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Invoice not found');
        }
        res.send('Invoice deleted');
    } catch (err) {
        res.status(500).send('Error deleting invoice: ' + err.message);
    }
});

module.exports = router;
