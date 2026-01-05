import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PackagesSection from "@/components/PackagesSection";
import LocationsSection from "@/components/LocationsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PackagesSection />
      <LocationsSection />
      <AboutSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default Index;
