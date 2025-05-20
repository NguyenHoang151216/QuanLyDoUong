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

async function applyDiscountCode() {
  const discountCode = document.getElementById("promo-code").value.trim(); // Lấy mã giảm giá từ input
  const totalAmount = parseFloat(document.getElementById("total-amount").innerText); // Lấy tổng số tiền ban đầu

  if (!discountCode) {
    alert("Vui lòng nhập mã giảm giá!");
    return;
  }

  try {
    // Gửi yêu cầu kiểm tra mã giảm giá qua API
    const response = await fetch(`http://localhost:3000/api/vouchers/search?VoucherCode=${discountCode}`);

    if (response.ok) {
      const vouchers = await response.json(); // Lấy dữ liệu voucher từ API
      if (vouchers.length === 0) {
        alert("Mã giảm giá không hợp lệ!");
        document.getElementById("discount-amount").innerText = "0";
        document.getElementById("final-amount").innerText = totalAmount.toFixed(2);
        return;
      }

      const voucher = vouchers[0]; // Chỉ lấy voucher đầu tiên từ mảng trả về
      const discountAmount = (totalAmount * voucher.DiscountPercent) / 100; // Tính số tiền giảm giá

      // Cập nhật số tiền giảm và số tiền cuối cùng
      document.getElementById("discount-amount").innerText = discountAmount.toFixed(2);
      document.getElementById("final-amount").innerText = (totalAmount - discountAmount).toFixed(2);

      alert(`Áp dụng mã giảm giá thành công! Giảm ${voucher.DiscountPercent}%.`);
    } else {
      // Nếu mã giảm giá không hợp lệ hoặc không tồn tại
      alert("Mã giảm giá không hợp lệ!");
      document.getElementById("discount-amount").innerText = "0";
      document.getElementById("final-amount").innerText = totalAmount.toFixed(2);
    }
  } catch (err) {
    console.error("Lỗi khi áp dụng mã giảm giá:", err);
    alert("Đã xảy ra lỗi khi kiểm tra mã giảm giá.");
  }
}



// Initial fetch
fetchVouchers();
