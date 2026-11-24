# Trạng thái triển khai Polygot Grammar Lab

Grammar Lab được tích hợp vào phòng luyện tập hiện có. Mở **Luyện ngữ pháp** hoặc **Luyện viết Hán tự**, rồi chọn **Mở Grammar Lab**. Nút quay về đưa người dùng trở lại bài cơ bản, trình nhập bài hoặc bàn Hán tự.

| Giai đoạn | Nội dung đã triển khai |
|---|---|
| 1. Phân tích | Giữ React, Tailwind, Vite, luồng HTML ghép tự động và logic học cục bộ. Tách dữ liệu Grammar Lab khỏi SRS từ vựng. |
| 2. Nền tảng | Kho dữ liệu bốn ngôn ngữ với ID ổn định, cấp độ, chủ đề và quan hệ điều kiện tiên quyết. Hồ sơ lưu riêng theo ngôn ngữ. |
| 3. Giao diện | Năm trang, thanh điều hướng dưới trên di động, bảng màu theo ngôn ngữ, hỗ trợ sáng/tối, giảm chuyển động, biểu tượng cục bộ và ảnh gia sư từ ImageGen. |
| 4. Học và luyện | Cây kỹ năng có tìm kiếm, lọc và thay đổi kích cỡ node. Thư viện có công thức, ví dụ, lỗi và yêu thích. 10 dạng bài; bài nhập từ ngữ pháp cơ bản cũng hiện trong Lab. |
| 5. Đánh giá | Năng lực 0–100, radar, hoạt động 7 ngày, phân tích lỗi, SRS 1/3/7/14/30/60 ngày và chọn câu dựa trên lịch ôn, lỗi, độ khó, từ quen. |
| 6. Động lực | XP có giới hạn theo sự kiện, Rank dựa trên điểm năng lực và số ngày có dữ liệu, chuỗi ngày, nhiệm vụ, thành tựu và Weekly Boss dựa trên dữ liệu trong tuần. |
| 7. Tích hợp | Đọc kho từ qua giao diện cục bộ, bộ chấm theo quy tắc, JSON tiến độ và sao lưu chung, PWA ngoại tuyến sau khi tải các tài nguyên tĩnh. |
| 8. Kiểm thử | Build thành công, 17/17 bài Playwright đạt, kiểm tra thêm điều hướng dưới tại 390 px và các mốc SRS. |

## Cấu trúc

```text
assets/
  grammar-lab-tutor.webp
  polyglot-icon-192.png
  polyglot-icon-512.png
css/grammar-lab.css
js/grammar-lab/
  content.js         # ngôn ngữ, cấu trúc, ngân hàng câu hỏi
  repository.js      # schema v1, đọc/ghi, xác thực và lưu hồ sơ
  engine.js          # chấm, SRS, điểm, XP, lỗi, chọn bài
  ui.js              # năm trang và luồng phiên luyện
js/offline.js
manifest.webmanifest
sw.js
partials/practice.html
tests/ui.spec.js
```

Các tệp tích hợp gồm `index.template.html`, `js/language-practice.js`, `js/app.js`, `scripts/preview.mjs`, `README.md` và bản xuất `index.html`. `assets/app-ui.js` và `assets/app-ui.css` là đầu ra build sẵn có của dự án.

Ảnh gia sư được tạo bằng ImageGen tích hợp và lưu ở `assets/grammar-lab-tutor.webp`. Prompt đã dùng

> Cozy anime editorial illustration for a language study app, landscape 3:2. Thoughtful adult language tutor in a lavender cardigan reading a small open book by a softly lit study window, a pencil and paper on the desk, serene pastel lilac, pale mint and warm ivory, modern minimal composition with the tutor centered, simple soft cel shading and subtle paper texture. No text, no typography, no logos, no interface.

## Dữ liệu và điểm số

- Mỗi hồ sơ dùng schema v1 với sự kiện trả lời, phiên học, bài đã học, lịch ôn, yêu thích, mốc thưởng và cài đặt phiên. Nhật ký câu sai được tổng hợp từ sự kiện trả lời, nên lịch sử còn giữ sau khi sửa được.
- Mốc ngày học theo lịch của thiết bị tại thời điểm ghi. Ngày ôn dùng ngày lịch thay vì cộng một bội số cố định của 24 giờ.
- Công thức năng lực dùng trọng số 40% chính xác, 25% vận dụng, 20% ghi nhớ và 15% ổn định. Hệ số và ngưỡng là heuristic. Số mẫu, dạng câu và ngày học ảnh hưởng kết quả. Bài tự đánh giá được lưu riêng khỏi độ chính xác xác minh.
- Bộ chấm có giao diện `assess(question, answer)` và trả về đúng, sai hoặc tự đối chiếu. Dịch ngoài các biến thể có sẵn và bài viết mở đi qua bước tự đối chiếu.

## Phạm vi và bước tiếp theo

- Ngân hàng khởi đầu có 12 cấu trúc và 76 câu, chia đều cho bốn ngôn ngữ. Bộ lọc liệt kê khung cấp độ để mở rộng, số bài hiện tại chưa phủ toàn bộ CEFR, TOPIK, HSK hay JLPT.
- Bài tự thêm theo mẫu JSON hiện có được nhập dưới dạng lý thuyết và trắc nghiệm. Cấu trúc tệp riêng cho các dạng nâng cao là hướng mở rộng.
- Bộ chấm cục bộ chưa có dịch vụ AI từ xa. Nếu bổ sung, đưa xác thực và giới hạn chi phí ra backend, rồi xác thực kết quả trước khi dùng.
- Dữ liệu lưu trên thiết bị, chưa có đồng bộ tài khoản, chưa đóng gói Capacitor. Nên cân nhắc IndexedDB và đồng bộ có phiên bản nếu lượng lịch sử tăng đáng kể.
- PWA lưu trang học và dữ liệu tĩnh của Lab. Game Zombie, font từ Google và tác vụ cần mạng có phạm vi ngoại tuyến riêng.

## Kiểm thử

Chạy `npm run build`, sau đó `npm test`. Bộ Playwright bao gồm kiểm thử cũ của PolyGlot, 10 dạng trả lời, lưu lỗi và luyện lại, XP/SRS, hồ sơ theo ngôn ngữ và mở phiên học sau khi ngắt mạng.

Lần chạy cuối trong workspace hoàn tất 17/17 bài trên Chromium. Kiểm tra riêng xác nhận lịch 1/3/7/14/30/60 ngày theo giờ địa phương và việc lặp một câu đúng chỉ cấp XP cho câu đó một lần.
