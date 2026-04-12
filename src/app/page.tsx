import CTA from "@/components/CTA";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
// import Testimonials from '@/components/Testimonials'

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/application");
  }
  return (
    <div>
      <Hero />
      <CTA />
      <Features />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}
