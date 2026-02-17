import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuienesSomos from "@/components/QuienesSomos";
import Highlights from "@/components/Highlights";
import Eventos from "@/components/Eventos";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <QuienesSomos />
        <Highlights />
        <Eventos />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
