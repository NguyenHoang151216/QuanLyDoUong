// Fetch all customers
async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:3000/api/customers');
        const customers = await response.json();
        const customerTable = document.getElementById('customers-table').getElementsByTagName('tbody')[0];
        customerTable.innerHTML = '';
        customers.forEach(customer => {
            const row = customerTable.insertRow();
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.ho_ten}</td>
                <td>${customer.so_dien_thoai}</td>
                <td>${customer.so_diem_tich_luy}</td>
                <td>
                    <button onclick="showEditProductForm(${customer.id},'${customer.ho_ten}','${customer.so_dien_thoai}','${customer.so_diem_tich_luy}')">Sửa</button>

                    <button onclick="deleteCustomer(${customer.id})">Xóa</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}





async function searchCustomer() {
    const soDienThoai = document.getElementById('search-phone1').value; // Get the phone number input
    try {
        const response = await fetch(`http://localhost:3000/api/customers/search?so_dien_thoai=${soDienThoai}`);
        const customers = await response.json();
        const customerTable = document.getElementById('customers-table').getElementsByTagName('tbody')[0];
        customerTable.innerHTML = ''; // Clear existing rows
        if (customers.length === 0) {
            customerTable.innerHTML = '<tr><td colspan="7">Không tìm thấy khách hàng với số điện thoại này.</td></tr>';
        } else {
            customers.forEach(customer => {
                const row = customerTable.insertRow();
                row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.ho_ten}</td>
                <td>${customer.so_dien_thoai}</td>
                <td>${customer.so_diem_tich_luy}</td>
                <td>
                    <button onclick="showEditCustomerForm(${customer.id},'${customer.ho_ten}','${customer.so_dien_thoai}',${customer.so_diem_tich_luy})">Sửa</button>
                    <button onclick="deleteCustomer(${customer.id})">Xóa</button>
                </td>
                `;
            });
        }
    } catch (error) {
        console.error('Error searching employees:', error);
    }
}

// Show Add Inventory Form
function showAddCustomerForm() {
    document.getElementById('add-customer-form').style.display = 'block';
}

// Hide Add Inventory Form
function hideAddCustomerForm() {
    document.getElementById('add-customer-form').style.display = 'none';
}
// Add new customer
async function addCustomer() {
    const hoTen = document.getElementById('item-name1').value;
    const soDienThoai = document.getElementById('item-phone1').value;
    const soDiemTichLuy = document.getElementById('item-diem').value;

    const customerData = {
        ho_ten: hoTen,
        so_dien_thoai: soDienThoai,
        so_diem_tich_luy: parseInt(soDiemTichLuy),
    };

    try {
        const response = await fetch('http://localhost:3000/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });
        if (response.ok) {
            alert('Thêm khách hàng thành công');
            hideAddCustomerForm()
            fetchCustomers(); // Refresh the list
        } else {
            alert('Thêm khách hàng thất bại');
        }
    } catch (error) {
        console.error('Error adding customer:', error);
    }
}

function showEditProductForm(id, hoTen, soDienThoai, soDiemTichLuy) {
    document.getElementById('edit-customer-form').style.display = 'block';
    document.getElementById('edit-item-name1').value = hoTen;
    document.getElementById('edit-item-phone1').value = soDienThoai;
    document.getElementById('edit-item-diem').value = soDiemTichLuy;




    document.getElementById('edit-customer-form').dataset.id = id;
}

// Hide Edit Inventory Form
function hideEditProductForm() {
    document.getElementById('edit-customer-form').style.display = 'none';
}
// Edit customer
async function editCustomer() {
    const id = document.getElementById('edit-customer-form').dataset.id;
    const hoTen = document.getElementById('edit-item-name1').value;
    const soDienThoai = document.getElementById('edit-item-phone1').value;
    const soDiemTichLuy = document.getElementById('edit-item-diem').value;

    const customerData = {
        ho_ten: hoTen,
        so_dien_thoai: soDienThoai,
        so_diem_tich_luy: parseInt(soDiemTichLuy),
    };

    try {
        const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });
        if (response.ok) {
            alert('Cập nhật khách hàng thành công');
            hideEditProductForm()
            fetchCustomers(); // Refresh the list
        } else {
            alert('Cập nhật khách hàng thất bại');
        }
    } catch (error) {
        console.error('Error editing customer:', error);
    }
}

// Delete customer
async function deleteCustomer(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Xóa khách hàng thành công');
            fetchCustomers(); // Refresh the list
        } else {
            alert('Xóa khách hàng thất bại');
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
    }
}