// Danh sách tạm thời cho sản phẩm, khách hàng, hóa đơn
let products = [
    { id: 1, name: 'Nước Ép', price: 25000, imageUrl: 'sua.jpg' },
    { id: 2, name: 'Trà ấm', price: 25000, imageUrl: 'tra.jpg' },
    { id: 3, name: 'Trà sữa', price: 35000, imageUrl: 'trasua.jpg' },
    { id: 4, name: 'Coca', price: 10000, imageUrl: 'coca.jpg' },
    { id: 5, name: 'Sinh tố dưa hấu', price: 25000, imageUrl: 'sinhtodua.jpg' },
    { id: 6, name: 'Sinh tố cam', price: 25000, imageUrl: 'sinhtocam.jpg' },
    { id: 3, name: 'Bạc xỉu', price: 35000, imageUrl: 'cafe.jpg' },
    { id: 7, name: 'Kem ốc quế', price: 10000, imageUrl: 'kem.jpg' },
    { id: 8, name: 'Kem trân châu', price: 20000, imageUrl: 'kemtc.jpg' },
    { id: 9, name: 'Milo trân châu', price: 35000, imageUrl: 'milo.jpg' },
    { id: 3, name: 'Trà sữa', price: 35000, imageUrl: 'trasua.jpg' },
    { id: 4, name: 'Coca', price: 10000, imageUrl: 'coca.jpg' },

];

let invoices = []; // Mảng lưu trữ các hóa đơn đã tạo
let invoiceItems = []; // Mảng lưu trữ các sản phẩm đã chọn cho hóa đơn
let totalAmount = 0; // Biến lưu trữ tổng tiền




// Hiển thị phần tương ứng khi nhấn nút

function showSection(sectionId) {
    const sections = document.querySelectorAll('.manage-section');
    sections.forEach(section => section.classList.remove('active'));

    document.getElementById('featured-products').style.display = 'none'; // Ẩn sản phẩm nổi bật nếu cần
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');

    if (sectionId === 'products-section') {
        document.getElementById('featured-products').style.display = 'block'; // Hiển thị sản phẩm nổi bật trong quản lý sản phẩm
    }
}


// Hàm thêm sản phẩm vào hóa đơn
function addToInvoice(productId) {
    const product = products.find(p => p.id === productId);

    // Kiểm tra nếu sản phẩm đã được chọn chưa
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
    const product = products.find(p => p.id === productId);
    const item = invoiceItems.find(item => item.product.id === productId);

    // Kiểm tra nếu số lượng mới hợp lệ
    if (newQuantity < 1) return;

    // Cập nhật số lượng của sản phẩm
    item.quantity = newQuantity;

    // Cập nhật lại tổng tiền
    updateInvoiceTable();
}

// Hàm cập nhật bảng hóa đơn và tính tổng tiền
function updateInvoiceTable() {
    const invoiceTableBody = document.getElementById('invoice-table').getElementsByTagName('tbody')[0];
    invoiceTableBody.innerHTML = ''; // Xóa bảng cũ trước khi cập nhật

    totalAmount = 0; // Đặt lại tổng tiền

    // Lặp qua các sản phẩm trong hóa đơn và thêm chúng vào bảng
    invoiceItems.forEach(item => {
        const row = invoiceTableBody.insertRow();
        const productCell = row.insertCell(0);
        const quantityCell = row.insertCell(1);
        const priceCell = row.insertCell(2);
        const totalCell = row.insertCell(3);
        const actionCell = row.insertCell(4);

        productCell.textContent = item.product.name;
        quantityCell.textContent = item.quantity;
        priceCell.textContent = `${item.product.price} VND`;
        totalCell.textContent = `${item.product.price * item.quantity} VND`;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.addEventListener('input', (event) => updateQuantity(item.product.id, event.target.value));

        actionCell.appendChild(quantityInput);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Xóa';
        removeButton.onclick = () => removeItem(item.product.id);
        actionCell.appendChild(removeButton);

        totalAmount += item.product.price * item.quantity;
    });

    // Cập nhật tổng tiền
    document.getElementById('total-amount').textContent = `${totalAmount} VND`;
}

// Hàm xóa sản phẩm khỏi hóa đơn
function removeItem(productId) {
    const index = invoiceItems.findIndex(item => item.product.id === productId);
    if (index !== -1) {
        invoiceItems.splice(index, 1);
        updateInvoiceTable();
    }
}

// Cập nhật bảng hóa đơn
function renderInvoices() {
    const invoicesTableBody = document.getElementById('invoices-table').querySelector('tbody');
    invoicesTableBody.innerHTML = ''; // Xóa bảng cũ trước khi cập nhật

    invoices.forEach(invoice => {
        const row = invoicesTableBody.insertRow();
        row.innerHTML = `
                    <td>${invoice.id}</td>
                    <td>${invoice.employeeName}</td>
                    <td>${invoice.customerName}</td>
                    <td>${invoice.phonec}</td>
                    <td>${invoice.date}</td>
                    <td>${invoice.totalAmount} VND</td>
                    <td>${invoice.discountAmount} VND</td>
                    <td>${invoice.finalAmount} VND</td>
                    <td>
                        <button onclick="viewInvoiceDetails(${invoice.id})">Xem chi tiết</button>
                        <button onclick="editInvoice(${invoice.id})">Sửa</button>
                        <button onclick="deleteInvoice(${invoice.id})">Xóa</button>
                    </td>
                `;
    });
}





