

function showSection(sectionId) {
    const sections = document.querySelectorAll('.manage-section');
    sections.forEach(section => section.classList.remove('active'));

    document.getElementById('featured-products').style.display = 'none';
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');

    if (sectionId === 'products-section') {
        document.getElementById('featured-products').style.display = 'block';
    }
}

let allProducts = [];   // lưu sản phẩm lấy từ API
let invoiceItems = [];  // Danh sách sản phẩm đã chọn trong hóa đơn
let totalAmount = 0;    // Tổng tiền chưa giảm
let discountAmount = 0; // Tiền giảm giá
let finalAmount = 0;    // Tiền sau khi giảm
let invoices = []; // Danh sách các hóa đơn đã tạo



// Thêm sản phẩm vào hóa đơn (ví dụ gọi khi click nút Chọn Mua)
function addToInvoice(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = invoiceItems.find(item => item.product.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        invoiceItems.push({ product, quantity: 1 });
    }
    updateInvoiceTable();
}

// Cập nhật số lượng sản phẩm trong hóa đơn
function updateQuantity(productId, newQuantity) {
    const item = invoiceItems.find(item => item.product.id === productId);
    newQuantity = parseInt(newQuantity);
    if (!item || isNaN(newQuantity) || newQuantity < 1) return;

    item.quantity = newQuantity;
    updateInvoiceTable();
}

// Xóa sản phẩm khỏi hóa đơn
function removeItem(productId) {
    const index = invoiceItems.findIndex(item => item.product.id === productId);
    if (index !== -1) {
        invoiceItems.splice(index, 1);
        updateInvoiceTable();
    }
}

// Cập nhật bảng hóa đơn và tính tiền
function updateInvoiceTable() {
    const invoiceTableBody = document.getElementById('invoice-table').querySelector('tbody');
    invoiceTableBody.innerHTML = '';

    totalAmount = 0;
    discountAmount = 0;

    invoiceItems.forEach(item => {
        const row = invoiceTableBody.insertRow();

        const productCell = row.insertCell(0);
        const quantityCell = row.insertCell(1);
        const priceCell = row.insertCell(2);
        const totalCell = row.insertCell(3);
        const actionCell = row.insertCell(4);

        productCell.textContent = item.product.ten_san_pham;

        // Số lượng với input để chỉnh sửa
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        quantityInput.value = item.quantity;
        quantityInput.style.width = '50px';
        quantityInput.addEventListener('change', (e) => updateQuantity(item.product.id, e.target.value));
        quantityCell.appendChild(quantityInput);

        priceCell.textContent = `${formatCurrency(item.product.gia)} VND`;
        totalCell.textContent = `${formatCurrency(item.product.gia * item.quantity)} VND`;

        // Nút xóa
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Xóa';
        removeBtn.addEventListener('click', () => removeItem(item.product.id));
        actionCell.appendChild(removeBtn);

        totalAmount += item.product.gia * item.quantity;
    });

    // Cập nhật tổng tiền
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);
    document.getElementById('discount-amount').textContent = formatCurrency(discountAmount);
    document.getElementById('final-amount').textContent = formatCurrency(totalAmount - discountAmount);
}
let discountPercentage = 0;
// Hàm lấy discount amount (phục vụ cả generate và applyDiscountCode)
async function getDiscountAmount(promoCode, totalAmount) {
    if (!promoCode) return { discountAmount: 0, discountPercentage: 0 };

    try {
        const response = await fetch(`http://localhost:3000/api/vouchers/search?VoucherCode=${promoCode}`);
        if (!response.ok) throw new Error('Lỗi phản hồi từ server');
        const vouchers = await response.json();
        if (vouchers.length === 0) return { discountAmount: 0, discountPercentage: 0 };

        const voucher = vouchers[0];
        const discountAmount = (totalAmount * voucher.DiscountPercent) / 100;
        return { discountAmount, discountPercentage: voucher.DiscountPercent };
    } catch (error) {
        console.error('Lỗi khi lấy mã giảm giá:', error);
        return { discountAmount: 0, discountPercentage: 0 };
    }
}


