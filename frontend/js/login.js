document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');
  const forgotPasswordError = document.getElementById('forgot-password-error');

  const loginContainer = document.querySelector('.login-container');
  const registerContainer = document.querySelector('.register-container');
  const forgotPasswordContainer = document.querySelector('.forgot-password-container');

  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLoginLink = document.getElementById('switch-to-login-link');
  const switchToLoginFromForgotLink = document.getElementById('switch-to-login-from-forgot-link');

  const forgotPasswordLink = document.getElementById('forgot-password-link');

  // Chuyển sang trang đăng ký
  switchToRegister.addEventListener('click', (event) => {
    event.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  });

  // Quay lại trang đăng nhập
  switchToLoginLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
  });

  // Quay lại trang đăng nhập từ quên mật khẩu
  switchToLoginFromForgotLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginContainer.style.display = 'block';
    forgotPasswordContainer.style.display = 'none';
  });

  // Hiển thị form quên mật khẩu
  forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault();
    loginContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'block';
  });

  // Xử lý đăng nhập
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Kiểm tra tài khoản đăng nhập từ localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.username === username && storedUser.password === password) {
      window.location.href = 'main.html'; // Chuyển tới trang chính
    } else {
      loginError.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng!';
    }
  });

  // Xử lý đăng ký
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const newSDT = document.getElementById('new-sdt').value;
    const newEmail = document.getElementById('new-email').value;

    if (newPassword === confirmPassword) {
      // Lưu tài khoản mới vào localStorage
      const newUser = { username: newUsername, password: newPassword, sdt: newSDT, email: newEmail };
      localStorage.setItem('user', JSON.stringify(newUser));

      alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
      registerContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    } else {
      registerError.textContent = 'Mật khẩu xác nhận không khớp!';
    }
  });

  // Xử lý quên mật khẩu
  forgotPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailOrUsername = document.getElementById('email').value;

    // Giả lập việc gửi yêu cầu đặt lại mật khẩu
    if (emailOrUsername === 'admin') {
      alert('Yêu cầu đặt lại mật khẩu đã được gửi!');
      forgotPasswordContainer.style.display = 'none';
      loginContainer.style.display = 'block';
    } else {
      forgotPasswordError.textContent = 'Tên đăng nhập hoặc email không tồn tại!';
    }
  });


});

