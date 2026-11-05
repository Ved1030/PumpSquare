import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import AboutPreview from "@/components/home/AboutPreview";
import ProductCategories from "@/components/home/ProductCategories";
import TopProducts from "@/components/home/TopProducts";
import IndustriesSection from "@/components/home/IndustriesSection";
import EquipmentSection from "@/components/home/EquipmentSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutPreview />
      <ProductCategories />
      <Suspense fallback={<div className="h-96 bg-white" />}>
        <TopProducts />
      </Suspense>
      <IndustriesSection />
      <EquipmentSection />
    </>
  );
}
