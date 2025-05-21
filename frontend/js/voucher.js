// frontend/vouchers.js

// URL API backend
const API_URL = 'http://localhost:3000/api/vouchers';

// DOM Elements
const voucherTableBody = document.querySelector('#vouchers-table tbody');
const voucherCodeInput = document.querySelector('#voucher-code');
const voucherDiscountInput = document.querySelector('#voucher-discount');

// Fetch vouchers and render to table
async function fetchVouchers() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const vouchers = await response.json();
    renderVouchers(vouchers);
  } catch (err) {
    alert('Error fetching vouchers: ' + err.message);
  }
}

// Render vouchers to table
function renderVouchers(vouchers) {
  voucherTableBody.innerHTML = '';
  vouchers.forEach(voucher => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${voucher.VoucherCode}</td>
            <td>${voucher.DiscountPercent}%</td>
            <td>
                <button onclick="editVoucher(${voucher.VoucherID}, '${voucher.VoucherCode}', ${voucher.DiscountPercent})">Sửa</button>
                <button onclick="deleteVoucher(${voucher.VoucherID})">Xóa</button>
            </td>
        `;
    voucherTableBody.appendChild(row);
  });
}

// Add a new voucher
async function addVoucher() {
  const VoucherCode = voucherCodeInput.value.trim();
  const DiscountPercent = parseInt(voucherDiscountInput.value, 10);

  if (!VoucherCode || isNaN(DiscountPercent) || DiscountPercent <= 0) {
    alert('Hãy Nhập Đủ.');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ VoucherCode, DiscountPercent })
    });
    if (response.ok) {
      alert('Thêm Voucher Thành Công!');
      voucherCodeInput.value = '';
      voucherDiscountInput.value = '';
      fetchVouchers();
    } else {
      const error = await response.text();
      alert('Thất Bại: ' + error);
    }
  } catch (err) {
    alert('Thất Bại: ' + err.message);
  }
}

// Edit an existing voucher
function editVoucher(id, currentCode, currentDiscount) {
  const newCode = prompt('Hãy Nhập Mã Voucher:', currentCode);
  const newDiscount = parseInt(prompt('Nhập phần trăm:', currentDiscount), 10);

  if (!newCode || isNaN(newDiscount) || newDiscount <= 0) {
    alert('Hãy Nhập Đủ.');
    return;
  }

  updateVoucher(id, newCode.trim(), newDiscount);
}

async function updateVoucher(id, VoucherCode, DiscountPercent) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ VoucherCode, DiscountPercent })
    });
    if (response.ok) {
      alert('Cập Nhật Thành Công!');
      fetchVouchers();
    } else {
      const error = await response.text();
      alert('Thất bại: ' + error);
    }
  } catch (err) {
    alert('Thất Bại: ' + err.message);
  }
}

// Delete a voucher
async function deleteVoucher(id) {
  if (!confirm('Bạn chắc chắn muốn xóa vouchers?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      alert('Xóa Thành Công!');
      fetchVouchers();
    } else {
      const error = await response.text();
      alert('Thất Bại: ' + error);
    }
  } catch (err) {
    alert('Thất Bại: ' + err.message);
  }
}



// Initial fetch
fetchVouchers();
