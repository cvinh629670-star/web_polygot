// Service Worker chỉ đăng ký khi trang được phục vụ qua HTTPS hoặc localhost.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
 window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Không thể bật chế độ ngoại tuyến:', error));
 }, { once:true });
}
