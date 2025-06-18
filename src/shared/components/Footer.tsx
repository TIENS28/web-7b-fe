// Footer trang chủ bệnh viện
export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-t dark:border-gray-800">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-sm">
              <div>📍 Đường Nguyễn Ái Quốc, P Tân Mai, Thành phố Biên Hoà, Tỉnh Đồng Nai</div>
              <div>📞 02513 99 60 60</div>
              <div>✉️ contact@hospital.com</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Mạng xã hội</h3>
            <div className="flex space-x-4 text-2xl">
              <span>🌐</span>
              <span>📘</span>
              <span>🐦</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li>Điều khoản sử dụng</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Giờ làm việc</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 dark:text-gray-400">Thứ 2 - Thứ 6</span>
                <div className="text-right font-medium text-black dark:text-white">
                  <div>7:00 - 11:30</div>
                  <div>13:30 - 17:00</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Thứ 7</span>
                <span className="font-medium text-black dark:text-white">7:00 - 11:30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Chủ nhật</span>
                <span className="font-medium text-black dark:text-white">Nghỉ</span>
              </div>
              <div className="flex justify-between items-center text-red-600 dark:text-red-500 pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-medium">Trực Cấp Cứu</span>
                <span className="font-bold">24/7</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-500 text-center text-sm">
          <p>&copy; 2025 Bệnh viện XYZ. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
} 
