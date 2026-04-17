import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Products from "../components/Products";
import Educational from "../components/Educational";
import Offers from "../components/Offers";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Products />
      <Educational />
      <Offers />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
