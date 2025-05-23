function openInvoiceModal(invoice) {
    const modal = document.getElementById('invoiceModal');
    const invoiceDetailsDiv = document.getElementById('invoiceDetails');

    // Tạo nội dung chi tiết hóa đơn
    let invoiceDetails = `<p><strong>Hóa đơn</strong> #${invoice.id}</p>`;
    invoiceDetails += `<p><strong>Nhân viên:</strong> ${invoice.employeeName}</p>`;
    invoiceDetails += `<p><strong>Khách hàng:</strong> ${invoice.customerName}</p>`;
    invoiceDetails += `<p><strong>Số điện thoại:</strong> ${invoice.phonec}</p>`;
    invoiceDetails += `<p><strong>Ngày xuất:</strong> ${invoice.date}</p>`;
    invoiceDetails += `<p><strong>Tổng hóa đơn:</strong> <span class="currency">${formatCurrency(invoice.totalAmount)} VND</span></p>`;

    // Nếu có giảm giá, thêm thông tin giảm giá
    if (invoice.discountPercentage && invoice.discountAmount) {
        invoiceDetails += `<p><strong>Giảm giá:</strong> ${invoice.discountPercentage}% (<span class="currency">${formatCurrency(invoice.discountAmount)} VND</span>)</p>`;
        invoiceDetails += `<p><strong>Thành tiền sau giảm:</strong> <span class="currency">${formatCurrency(invoice.finalAmount)} VND</span></p>`;
    }

    // Chi tiết sản phẩm dưới dạng bảng
    invoiceDetails += `<h3>Chi Tiết Sản Phẩm:</h3>`;
    invoiceDetails += `<table>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Tổng tiền</th>
                        </tr>`;

    invoice.items.forEach(item => {
        invoiceDetails += `<tr>
                            <td>${item.product.ten_san_pham || item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td class="currency">${formatCurrency(item.product.gia || item.product.price)} VND</td>
                            <td class="currency">${formatCurrency((item.product.gia || item.product.price) * item.quantity)} VND</td>
                        </tr>`;
    });

    invoiceDetails += `</table>`;

    // Thêm footer
    invoiceDetails += `<div class="footer" style="margin-top:10px;">Cảm ơn bạn đã mua hàng tại chúng tôi!</div>`;

    // Hiển thị chi tiết hóa đơn trong modal
    invoiceDetailsDiv.innerHTML = invoiceDetails;

    // Hiển thị modal
    modal.style.display = 'block';
}






function formatCurrency(amount) {
    if (!amount || typeof amount !== 'number' || isNaN(amount)) return '0';
    return amount.toLocaleString('vi-VN');
}



async function generateInvoice() {
    const employeeName = prompt("Nhập tên nhân viên:");
    const customerName = prompt("Nhập tên khách hàng:");
    const phonec = prompt("Nhập số điện thoại:");

    if (!customerName || !phonec || !employeeName) {
        alert("Vui lòng nhập đầy đủ thông tin khách hàng!");
        return;
    }

    const date = new Date().toLocaleDateString(); // Lấy ngày xuất hóa đơn

    // Kiểm tra nếu hóa đơn không có sản phẩm
    if (invoiceItems.length === 0) {
        alert("Không có sản phẩm trong hóa đơn!");
        return;
    }

    const promoCode = document.getElementById("promo-code").value.trim(); // Lấy mã giảm giá nhập vào



    let totalAmount = parseFloat(document.getElementById("total-amount").innerText.replace(/\./g, '').replace(/,/g, '.'));


    let { discountAmount, discountPercentage } = await getDiscountAmount(promoCode, totalAmount);

    const finalAmount = totalAmount - discountAmount;

    // Tạo hóa đơn mới
    const invoice = {
        id: invoices.length + 1,
        employeeName,
        customerName,
        phonec,
        date,
        items: [...invoiceItems], // Sao chép sản phẩm trong hóa đơn
        totalAmount, // Tổng tiền ban đầu
        discountPercentage, // Phần trăm giảm giá
        discountAmount, // Số tiền giảm
        finalAmount // Thành tiền sau giảm
    };

    invoices.push(invoice);
    renderInvoices();


    // Tính điểm tích lũy dựa trên tổng tiền
    const loyaltyPoints = finalAmount * 0.01;

    try {
        // Fetch customers từ API để kiểm tra xem khách hàng đã có chưa
        const response = await fetch('http://localhost:3000/api/customers');
        const customers = await response.json();
        const existingCustomer = customers.find(c => c.so_dien_thoai === phonec);

        if (existingCustomer) {
            // Nếu khách hàng đã có, chỉ cần cập nhật lại điểm tích lũy
            const updatedCustomer = {
                ...existingCustomer,
                so_diem_tich_luy: existingCustomer.so_diem_tich_luy + loyaltyPoints
            };

            // Cập nhật thông tin khách hàng qua API
            await fetch(`http://localhost:3000/api/customers/${existingCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCustomer),
            });

            alert('Cập nhật điểm tích lũy cho khách hàng thành công');
        } else {
            // Nếu chưa có khách hàng, thêm mới khách hàng vào API
            const newCustomer = {
                ho_ten: customerName,
                so_dien_thoai: phonec,
                so_diem_tich_luy: loyaltyPoints // Khởi tạo điểm tích lũy cho khách hàng mới
            };

            const addResponse = await fetch('http://localhost:3000/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomer),
            });

            if (addResponse.ok) {
                alert('Thêm khách hàng mới thành công');
            } else {
                alert('Thêm khách hàng mới thất bại');
            }
        }
        // Cập nhật lại danh sách khách hàng
        fetchCustomers();
    } catch (error) {
        console.error('Lỗi khi xử lý khách hàng:', error);
    }

    invoiceItems = [];
    totalAmount = 0; // Nếu là biến global
    updateInvoiceTable();


    // Hiển thị hóa đơn trong modal
    openInvoiceModal(invoice);
    alert("Hóa đơn đã được xuất!");
}
// Hàm đóng modal
function closeInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    modal.style.display = 'none';
}



// Đóng modal khi nhấn ra ngoài nội dung
window.onclick = function (event) {
    const modal = document.getElementById('invoiceModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


// Hàm mở/đóng modal tài khoản
function toggleAccountMenu() {
    const modal = document.getElementById('accountModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    // Hiển thị modal
    accountModal.style.display = 'block';
}

// Hàm đóng modal tài khoản
function closeAccountMenu() {
    const modal = document.getElementById('accountModal');
    modal.style.display = 'none';
}

// Hàm đăng xuất và chuyển hướng về trang đăng nhập
function logout() {


    alert("Đăng xuất thành công!");

    closeAccountMenu();

    // Chuyển hướng về trang đăng nhập
    window.location.href = 'index.html'; // Đảm bảo 'login.html' là đường dẫn đúng đến trang đăng nhập
}

