import CTA from '@/components/CTA'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
// import Testimonials from '@/components/Testimonials'

export default async function Home() {
  const session = await getServerSession(nextAuthOptions)
  if (session) {
    redirect('/application')
  }
  return (
    <div>
      <Hero />
      <CTA />
      <Features />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  )
}
