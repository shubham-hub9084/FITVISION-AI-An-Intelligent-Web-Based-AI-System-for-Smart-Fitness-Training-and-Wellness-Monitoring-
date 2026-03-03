import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from './HeroSection/HeroSection'
import Getstarted from './Getstarted/Getstarted'
import HowItWorks from './HowItWorks/HowItWorks'
import Pricing from './Pricing/Pricing'
import Testimonials from './Test/Testimonials'
import Contactus from './Contactus/Contactus'
import Footer from './Footer/Footer'
import Features from './Features/Features'
import KeyBenefits from './KeyBenefits/KeyBenefits'

const HomePage = () => {
  const [showGetStartedModal, setShowGetStartedModal] = useState(false)

  return (
    <div className="min-h-screen dark:bg-slate-900 transition-colors duration-300">

      <Navbar />
      <main id="main-content">
        <HeroSection setShowGetStartedModal={setShowGetStartedModal} />
        <KeyBenefits />
        <Getstarted showGetStartedModal={showGetStartedModal} setShowGetStartedModal={setShowGetStartedModal} />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Contactus />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
