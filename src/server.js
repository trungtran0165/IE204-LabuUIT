const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors'); // Cho phép gọi từ frontend
const db = require('./config/db/database')
const route = require('./routes/index')
const { seoHeaders } = require('./middleware/seo');

// Kết nối DB
db.connect();

const app = express();
const port = process.env.PORT || 3000; // PORT từ biến môi trường

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cho phép từ frontend
    credentials: true,
})); // Đảm bảo Frontend có thể gọi API này
app.use(morgan('combined')); // HTTP Logger
app.use(express.static(path.join(__dirname, 'public'))); // Static files
app.use(express.urlencoded({ extended: true })); // Xử lý form
app.use(express.json()); // Xử lý JSON
app.use(seoHeaders); // Thêm SEO headers

// Route gốc để kiểm tra
app.get('/', (req, res) => {
    res.send('Server is running!!!');
});

route(app);

// Khởi động server
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