// Xem chi tiết hóa đơn
function viewInvoiceDetails(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
        let invoiceDetails = `Hóa đơn #${invoice.id}\n Nhân Viên: ${invoice.employeeName}\nKhách hàng: ${invoice.customerName}\nSố điện thoại: ${invoice.phonec}\nNgày xuất: ${invoice.date}\nTổng tiền: ${invoice.totalAmount} VND\nGiảm giá: ${invoice.discountAmount} VND\nTổng tiền sau giảm giá: ${invoice.finalAmount} VND\nChi Tiết:\n`;
        invoice.items.forEach(item => {
            invoiceDetails += `${item.product.name} x${item.quantity}: ${item.product.price * item.quantity} VND\n`;
        });



        alert(invoiceDetails);
    }
}

// Sửa hóa đơn
function editInvoice(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice) {
        const newCustomerName = prompt("Sửa tên khách hàng:", invoice.customerName);
        const newPhonec = prompt("Sửa số điện thoại: ", invoice.phonec);
        if (newCustomerName && newPhonec) {
            invoice.customerName = newCustomerName;
            invoice.phonec = newPhonec;
        }



        // Hiển thị lại bảng hóa đơn sau khi sửa
        renderInvoices();
    }
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


// Hàm thêm sản phẩm mới vào danh sách sản phẩm
function addProduct() {
    // Lấy các giá trị từ form
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const fileInput = document.getElementById('product-image');
    const file = fileInput.files[0]; // Lấy ảnh người dùng đã chọn

    if (name && price && file) {
        // Sử dụng FileReader để đọc file ảnh
        const reader = new FileReader();
        reader.onload = function (e) {
            const newProduct = {
                id: products.length + 1,
                name,
                price: parseInt(price, 10),
                imageUrl: e.target.result // Lưu URL ảnh từ FileReader
            };
            products.push(newProduct);
            renderProductsForProductManagement(); // Cập nhật lại danh sách sản phẩm trong quản lý

            // Cập nhật lại danh sách sản phẩm nổi bật
            renderFeaturedProducts();
        };
        reader.readAsDataURL(file); // Đọc file ảnh dưới dạng URL
    } else {
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);

    // Mở prompt để sửa tên và giá sản phẩm
    const name = prompt("Sửa tên sản phẩm:", product.name);
    const price = prompt("Sửa giá sản phẩm:", product.price);

    // Tạo một phần tử input cho phép chọn lại hình ảnh
    const newImage = prompt("Chọn ảnh mới cho sản phẩm (dán URL hoặc bỏ qua nếu không thay đổi):", product.imageUrl);

    if (name && price) {
        // Cập nhật thông tin sản phẩm
        product.name = name;
        product.price = parseInt(price, 10);
        // Nếu có ảnh mới, cập nhật ảnh cho sản phẩm
        if (newImage) {
            product.imageUrl = newImage; // Chỉ cập nhật nếu có URL mới
        }
        // Cập nhật lại danh sách sản phẩm trong quản lý
        renderProductsForProductManagement();
        renderFeaturedProducts(); // Cập nhật lại sản phẩm nổi bật
    } else {
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
}


/// Hàm xóa sản phẩm
function deleteProduct(productId) {
    // Xóa sản phẩm khỏi mảng
    products = products.filter(p => p.id !== productId);

    // Cập nhật lại giao diện quản lý sản phẩm
    renderProductsForProductManagement();

    // Cập nhật lại danh sách sản phẩm nổi bật nếu cần
    renderFeaturedProducts();
}



function renderFeaturedProducts() {
    const productList = document.getElementById('featured-products').querySelector('.product-list');
    productList.innerHTML = ''; // Xóa danh sách sản phẩm cũ trước khi thêm mới

    // Lặp qua tất cả sản phẩm và tạo thẻ cho từng sản phẩm
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" style="max-width: 150px; height: 200px;">
            <h3>${product.name}</h3>
            <p class="price">${formatCurrency(product.price)} VND</p>
            <button class="add-to-cart" onclick="addToInvoice(${product.id})">Chọn Mua</button>
        `;
        productList.appendChild(productDiv);
    });


}

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            addToInvoice(index + 1); // Sử dụng chỉ số để xác định sản phẩm trong mảng products
        });
    });
});





// Hiển thị các sản phẩm trong phần quản lý sản phẩm
function renderProductsForProductManagement() {
    const productsTableBody = document.getElementById('products-table').querySelector('tbody');
    productsTableBody.innerHTML = ''; // Xóa bảng cũ trước khi cập nhật

    // Lặp qua tất cả sản phẩm và tạo thẻ cho từng sản phẩm
    products.forEach(product => {
        const row = productsTableBody.insertRow();
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${formatCurrency(product.price)} VND</td>
            <td>
                <button onclick="editProduct(${product.id})">Sửa</button>
                <button onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        `;
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Gọi hàm để hiển thị sản phẩm nổi bật và quản lý sản phẩm ngay khi trang được tải
    renderProductsForProductManagement();
});

window.onload = () => {
    fetchEmployees();
    fetchInventory();
    fetchCustomers();
    searchEmployees();

};
document.addEventListener('DOMContentLoaded', () => {
    renderFeaturedProducts(); // Hiển thị sản phẩm nổi bật ngay khi tải trang
    renderProductsForProductManagement(); // Hiển thị sản phẩm quản lý ngay khi tải trang
    fetchEmployees();  // Hiển thị nhân viên
    fetchCustomers();
    searchEmployees();  // Hiển thị khách hàng
});
