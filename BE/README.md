
# Dreamer Hospital BE
## Giới thiệu
Dreamer Hospital BE là đồ án môn Lập trình ứng dụng Web (NT208) của nhóm F4 bao gồm các thành viên:
- Nguyễn Nhật Nguyễn
- Lê Thành Phát
- Nguyễn Chấn Phong
- Nguyễn Lộc Tỷ

## Cài đặt
### Phát triển
Cần cài đặt tối thiểu [Node.js](https://nodejs.org/en) v20
```
# 1. Cài đặt các thư viện cần thiết
$ npm install

# 2. Đặt lại env và chỉnh sửa Database URL
$ cp .env.example .env
$ nano .env # hoặc vi .env

# 3. Generate Prisma Client
$ npx prisma generate

# 4. Tạo một route API mới
$ npx nest g resource <route_name> --no-spec

# 5. Bắt đầu phát triển
$ npm run start:dev

# Truy cập tại http://localhost:3000
```


### Commit và Push code lên GitHub
Husky là một thư viện dùng để quản lý các Git Hooks trong các dự án Javascript/Node.js.
Trong repository này Husky sẽ chạy 3 lệnh để kiểm tra code:
1. Kiểm tra format code
2. Kiểm tra cú pháp hoặc lỗi tiềm ẩn (Linting)
3. Kiểm tra cú pháp commit

Nếu Husky kiểm tra và tìm thấy lỗi:
1. Format code:
    Chạy `npm run format:fix` để tự động sửa format của code
2. Cú pháp lỗi:
    Chạy `npm run lint` để tìm chỗ sai và sửa lỗi
3. Cú pháp commit lỗi:
    Commit lại đúng cú pháp theo [Git workflow & Commit Convention](https://stellar-horn-ccf.notion.site/Git-workflow-Commit-Convention-1af16594dfd28024bf95d694e075e632)

## Công nghệ và thư viện sử dụng
- [Nest.js](https://docs.nestjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/orm/overview/introduction) sử dụng PostgreSQL