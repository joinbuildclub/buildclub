import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RolesSection from "@/components/RolesSection";
import EventsSection from "@/components/EventsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden page-content">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RolesSection />
      <EventsSection />
      <JoinSection />
      <Footer />
    </div>
  );
}
