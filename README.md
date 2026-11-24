# PolyGlot SRS

Ứng dụng học từ vựng Anh, Hàn, Trung, Nhật với lặp lại ngắt quãng. Giao diện được nâng cấp bằng **React 19 + Tailwind CSS 4 + shadcn/ui (Radix) + Motion**.

## Mở trang đã build

Mở trực tiếp `index.html` trong trình duyệt hoặc dùng Live Server. Các tệp React và Tailwind đã biên dịch, ảnh minh họa và biểu tượng nằm trong `assets/`. Giữ nguyên cấu trúc thư mục khi sao chép trang. Phông chữ từ Google Fonts và các chức năng tra cứu trực tuyến cần Internet.

## Phát triển

Cần Node.js 22.12+ hoặc Node.js 24 LTS.

```powershell
npm install
npm run dev
```

Vite in địa chỉ máy chủ cục bộ trong terminal. Thay đổi React/CSS được cập nhật bằng HMR; thay đổi template/partial tự tạo lại HTML. Dữ liệu học được lưu trong localStorage của trình duyệt theo địa chỉ trang, vì vậy dữ liệu tại `file://`, Live Server và Vite là các vùng lưu trữ riêng. Có thể dùng chức năng xuất/nhập từ vựng hiện có để chuyển giữa các địa chỉ.

```powershell
npm run build      # Ghép HTML và biên dịch React/Tailwind vào assets/
npm run preview    # Xem bản đã build tại http://127.0.0.1:4173
npm test           # Kiểm tra hồi quy bằng Playwright sau khi build
```

Lệnh Windows cũ vẫn dùng được và nay biên dịch cả giao diện:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1
```

Trên máy này, `build.ps1` cũng tìm được Node portable trong `%USERPROFILE%\.cache\polyglot-tools` nếu Node chưa có trên PATH. Trên máy khác, cài Node theo yêu cầu trên. Kiểm thử dùng Chrome có sẵn trên Windows; có thể đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE` hoặc cài Chromium bằng `npx playwright install chromium`.

## Mã nguồn

- `index.template.html`, `partials/`: khung trang và các phòng học. `index.html` là tệp được tạo tự động; sửa ở nguồn rồi build lại.
- `src/App.jsx`: điều hướng React, bảng tổng quan với số liệu thật, tiến độ thành thạo và truy cập nhanh bằng Ctrl/Cmd+K.
- `src/components/ui/`: các component shadcn/ui có thể chỉnh sửa trực tiếp: Button, Card, Badge, Progress, Dialog, Input, Tooltip.
- `src/styles.css`: Tailwind CSS 4, token màu `ui-*`, giao diện responsive, sáng/tối và tùy chọn giảm chuyển động.
- `js/app.js`, `js/audio.js`: logic SRS, bộ từ, nghe, giao tiếp, trò chơi và âm thanh hiện có.
- `js/ui-bridge.js`: cầu nối trạng thái từ bộ xử lý học tập sang React. React sở hữu các root riêng để giữ nguyên DOM của các phòng học và trình phát nhạc.
- `css/`: kiểu dáng cho các phần giao diện hiện có. `assets/app-ui.js` và `assets/app-ui.css`: bản build dùng trực tiếp trong trình duyệt, bao gồm các thư viện cần thiết.

Tailwind quét cả template, partial, JavaScript cũ và React; không còn dùng Tailwind CDN. Màu shadcn được đặt tên riêng để tránh xung đột với màu theo ngôn ngữ. Motion quản lý hiệu ứng điều hướng và chuyển phòng; `prefers-reduced-motion` được tôn trọng. Dữ liệu và cấu hình `polyglot_*` được lưu trên thiết bị bằng localStorage và được giữ lại khi nâng cấp.

Tài liệu: [React tích hợp vào trang có sẵn](https://react.dev/learn/add-react-to-an-existing-project), [Tailwind với Vite](https://tailwindcss.com/docs/installation/using-vite), [shadcn/ui](https://ui.shadcn.com/docs/installation/manual), [Motion](https://motion.dev/docs/react).
