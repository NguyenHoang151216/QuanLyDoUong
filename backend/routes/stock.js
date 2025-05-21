const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách kho
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM quan_ly_kho');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching stock: ' + err.message);
    }
});
router.get('/search', async (req, res) => {
    const { trang_thai } = req.query;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('trang_thai', mssql.NVarChar, trang_thai)
            .query('SELECT * FROM quan_ly_kho WHERE trang_thai = @trang_thai');

        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy mặt hàng với số điện thoại này');
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi khi tìm kiếm mặt hàng: ' + err.message);
    }
});


// Thêm mặt hàng vào kho
router.post('/', async (req, res) => {
    const { ten_hang, so_luong, don_vi, gia_nhap, ngay_nhap, trang_thai, ghi_chu } = req.body;

    // Kiểm tra ngày nhập có hợp lệ không
    if (isNaN(Date.parse(ngay_nhap))) {
        return res.status(400).send('Invalid date format');
    }

    // Kiểm tra giá trị của trang_thai
    const validTrangThai = ['Còn Hàng', 'Sắp Hết', 'Hết Hàng'];
    if (!validTrangThai.includes(trang_thai)) {
        return res.status(400).send('Invalid trang_thai value');
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ten_hang', mssql.NVarChar, ten_hang)
            .input('so_luong', mssql.Int, so_luong)
            .input('don_vi', mssql.NVarChar, don_vi)
            .input('gia_nhap', mssql.Decimal(10, 2), parseFloat(gia_nhap))
            .input('ngay_nhap', mssql.Date, ngay_nhap)
            .input('trang_thai', mssql.NVarChar, trang_thai)
            .input('ghi_chu', mssql.NVarChar, ghi_chu)
            .query(`
                INSERT INTO quan_ly_kho (ten_hang, so_luong, don_vi, gia_nhap, ngay_nhap, trang_thai, ghi_chu)
                VALUES (@ten_hang, @so_luong, @don_vi, @gia_nhap, @ngay_nhap, @trang_thai, @ghi_chu)
            `);
        res.status(201).send('Stock added');
    } catch (err) {
        res.status(500).send('Error adding stock: ' + err.message);
    }
});

// Sửa thông tin mặt hàng trong kho
router.put('/:id', async (req, res) => {
    const { ten_hang, so_luong, don_vi, gia_nhap, ngay_nhap, trang_thai, ghi_chu } = req.body;
    const { id } = req.params;


    if (isNaN(Date.parse(ngay_nhap))) {
        return res.status(400).send('Invalid date format');
    }

    // Kiểm tra giá trị của trang_thai
    const validTrangThai = ['Còn Hàng', 'Sắp Hết', 'Hết Hàng'];
    if (!validTrangThai.includes(trang_thai)) {
        return res.status(400).send('Invalid trang_thai value');
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ten_hang', mssql.NVarChar, ten_hang)
            .input('so_luong', mssql.Int, so_luong)
            .input('don_vi', mssql.NVarChar, don_vi)
            .input('gia_nhap', mssql.Decimal(10, 2), parseFloat(gia_nhap))
            .input('ngay_nhap', mssql.Date, ngay_nhap)
            .input('trang_thai', mssql.NVarChar, trang_thai)
            .input('ghi_chu', mssql.NVarChar, ghi_chu)
            .input('id', mssql.Int, id)
            .query(`
                UPDATE quan_ly_kho
                SET ten_hang = @ten_hang, so_luong = @so_luong, don_vi = @don_vi, gia_nhap = @gia_nhap, 
                    ngay_nhap = @ngay_nhap, trang_thai = @trang_thai, ghi_chu = @ghi_chu
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Stock not found');
        }
        res.send('Stock updated');
    } catch (err) {
        res.status(500).send('Error updating stock: ' + err.message);
    }
});

// Xóa mặt hàng trong kho
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM quan_ly_kho WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Stock not found');
        }
        res.send('Stock deleted');
    } catch (err) {
        res.status(500).send('Error deleting stock: ' + err.message);
    }
});

module.exports = router;
