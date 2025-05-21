async function fetchEmployees() {
    try {
        const response = await fetch('http://localhost:3000/api/employees');
        const employees = await response.json();
        const employeeTable = document.getElementById('employees-table').getElementsByTagName('tbody')[0];
        employeeTable.innerHTML = '';
        employees.forEach(employee => {
            const row = employeeTable.insertRow();
            row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.ho_ten}</td>
                <td>${employee.so_dien_thoai}</td>
                <td>${employee.dia_chi}</td>
                <td>${employee.can_cuoc}</td>
                <td>${employee.luong}</td>
                <td>
                    <button onclick="showEditEmployeeForm(${employee.id},'${employee.ho_ten}',${employee.so_dien_thoai},'${employee.dia_chi}',${employee.can_cuoc},${employee.luong})">Sửa</button>
                    <button onclick="deleteEmployee(${employee.id})">Xóa</button>
                </td>
            `;
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}
async function searchEmployees() {
    const soDienThoai = document.getElementById('search-phone').value; // Get the phone number input
    try {
        const response = await fetch(`http://localhost:3000/api/employees/search?so_dien_thoai=${soDienThoai}`);
        const employees = await response.json();
        const employeeTable = document.getElementById('employees-table').getElementsByTagName('tbody')[0];
        employeeTable.innerHTML = ''; // Clear existing rows
        if (employees.length === 0) {
            employeeTable.innerHTML = '<tr><td colspan="7">Không tìm thấy nhân viên với số điện thoại này.</td></tr>';
        } else {
            employees.forEach(employee => {
                const row = employeeTable.insertRow();
                row.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.ho_ten}</td>
                    <td>${employee.so_dien_thoai}</td>
                    <td>${employee.dia_chi}</td>
                    <td>${employee.can_cuoc}</td>
                    <td>${employee.luong}</td>
                    <td>
                        <button onclick="showEditEmployeeForm(${employee.id},'${employee.ho_ten}','${employee.so_dien_thoai}','${employee.dia_chi}','${employee.can_cuoc}',${employee.luong})">Sửa</button>
                        <button onclick="deleteEmployee(${employee.id})">Xóa</button>
                    </td>
                `;
            });
        }
    } catch (error) {
        console.error('Error searching employees:', error);
    }
}



// Show Add Inventory Form
function showAddEmployeeForm() {
    document.getElementById('add-employees-form').style.display = 'block';
}

// Hide Add Inventory Form
function hideAddEmployeeForm() {
    document.getElementById('add-employees-form').style.display = 'none';
}
// Add new employee
async function addEmployee() {
    const hoTen = document.getElementById('item-name').value;
    const soDienThoai = document.getElementById('item-phone').value;
    const diaChi = document.getElementById('item-adress').value;
    const canCuoc = document.getElementById('item-cccd').value;
    const luong = document.getElementById('item-salary').value;

    const employeeData = {
        ho_ten: hoTen,
        so_dien_thoai: soDienThoai,
        dia_chi: diaChi,
        can_cuoc: canCuoc,
        luong: parseFloat(luong),
    };

    try {
        const response = await fetch('http://localhost:3000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        });
        if (response.ok) {
            alert('Thêm nhân viên thành công');
            hideAddEmployeeForm()
            fetchEmployees(); // Refresh the list
        } else {
            const errorText = await response.text();
            alert(`Thêm nhân viên thất bại: ${errorText}`);
        }
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}


// Show Edit Inventory Form
function showEditEmployeeForm(id, hoTen, soDienThoai, diaChi, canCuoc, luong) {
    document.getElementById('edit-employees-form').style.display = 'block';
    document.getElementById('edit-item-name').value = hoTen;
    document.getElementById('edit-item-phone').value = soDienThoai;
    document.getElementById('edit-item-adress').value = diaChi;
    document.getElementById('edit-item-cccd').value = canCuoc;
    document.getElementById('edit-item-salary').value = luong;


    document.getElementById('edit-employees-form').dataset.id = id;
}

// Hide Edit Inventory Form
function hideEditEmployeeForm() {
    document.getElementById('edit-employees-form').style.display = 'none';
}

// Edit employee
async function editEmployee() {
    const id = document.getElementById('edit-employees-form').dataset.id;
    const hoTen = document.getElementById('edit-item-name').value;
    const soDienThoai = document.getElementById('edit-item-phone').value;
    const diaChi = document.getElementById('edit-item-adress').value;
    const canCuoc = document.getElementById('edit-item-cccd').value;
    const luong = document.getElementById('edit-item-salary').value;


    const employeeData = {
        ho_ten: hoTen,
        so_dien_thoai: soDienThoai,
        dia_chi: diaChi,
        can_cuoc: canCuoc,
        luong: parseFloat(luong),
    };

    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
        });
        if (response.ok) {
            alert('Cập nhật nhân viên thành công');
            hideEditEmployeeForm()
            fetchEmployees(); // Refresh the list
        } else {
            const errorText = await response.text();
            alert(`Cập nhật nhân viên thất bại: ${errorText}`);
        }
    } catch (error) {
        console.error('Error editing employee:', error);
    }
}

// Delete employee
async function deleteEmployee(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            alert('Xóa nhân viên thành công');
            fetchEmployees(); // Refresh the list
        } else {
            const errorText = await response.text();
            alert(`Xóa nhân viên thất bại: ${errorText}`);
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
}
