import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NAV_LINKS_KEYS } from "./data";
import { useInfo } from "./apiHooks";
import GlobalStyles from "./GlobalStyles";
import Preloader from "./Preloader";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import ProcessSection from "./ProcessSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsSection from "./NewsSection";
import ContactSection from "./ContactSection";
import BrandsSection from "./BrandsSection";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function XBuildApp() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const info = useInfo();
  const NAV_LINKS = NAV_LINKS_KEYS.map(l => ({ ...l, label: t(`nav.${l.key}`) }));

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href).filter(h => h !== "#");
    const fn = () => {
      for (const id of [...sections].reverse()) {
        const el = document.querySelector(id);
        if (el && el.getBoundingClientRect().top <= 100) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <GlobalStyles />
      <Preloader done={loaded} info={info} />
      <Navbar active={activeSection} info={info} />
      <HeroSection info={info} />
      <ServicesSection />
      <AboutSection info={info} />
      <ProjectsSection />
      <ProcessSection />
      <StatsSection info={info} />
      <TestimonialsSection />
      <NewsSection />
      <ContactSection info={info} />
      <BrandsSection />
      <Footer info={info} />
      <BackToTop />
    </>
  );
}
