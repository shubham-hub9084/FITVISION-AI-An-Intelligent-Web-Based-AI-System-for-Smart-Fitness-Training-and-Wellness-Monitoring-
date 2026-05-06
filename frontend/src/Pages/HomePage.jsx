import React, { useState } from 'react'
import HeroSection from './HeroSection/HeroSection'
import Getstarted from './Getstarted/Getstarted'
import HowItWorks from './HowItWorks/HowItWorks'
import Testimonial from './Testimonial/Testimonial'

import Contactus from './Contactus/Contactus'
import Footer from './Footer/Footer'
import Features from './Features/Features'
import KeyBenefits from './KeyBenefits/KeyBenefits'

const HomePage = () => {
  const [showGetStartedModal, setShowGetStartedModal] = useState(false)

  return (
    <div className="min-h-screen dark:bg-slate-900 transition-colors duration-300">

      <main id="main-content">
        <HeroSection setShowGetStartedModal={setShowGetStartedModal} />
        <KeyBenefits />
        <Getstarted showGetStartedModal={showGetStartedModal} setShowGetStartedModal={setShowGetStartedModal} />
        <Features />
        <HowItWorks />
        <Testimonial />
        <Contactus />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
