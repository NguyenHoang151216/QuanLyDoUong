// routes/products.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM san_pham');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching products: ' + err.message);
    }
});

// Thêm sản phẩm
router.post('/', async (req, res) => {
    const { ten_san_pham, gia, hinh_anh } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ten_san_pham', mssql.NVarChar, ten_san_pham)
            .input('gia', mssql.Decimal(10, 2), gia)
            .input('hinh_anh', mssql.VarChar, hinh_anh)
            .query(`
                INSERT INTO san_pham (ten_san_pham, gia, hinh_anh)
                VALUES (@ten_san_pham, @gia, @hinh_anh)
            `);
        res.status(201).send('Product added');
    } catch (err) {
        res.status(500).send('Error adding product: ' + err.message);
    }
});

// Sửa thông tin sản phẩm
router.put('/:id', async (req, res) => {
    const { ten_san_pham, gia, hinh_anh } = req.body;
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ten_san_pham', mssql.VarChar, ten_san_pham)
            .input('gia', mssql.Decimal(10, 2), gia)
            .input('hinh_anh', mssql.VarChar, hinh_anh)
            .input('id', mssql.Int, id)
            .query(`
                UPDATE san_pham
                SET ten_san_pham = @ten_san_pham, gia = @gia, hinh_anh = @hinh_anh
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Product not found');
        }
        res.send('Product updated');
    } catch (err) {
        res.status(500).send('Error updating product: ' + err.message);
    }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM san_pham WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Product not found');
        }
        res.send('Product deleted');
    } catch (err) {
        res.status(500).send('Error deleting product: ' + err.message);
    }
});

module.exports = router;
