import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const animationStyles = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-4px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 600px;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
      max-height: 600px;
    }
    to {
      opacity: 0;
      transform: translateY(-4px);
      max-height: 0;
    }
  }

  .faq-expand-enter {
    animation: slideDown 0.22s ease-out forwards;
  }

  .faq-expand-exit {
    animation: slideUp 0.18s ease-in forwards;
  }

  .faq-icon-rotate {
    transition: transform 0.2s ease-in-out;
  }

  .faq-button-hover {
    transition: background-color 0.18s ease-out, transform 0.18s ease-out;
  }

  .faq-button-hover:hover {
    transform: translateY(-1px);
  }
`;

export default function CalculatorFAQ() {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 60 });
  }, []);

  const faqs = [
    {
      id: 'how-to-use',
      q: 'How do I use this calorie calculator?',
      a: `Simply enter your age, gender, height, weight, and activity level. Click "Calculate" to see your daily calorie needs for maintaining, losing, or gaining weight. It's the best starting point for your fitness journey!`,
    },
    {
      id: 'activity-level-choice',
      q: 'Which activity level should I select?',
      a: `Be honest! If you have a desk job and don't exercise much, choose "Sedentary" or "Lightly Active". If you work out 3-5 times a week, choose "Moderate". Overestimating activity is a common mistake that can slow down weight loss.`,
    },
    {
      id: 'results-explanation',
      q: 'What do "Maintenance", "Cutting", and "Bulking" mean?',
      a: `• Maintenance: The calories you need to stay at your current weight.
• Cutting (Weight Loss): A calorie deficit (eating less) to help you burn fat.
• Bulking (Muscle Gain): A calorie surplus (eating more) to help you build muscle.`,
    },
    {
      id: 'macros-explanation',
      q: 'What are Macros and why do they matter?',
      a: `Macros (Macronutrients) are Protein, Carbs, and Fats. While total calories determine if you lose or gain weight, macros determine *body composition*—helping you lose fat while keeping muscle, or build muscle without gaining too much fat.`,
    },
    {
      id: 'accuracy-check',
      q: 'How accurate is this calculator?',
      a: `It uses the Mifflin-St Jeor equation, considered one of the most accurate scientific formulas. However, everyone's metabolism is unique. Use these numbers as a starting point, track your weight for 2-3 weeks, and adjust if necessary.`,
    },
    {
      id: 'calorie-cycling',
      q: 'Should I eat the same amount of calories every day?',
      a: `Consistency is key, but it's okay to fluctuate slightly. Some people eat more on workout days and less on rest days. As long as your *weekly* average matches your goal, you'll see results.`,
    },
    {
      id: 'tracking-food',
      q: 'How do I track my food intake?',
      a: `We recommend using a food tracking app to log what you eat. For the best results, use a kitchen scale to weigh your food, as estimating portion sizes can often lead to errors.`,
    },
    {
      id: 'when-results',
      q: 'How long does it take to see results?',
      a: `Healthy weight loss is typically 0.5kg to 1kg (1-2 lbs) per week. If you remain consistent with your calorie target, you should start seeing noticeable changes in your weight and measurements within 2 to 4 weeks.`,
    },
  ];

  function toggle(id) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <style>{animationStyles}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-md border border-slate-100 dark:border-slate-700 transition-all duration-300"
          data-aos="fade-up"
        >
          {/* Header */}
          <header className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-medium mb-5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800">
                <i className="ri-calculator-line text-base text-emerald-600 dark:text-emerald-300" />
              </span>
              Calorie &amp; Macro Calculator Help
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <i className="ri-question-answer-line text-xl text-emerald-600 dark:text-emerald-400"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                Clear answers about how to use the calculator, understand your macros, and apply your results.
              </p>
            </div>
          </header>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {faqs.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${isOpen
                    ? 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-900/10 dark:border-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-300/80 dark:hover:border-emerald-500/50'
                    }`}
                >
                  <button
                    className="faq-button-hover w-full text-left px-5 py-4 flex justify-between items-center gap-4 focus:outline-none dark:hover:bg-slate-700/50"
                    onClick={() => toggle(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                  >
                    <span
                      className={`font-medium text-base sm:text-lg leading-snug transition-colors ${isOpen ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-800 dark:text-gray-200'
                        }`}
                    >
                      {item.q}
                    </span>

                    <span
                      className={`faq-icon-rotate flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm ${isOpen
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rotate-180'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                    >
                      <i className="ri-arrow-down-s-line text-xl" />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`${item.id}-panel`}
                      className="faq-expand-enter border-t border-emerald-100/70 dark:border-emerald-900/30 bg-white dark:bg-slate-800"
                    >
                      <div className="px-5 pb-4 pt-3">
                        <div className="text-sm sm:text-base text-slate-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-10 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">
              Still unsure about your numbers?{' '}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Focus on consistency first
              </span>{' '}
              — you can always fine-tune based on your progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