async function applyDiscountCode() {
    const discountCode = document.getElementById("promo-code").value.trim();
    const totalAmount = parseFloat(document.getElementById("total-amount").innerText);

    if (!discountCode) {
        alert("Vui lòng nhập mã giảm giá!");
        return;
    }

    const { discountAmount, discountPercentage } = await getDiscountAmount(discountCode, totalAmount);

    if (discountAmount === 0) {
        alert("Mã giảm giá không hợp lệ!");
        document.getElementById("discount-amount").innerText = "0";
        document.getElementById("final-amount").innerText = totalAmount.toFixed(2);
    } else {
        document.getElementById("discount-amount").innerText = discountAmount.toFixed(2);
        document.getElementById("final-amount").innerText = (totalAmount - discountAmount).toFixed(2);
        alert(`Áp dụng mã giảm giá thành công! Giảm ${discountPercentage}%.`);
    }
}
function renderInvoices() {
    const tableBody = document.querySelector('#invoices-table tbody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ

    invoices.forEach(invoice => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.employeeName}</td>
            <td>${invoice.customerName}</td>
            <td>${invoice.phonec}</td>
            <td>${invoice.date}</td>
            <td class="currency">${formatCurrency(invoice.totalAmount)} VND</td>
            <td>${invoice.discountPercentage ? invoice.discountPercentage + '%' : '0%'}</td>
            <td class="currency">${formatCurrency(invoice.finalAmount)} VND</td>
            <td><button onclick='openInvoiceModal(${JSON.stringify(invoice).replace(/'/g, "\\'")})'>Chi tiết</button></td>
        `;

        tableBody.appendChild(row);
    });
}




// Xóa hóa đơn
function deleteInvoice(invoiceId) {
    const index = invoices.findIndex(invoice => invoice.id === invoiceId);
    if (index !== -1) {
        invoices.splice(index, 1);
    }

    // Hiển thị lại bảng hóa đơn sau khi xóa
    renderInvoices();
}





function formatCurrency(amount) {
    if (!amount || typeof amount !== 'number' || isNaN(amount)) return '0';
    return amount.toLocaleString('vi-VN');
}

// Lấy danh sách sản phẩm từ API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
    } catch (err) {
        console.error('Không thể tải danh sách sản phẩm:', err);
    }
}

// Hiển thị danh sách sản phẩm cho trang chính
async function renderFeaturedProducts() {
    const productList = document.getElementById('featured-products').querySelector('.product-list');
    productList.innerHTML = '';

    allProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <img src="${product.hinh_anh}" alt="${product.ten_san_pham}" style="max-width: 150px; height: 200px;">
            <h3>${product.ten_san_pham}</h3>
            <p class="price">${formatCurrency(product.gia)} VND</p>
            <button class="add-to-cart" onclick="addToInvoice(${product.id})">Chọn Mua</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Hiển thị danh sách sản phẩm cho quản lý sản phẩm
async function renderProductsForProductManagement() {
    const productsTableBody = document.getElementById('products-table').querySelector('tbody');
    productsTableBody.innerHTML = '';

    allProducts.forEach(product => {
        const row = productsTableBody.insertRow();
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.ten_san_pham}</td>
            <td>${formatCurrency(product.gia)} VND</td>
            <td>
                <button onclick="showEditProductForm(${product.id})">Sửa</button>
                <button onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        `;
    });
}





// Xóa sản phẩm (gọi API DELETE)
async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            alert('Xóa thành công!');
            await fetchProducts();
            renderFeaturedProducts();
            renderProductsForProductManagement();
        } else {
            alert('Xóa thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi xóa sản phẩm:', err);
    }
}

// Hiển thị form sửa sản phẩm với dữ liệu đã có (Bạn cần tự thiết kế form và gọi hàm này)
function showEditProductForm(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    // Ví dụ: điền dữ liệu vào form sửa
    // Giả sử bạn có form với input id: 'edit-product-name', 'edit-product-price', 'edit-product-image'
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.ten_san_pham;
    document.getElementById('edit-product-price').value = product.gia;
    document.getElementById('edit-product-image').value = product.hinh_anh;

    // Hiển thị form sửa (bạn tự xử lý hiển thị)
    document.getElementById('edit-product-form').style.display = 'block';
}

// Gửi dữ liệu sửa sản phẩm lên API PUT
async function submitEditProductForm(event) {
    event.preventDefault();

    const id = document.getElementById('edit-product-id').value;
    const ten_san_pham = document.getElementById('edit-product-name').value;
    const gia = parseInt(document.getElementById('edit-product-price').value);
    const hinh_anh = document.getElementById('edit-product-image').value;

    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ten_san_pham, gia, hinh_anh })
        });

        if (response.ok) {
            alert('Cập nhật sản phẩm thành công!');
            document.getElementById('edit-product-form').style.display = 'none';
            await fetchProducts();
            renderFeaturedProducts();
            renderProductsForProductManagement();
        } else {
            alert('Cập nhật sản phẩm thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi cập nhật sản phẩm:', err);
    }
}

// Thêm sản phẩm mới (form và gọi API POST)
async function addNewProduct(event) {
    event.preventDefault();

    const ten_san_pham = document.getElementById('add-product-name').value;
    const gia = parseInt(document.getElementById('add-product-price').value);
    const hinh_anh = document.getElementById('add-product-image').value;

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ten_san_pham, gia, hinh_anh })
        });

        if (response.ok) {
            alert('Thêm sản phẩm thành công!');
            document.getElementById('add-product-form').reset();
            await fetchProducts();
            renderFeaturedProducts();
            renderProductsForProductManagement();
        } else {
            alert('Thêm sản phẩm thất bại!');
        }
    } catch (err) {
        console.error('Lỗi khi thêm sản phẩm:', err);
    }
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts();
    renderFeaturedProducts();
    renderProductsForProductManagement();

    // Nếu bạn có form thêm/sửa, đăng ký event listener ở đây
    document.getElementById('edit-product-form')?.addEventListener('submit', submitEditProductForm);
    document.getElementById('add-product-form')?.addEventListener('submit', addNewProduct);
});





window.onload = () => {
    fetchEmployees();
    fetchInventory();
    fetchCustomers();
    searchEmployees();

};
document.addEventListener('DOMContentLoaded', () => {

    fetchEmployees();  // Hiển thị nhân viên
    fetchCustomers();
    searchEmployees();  // Hiển thị khách hàng
});
