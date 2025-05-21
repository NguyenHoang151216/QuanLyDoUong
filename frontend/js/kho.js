// Fetch all inventory items
async function fetchInventory() {
    try {
        const response = await fetch('http://localhost:3000/api/stock');
        const inventory = await response.json();
        const inventoryTable = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
        inventoryTable.innerHTML = '';
        inventory.forEach(item => {
            const row = inventoryTable.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.ten_hang}</td>
                <td>${item.so_luong}</td>
                <td>${item.don_vi}</td>
                <td>${item.gia_nhap}</td>
                <td>${item.ngay_nhap}</td>
                <td>${item.trang_thai}</td>
                <td>${item.ghi_chu}</td>
                <td>
                    <button onclick="showEditInventoryForm(${item.id}, '${item.ten_hang}', ${item.so_luong}, '${item.don_vi}', ${item.gia_nhap}, '${item.ngay_nhap}', '${item.trang_thai}', '${item.ghi_chu}')">Sửa</button>
                    <button onclick="deleteInventory(${item.id})">Xóa</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
}

async function searchInventory() {
    const trangThai = document.getElementById('search-trangthai').value; // Get the phone number input
    try {
        const response = await fetch(`http://localhost:3000/api/stock/search?trang_thai=${trangThai}`);
        const inventorys = await response.json();
        const inventoryTable = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
        inventoryTable.innerHTML = ''; // Clear existing rows
        if (inventorys.length === 0) {
            inventoryTable.innerHTML = '<tr><td colspan="7">Không tìm thấy khách hàng với số điện thoại này.</td></tr>';
        } else {
            inventorys.forEach(item => {
                const row = inventoryTable.insertRow();
                row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.ten_hang}</td>
                <td>${item.so_luong}</td>
                <td>${item.don_vi}</td>
                <td>${item.gia_nhap}</td>
                <td>${item.ngay_nhap}</td>
                <td>${item.trang_thai}</td>
                <td>${item.ghi_chu}</td>
                <td>
                    <button onclick="showEditInventoryForm(${item.id}, '${item.ten_hang}', ${item.so_luong}, '${item.don_vi}', ${item.gia_nhap}, '${item.ngay_nhap}', '${item.trang_thai}', '${item.ghi_chu}')">Sửa</button>
                    <button onclick="deleteInventory(${item.id})">Xóa</button>
                </td>
                `;
            });
        }
    } catch (error) {
        console.error('Error searching employees:', error);
    }
}


// Show Add Inventory Form
function showAddInventoryForm() {
    document.getElementById('add-inventory-form').style.display = 'block';
}

// Hide Add Inventory Form
function hideAddInventoryForm() {
    document.getElementById('add-inventory-form').style.display = 'none';
}

// Add new inventory item
async function addInventory() {
    const tenHang = document.getElementById('item-name2').value;
    const soLuong = document.getElementById('item-quantity').value;
    const donVi = document.getElementById('item-unit').value;
    const giaNhap = document.getElementById('item-price').value;
    const ngayNhap = document.getElementById('item-date').value;
    const trangThai = document.getElementById('item-status').value;
    const ghiChu = document.getElementById('item-note').value;

    const inventoryData = {
        ten_hang: tenHang,
        so_luong: parseInt(soLuong),
        don_vi: donVi,
        gia_nhap: parseFloat(giaNhap),
        ngay_nhap: ngayNhap,
        trang_thai: trangThai,
        ghi_chu: ghiChu,
    };

    try {
        const response = await fetch('http://localhost:3000/api/stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventoryData),
        });
        if (response.ok) {
            alert('Thêm mặt hàng vào kho thành công');
            hideAddInventoryForm();
            fetchInventory(); // Refresh the list
        } else {
            alert('Thêm mặt hàng vào kho thất bại');
        }
    } catch (error) {
        console.error('Error adding inventory:', error);
    }
}

// Show Edit Inventory Form
function showEditInventoryForm(id, tenHang, soLuong, donVi, giaNhap, ngayNhap, trangThai, ghiChu) {
    document.getElementById('edit-inventory-form').style.display = 'block';

    document.getElementById('edit-item-name2').value = tenHang;
    document.getElementById('edit-item-quantity').value = soLuong;
    document.getElementById('edit-item-unit').value = donVi;
    document.getElementById('edit-item-price').value = giaNhap;
    document.getElementById('edit-item-date').value = ngayNhap;
    document.getElementById('edit-item-status').value = trangThai;
    document.getElementById('edit-item-note').value = ghiChu;

    document.getElementById('edit-inventory-form').dataset.id = id;
}

// Hide Edit Inventory Form
function hideEditInventoryForm() {
    document.getElementById('edit-inventory-form').style.display = 'none';
}

// Save Edited Inventory Item
async function saveEditedInventory() {
    const id = document.getElementById('edit-inventory-form').dataset.id;
    const tenHang = document.getElementById('edit-item-name2').value;
    const soLuong = document.getElementById('edit-item-quantity').value;
    const donVi = document.getElementById('edit-item-unit').value;
    const giaNhap = document.getElementById('edit-item-price').value;
    const ngayNhap = document.getElementById('edit-item-date').value;
    const trangThai = document.getElementById('edit-item-status').value;
    const ghiChu = document.getElementById('edit-item-note').value;

    const inventoryData = {
        ten_hang: tenHang,
        so_luong: parseInt(soLuong),
        don_vi: donVi,
        gia_nhap: parseFloat(giaNhap),
        ngay_nhap: ngayNhap,
        trang_thai: trangThai,
        ghi_chu: ghiChu,
    };

    try {
        const response = await fetch(`http://localhost:3000/api/stock/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inventoryData),
        });
        if (response.ok) {
            alert('Cập nhật mặt hàng kho thành công');
            hideEditInventoryForm();
            fetchInventory(); // Refresh the list
        } else {
            alert('Cập nhật mặt hàng kho thất bại');
        }
    } catch (error) {
        console.error('Error editing inventory:', error);
    }
}

// Delete inventory item
async function deleteInventory(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/stock/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Xóa mặt hàng kho thành công');
            fetchInventory(); // Refresh the list
        } else {
            alert('Xóa mặt hàng kho thất bại');
        }
    } catch (error) {
        console.error('Error deleting inventory:', error);
    }
}

// Run fetch functions on page load
window.onload = () => {
    fetchInventory();
};
