import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Problem from "../components/landing/Problem";
import ProductDemo from "../components/landing/ProductDemo";
import Features from "../components/landing/Features";
import CTAFooter from "../components/landing/CTAFooter";

function LandingPage() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <ProductDemo />
      <Features />
      <CTAFooter />
    </div>
  );
}

export default LandingPage;