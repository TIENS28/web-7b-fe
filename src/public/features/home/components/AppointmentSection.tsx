// Section đặt lịch khám/hướng dẫn bệnh nhân
export default function AppointmentSection() {
  return (
    <section className="container mx-auto py-8 dark:bg-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">Đặt lịch khám</h2>
        <p className="mb-6 dark:text-gray-200">Đặt lịch khám trực tuyến để được phục vụ tốt nhất</p>
        <button className="bg-red-600 text-white font-semibold px-6 py-3 rounded shadow hover:bg-red-700 transition">Đặt lịch ngay</button>
      </div>
    </section>
  );
} 
