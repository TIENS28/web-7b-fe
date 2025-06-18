import Banner from "public/features/home/components/Banner";
import QuickInfoSection from "shared/features/articles/components/QuickInfoSection";
import DoctorSection from "public/features/home/components/DoctorSection";
// import AppointmentSection from "./features/home/components/AppointmentSection";

/**
 * Trang chủ bệnh viện - ghép các section
 * Layout (header, navigation, footer) được quản lý bởi PublicLayout
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col dark:bg-gray-900 dark:text-white">
      <main className="flex-1">
        <Banner />
        <QuickInfoSection />
        <DoctorSection />
        {/* <AppointmentSection /> */}
      </main>
    </div>
  );
} 
