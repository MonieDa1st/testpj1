const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo AWS SSM để truy cập Parameter Store
const ssm = new AWS.SSM({
    region: 'us-east-1' // Thay bằng region của bạn
});

// Hàm lấy thông tin kết nối từ Parameter Store
async function getDbConfig() {
    const params = {
        Names: [
            '/webblog/db/host',
            '/webblog/db/port',
            '/webblog/db/user',
            '/webblog/db/password',
            '/webblog/db/database'
        ],
        WithDecryption: true
    };
    const response = await ssm.getParameters(params).promise();
    const config = {};
    response.Parameters.forEach(param => {
        const key = param.Name.split('/').pop();
        config[key] = param.Value;
    });
    return config;
}

// Khởi tạo kết nối MySQL
let db;
(async () => {
    try {
        const dbConfig = await getDbConfig();
        db = mysql.createConnection({
            host: dbConfig.host,
            port: parseInt(dbConfig.port),
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database
        });

        db.connect((err) => {
            if (err) {
                console.error('Lỗi kết nối database:', err);
                return;
            }
            console.log('Đã kết nối thành công đến MySQL');
        });
    } catch (err) {
        console.error('Lỗi khi lấy thông tin từ Parameter Store:', err);
        process.exit(1); // Thoát nếu không lấy được thông tin
    }
})();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(201).json({ status: 'ok' });
});

// API đăng ký
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra username đã tồn tại
    db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại. Vui lòng nhập lại!' });
        }

        // Kiểm tra email đã tồn tại
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi server' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Email đã tồn tại. Vui lòng nhập lại!' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Thêm user mới
            db.query('INSERT INTO user (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Lỗi server' });
                    }
                    res.status(201).json({ message: 'Đăng ký thành công' });
                }
            );
        });
    });
});

// API đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra username
    db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.length === 0) {
            return res.status(400).json({ error: 'Tên đăng nhập không tồn tại. Vui lòng nhập lại!' });
        }

        // Kiểm tra mật khẩu
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Mật khẩu không đúng. Vui lòng nhập lại!' });
        }

        res.json({ 
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                username: user.username
            }
        });
    });
});

// API tạo blog mới
app.post('/api/blogs', (req, res) => {
    const { blog_name, blog_content, author_name } = req.body;

    // Kiểm tra tên blog đã tồn tại
    db.query('SELECT * FROM blog WHERE blog_name = ?', [blog_name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Tên blog này đã tồn tại. Vui lòng nhập lại!' });
        }

        // Thêm blog mới
        db.query(
            'INSERT INTO blog (blog_name, blog_content, author_name) VALUES (?, ?, ?)',
            [blog_name, blog_content, author_name],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.status(201).json({ 
                    message: 'Tạo blog thành công',
                    blog_id: results.insertId
                });
            }
        );
    });
});

// API lấy danh sách blog có phân trang
app.get('/api/blogs', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    // Lấy tổng số blog
    db.query('SELECT COUNT(*) as total FROM blog', (err, countResults) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        const totalBlogs = countResults[0].total;
        const totalPages = Math.ceil(totalBlogs / limit);

        // Lấy danh sách blog theo trang
        db.query(
            'SELECT * FROM blog ORDER BY post_time DESC LIMIT ? OFFSET ?',
            [limit, offset],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json({
                    blogs: results,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: totalBlogs,
                        itemsPerPage: limit
                    }
                });
            }
        );
    });
});

// API lấy danh sách blog của một user có phân trang
app.get('/api/blogs/user/:username', (req, res) => {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    // Lấy tổng số blog của user
    db.query('SELECT COUNT(*) as total FROM blog WHERE author_name = ?', [username], (err, countResults) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }

        const totalBlogs = countResults[0].total;
        const totalPages = Math.ceil(totalBlogs / limit);

        // Lấy danh sách blog của user theo trang
        db.query(
            'SELECT * FROM blog WHERE author_name = ? ORDER BY post_time DESC LIMIT ? OFFSET ?',
            [username, limit, offset],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                res.json({
                    blogs: results,
                    pagination: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: totalBlogs,
                        itemsPerPage: limit
                    }
                });
            }
        );
    });
});

// API xóa blog
app.delete('/api/blogs/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM blog WHERE id_blog = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy blog' });
        }
        res.json({ message: 'Xóa blog thành công' });
    });
});

// API cập nhật blog
app.put('/api/blogs/:id', (req, res) => {
    const { id } = req.params;
    const { blog_name, blog_content } = req.body;

    // Kiểm tra tên blog đã tồn tại (trừ blog hiện tại)
    db.query('SELECT * FROM blog WHERE blog_name = ? AND id_blog != ?', [blog_name, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Tên blog này đã tồn tại. Vui lòng nhập lại!' });
        }

        // Cập nhật blog
        db.query(
            'UPDATE blog SET blog_name = ?, blog_content = ? WHERE id_blog = ?',
            [blog_name, blog_content, id],
            (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Lỗi server' });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy blog' });
                }
                res.json({ message: 'Cập nhật blog thành công' });
            }
        );
    });
});

// API kiểm tra user có tồn tại
app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;

    db.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi server' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User không tồn tại' });
        }
        res.json({
            user: {
                id: results[0].id,
                username: results[0].username
            }
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});