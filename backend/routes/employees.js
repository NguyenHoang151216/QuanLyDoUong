// routes/employees.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const poolPromise = require('../db');

// Lấy danh sách nhân viên
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM nhan_vien ORDER BY luong DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching employees: ' + err.message);
    }
});

router.get('/search', async (req, res) => {
    const phone = req.query.so_dien_thoai;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('so_dien_thoai', mssql.NVarChar, phone)
            .query('SELECT * FROM nhan_vien WHERE so_dien_thoai = @so_dien_thoai');

        if (result.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy nhân viên với số điện thoại này');
        }

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Lỗi khi tìm kiếm nhân viên: ' + err.message);
    }
});


// Thêm nhân viên
router.post('/', async (req, res) => {
    const { ho_ten, so_dien_thoai, dia_chi, can_cuoc, luong } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ho_ten', mssql.NVarChar, ho_ten)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('dia_chi', mssql.NVarChar, dia_chi)
            .input('can_cuoc', mssql.NVarChar, can_cuoc)
            .input('luong', mssql.Decimal(10, 2), luong)
            .query(`
                INSERT INTO nhan_vien (ho_ten, so_dien_thoai, dia_chi, can_cuoc, luong)
                VALUES (@ho_ten, @so_dien_thoai, @dia_chi, @can_cuoc, @luong)
            `);
        res.status(201).send('Employee added');
    } catch (err) {
        res.status(500).send('Error adding employee: ' + err.message);
    }
});

// Sửa nhân viên
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { ho_ten, so_dien_thoai, dia_chi, can_cuoc, luong } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', mssql.Int, id)
            .input('ho_ten', mssql.NVarChar, ho_ten)
            .input('so_dien_thoai', mssql.NVarChar, so_dien_thoai)
            .input('dia_chi', mssql.NVarChar, dia_chi)
            .input('can_cuoc', mssql.NVarChar, can_cuoc)
            .input('luong', mssql.Decimal(10, 2), luong)
            .query(`
                UPDATE nhan_vien
                SET ho_ten = @ho_ten, so_dien_thoai = @so_dien_thoai, dia_chi = @dia_chi, 
                    can_cuoc = @can_cuoc, luong = @luong
                WHERE id = @id
            `);
        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Employee not found');
        } else {
            res.send('Employee updated');
        }
    } catch (err) {
        res.status(500).send('Error updating employee: ' + err.message);
    }
});

// Xóa nhân viên
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', mssql.Int, id)
            .query('DELETE FROM nhan_vien WHERE id = @id');
        res.send('Employee deleted');
    } catch (err) {
        res.status(500).send('Error deleting employee: ' + err.message);
    }
});

module.exports = router;
