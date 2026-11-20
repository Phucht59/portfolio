# Kho lưu các bản thử nghiệm

Mã nguồn đang phát triển nằm ở [thư mục gốc](../README.md).
Thư mục này giữ các checkpoint và tư liệu review trên máy làm dự án.

| Thư mục cục bộ | Nội dung |
| --- | --- |
| `portfolio-v40/` | Website V4.0, gói bàn giao và ảnh review cũ |
| `PHUC_V5_20261015/`, `PHUC_V51_20261016/` | Snapshot V5/V5.1, gồm app review và Blender master |
| `FULL_HOMEPAGE_*/`, `GATE*/`, `H1_*/` | Các bản dựng thử homepage, kiến trúc và vải |
| `review/` | Các đợt thử nghiệm thị giác, gồm V5.2–V5.8 |
| `delivery/`, `handoff/` | Gói bàn giao và báo cáo của các phiên bản V5 |

Để mở app review V5.1–V5.8, chạy `npm ci` và `npm run dev` trong
`test/PHUC_V51_20261016/APP`. Xem route và query cụ thể trong báo cáo từng bản.
Script Blender cũ có thể cần cập nhật đường dẫn tuyệt đối theo vị trí archive.
