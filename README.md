# Portfolio Trần Hoàng Phúc

Portfolio EN/VI với homepage WebGL ngày/đêm, tải CV và bốn case study.
Trang chính dùng homepage V5.1 R3 làm nền tảng phát triển.

## Chạy dự án

Dùng Node.js 22.18+ và npm.

```sh
npm ci
npm run dev
```

- Trang chủ `/`
- Dự báo rủi ro học tập `/work/student-risk`
- Tìm kiếm nhà hàng `/work/restaurant-search`
- Điểm danh khuôn mặt `/work/face-attendance`
- Đặt vé máy bay `/work/flight-booking`

## Build và kiểm tra

```sh
npm run lint
npm test
npm run verify:assets
npm run build
npm run preview
```

Triển khai thư mục `dist/` qua HTTP và trỏ các route SPA về `index.html`.
Repo có sẵn cấu hình rewrite cho Vercel và Netlify.

`src/` chứa mã nguồn và kiểm thử. `public/` chứa CV, mô hình, texture
và dữ liệu chuyển động cần để chạy website. Nội dung các dự án nằm trong
[`project-content.json`](src/content/project-content.json). Xem [nguồn asset](ATTRIBUTION.md).

Các checkpoint, lab 3D, bản dựng thử và báo cáo review được lưu cục bộ trong
[`test/`](test/README.md). Git lưu trang hướng dẫn của thư mục này.
