import banner1 from "shared/assets/images/banners/banner1.jpg";
import { Button } from "shared/components/shadcn/button"

export default function Banner() {
  return (
    <section className="relative py-20 text-center bg-cover bg-center" style={{ backgroundImage: `url(${banner1})` }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container mx-auto relative z-10 text-white">
        <h2 className="text-4xl font-bold mb-4 drop-shadow">Chăm sóc sức khỏe tận tâm</h2>
        <p className="text-xl mb-8 drop-shadow">Với đội ngũ y bác sĩ giàu kinh nghiệm</p>
        <Button className="bg-white text-red-600 font-semibold px-6 py-3 rounded shadow hover:bg-red-100 transition">Đặt lịch khám ngay</Button>
      </div>
    </section>
  );
} 
