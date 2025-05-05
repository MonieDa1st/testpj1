# Web Blog Application

Ứng dụng blog đơn giản được xây dựng bằng React (Frontend) và Node.js + Express (Backend) với MySQL làm cơ sở dữ liệu.

## Yêu cầu hệ thống

1. Node.js (phiên bản 14.0.0 trở lên)
2. MySQL (phiên bản 8.0 trở lên)
3. npm (Node Package Manager)

### Cài đặt Node.js và npm

1. Tải Node.js từ [trang chủ Node.js](https://nodejs.org/)
2. Chọn phiên bản LTS (Long Term Support)
3. Chạy file cài đặt và làm theo hướng dẫn
4. Kiểm tra cài đặt bằng lệnh:
```bash
node --version
npm --version
```

### Cài đặt MySQL

1. Tải MySQL từ [trang chủ MySQL](https://dev.mysql.com/downloads/mysql/)
2. Chọn phiên bản phù hợp với hệ điều hành
3. Trong quá trình cài đặt:
   - Ghi nhớ password cho tài khoản root
   - Chọn port cho MySQL (mặc định là 3306)
4. Kiểm tra MySQL đã chạy bằng MySQL Workbench hoặc command line

## Cài đặt và Chạy ứng dụng

### 1. Clone repository

```bash
git clone <repository-url>
cd web_blog
```

### 2. Cài đặt Database

1. Đảm bảo MySQL đã được cài đặt và đang chạy
2. Tạo database và bảng:

```sql
CREATE DATABASE webblog;
USE webblog;

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE blog (
    id_blog INT AUTO_INCREMENT PRIMARY KEY,
    blog_name VARCHAR(255) NOT NULL UNIQUE,
    blog_content TEXT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_name) REFERENCES user(username)
);
```

### 3. Cài đặt Backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Cấu hình database:
   - Mở file `server.js`
   - Tìm và sửa thông tin kết nối database theo cấu hình của bạn:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,  // Thay đổi port nếu cần
    user: 'root',  // Thay đổi username nếu cần
    password: 'your_password',  // Thay đổi password
    database: 'webblog'
});
```

4. Chạy server:
```bash
npm start
```
Server sẽ chạy tại http://localhost:5000

### 4. Cài đặt Frontend

1. Mở terminal mới và di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt các dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```
Frontend sẽ chạy tại http://localhost:3000

## Tính năng

1. Đăng ký tài khoản
2. Đăng nhập
3. Xem danh sách blog
4. Tạo blog mới
5. Chỉnh sửa blog
6. Xóa blog
7. Xem danh sách blog theo tài khoản đăng nhập

## Cấu trúc thư mục

```
web_blog/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── assets/
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── package.json
    └── package-lock.json
    ├── postcss.config.js
    └── tailwind.config.json

```

## Lưu ý

1. Đảm bảo MySQL đang chạy trước khi khởi động backend
2. Nếu gặp lỗi CORS, hãy kiểm tra cấu hình CORS trong `backend/server.js`
3. Đảm bảo các port không bị sử dụng:
   - Frontend: port 3000
   - Backend: port 5000
   - MySQL: port 3307 (hoặc port bạn đã cấu hình)
4. Nếu muốn deploy ứng dụng, cần cấu hình lại các thông số như database connection string, API endpoints, etc.

## Hỗ trợ

Nếu bạn gặp bất kỳ vấn đề nào, vui lòng tạo issue trong repository hoặc liên hệ với team phát triển. 