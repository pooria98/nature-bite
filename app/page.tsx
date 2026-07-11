import HeroSection from "@/sections/HeroSection";
import IngredientsSection from "@/sections/IngredientsSection";
import InstagramSection from "@/sections/InstagramSection";
import ProductsSection from "@/sections/ProductsSection";
import ProductTypes from "@/sections/ProductTypes";
import WhySection from "@/sections/WhySection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductTypes />
      <ProductsSection />
      <IngredientsSection />
      <WhySection />
      <InstagramSection />
    </>
  );
}
