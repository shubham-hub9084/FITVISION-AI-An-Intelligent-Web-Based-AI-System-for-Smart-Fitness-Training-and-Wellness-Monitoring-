import React from 'react'

const pricingPlans = [
  {
    name: 'Basic',
    price: '$0',
    period: 'mo',
    features: [
      'AI workout generator',
      'Limited progress tracking',
      'Community support'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'mo',
    features: [
      'All Basic features',
      'Personalized coaching',
      'Advanced analytics'
    ],
    cta: 'Get Pro',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: 'mo',
    features: [
      'Team management',
      'Priority support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

const Pricing = () => {
  return (
    <div>
      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Start with our free trial and upgrade to unlock advanced AI features and personalized coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 p-6 sm:p-8 transition-colors duration-300 ${plan.popular ? 'border-emerald-500 lg:scale-105' : 'border-gray-200 dark:border-slate-700'} ${plan.popular && index === 1 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <i className="ri-check-line text-emerald-600 text-lg"></i>
                      <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.name === 'Basic') {
                      window.location.href = '/dashboard';
                    } else if (plan.name === 'Pro') {
                      alert('Pro plan coming soon! Contact us for early access.');
                    } else {
                      alert('Enterprise plan - Please contact sales for custom pricing.');
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${plan.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white'
                    }`}
                  aria-label={`${plan.cta} - ${plan.name} plan`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Pricing
