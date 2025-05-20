// routes/vouchers.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách voucher
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Vouchers');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching vouchers: ' + err.message);
    }
});
router.get('/search', async (req, res) => {
    const { VoucherCode } = req.query;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('VoucherCode', mssql.NVarChar, VoucherCode)
            .query('SELECT * FROM Vouchers WHERE VoucherCode = @VoucherCode');

        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy nhân viên với số điện thoại này');
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi khi tìm kiếm nhân viên: ' + err.message);
    }
});

// Thêm voucher
router.post('/', async (req, res) => {
    const { VoucherCode, DiscountPercent } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('VoucherCode', mssql.NVarChar, VoucherCode)
            .input('DiscountPercent', mssql.Int, DiscountPercent)
            .query(`
                INSERT INTO Vouchers (VoucherCode, DiscountPercent)
                VALUES (@VoucherCode, @DiscountPercent)
            `);
        res.status(201).send('Voucher added');
    } catch (err) {
        res.status(500).send('Error adding voucher: ' + err.message);
    }
});

// Sửa thông tin voucher
router.put('/:id', async (req, res) => {
    const { VoucherCode, DiscountPercent } = req.body;
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('VoucherCode', mssql.NVarChar, VoucherCode)
            .input('DiscountPercent', mssql.Int, DiscountPercent)
            .input('id', mssql.Int, id)
            .query(`
                UPDATE Vouchers
                SET VoucherCode = @VoucherCode, DiscountPercent = @DiscountPercent
                WHERE VoucherID = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Voucher not found');
        }
        res.send('Voucher updated');
    } catch (err) {
        res.status(500).send('Error updating voucher: ' + err.message);
    }
});

// Xóa voucher
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM Vouchers WHERE VoucherID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Voucher not found');
        }
        res.send('Voucher deleted');
    } catch (err) {
        res.status(500).send('Error deleting voucher: ' + err.message);
    }
});

module.exports = router;
