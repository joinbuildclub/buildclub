import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RolesSection from "@/components/RolesSection";
import EventsSection from "@/components/EventsSection";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="page-container bg-background text-foreground overflow-hidden">
      <Navbar />
      <div className="main-content">
        <HeroSection />
        <AboutSection />
        <RolesSection />
        <EventsSection />
        <JoinSection />
      </div>
      <Footer />
    </div>
  );
}
