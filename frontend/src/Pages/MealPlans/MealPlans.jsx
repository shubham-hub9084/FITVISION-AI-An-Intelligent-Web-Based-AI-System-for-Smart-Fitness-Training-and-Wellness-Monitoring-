import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { GOALS, ACTIVITY_LEVELS, DIET_TYPES } from '../../data/mealData';
import { calculateStats, generateWeeklyPlan } from '../../utils/mealPlanGenerator';
import BackButton from '../../components/BackButton';

const MealPlans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    calorieTarget: 2500,
    numberOfMeals: 4,
    dietaryPreferences: {
      vegan: false,
      vegetarian: false,
      eggetarian: false,
      omitNuts: false,
      highProtein: false,
      lowCarb: false,
      keto: false,
      allergies: []
    },
    customAllergies: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [calculatedStats, setCalculatedStats] = useState({ bmr: 0, tdee: 0, recommended: 0, isCapped: false });
  const [isFromCalculator, setIsFromCalculator] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    if (location.state) {
      const { age, sex, gender, height, weight, activity, goal, targetCalories } = location.state;

      const activityMap = {
        'light': 'light',
        'moderate': 'moderate',
        'active': 'active',
      };
      const goalMap = {
        'lose': 'lose-weight',
        'maintain': 'healthy-weight',
        'gain': 'muscle-gain',
        'lose-weight': 'lose-weight',
        'healthy-weight': 'healthy-weight',
        'muscle-gain': 'muscle-gain'
      };

      const updates = {
        age: age || '',
        gender: gender || sex || '',
        height: height || '',
        weight: weight || '',
        activityLevel: activityMap[activity] || '',
        goal: goalMap[goal] || goal || '',
        calorieTarget: targetCalories || 2500
      };

      setFormData(prev => ({ ...prev, ...updates }));
      setIsFromCalculator(true);

      // Auto-generate plan immediately
      const fullData = { ...formData, ...updates };
      const plan = generateWeeklyPlan(fullData);
      setGeneratedPlan(plan);
      setCurrentStep(5);

    } else {
      const savedData = localStorage.getItem('userProfile');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(prev => ({
            ...prev,
            name: parsed.name || '',
            age: parsed.age || '',
            gender: parsed.gender || parsed.sex || '',
            height: parsed.height || '',
            weight: parsed.weight || '',
            activityLevel: parsed.activityLevel || ''
          }));
        } catch (e) {
          console.error('Error parsing saved data:', e);
        }
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Only recalculate if NOT from calculator (or if user manually changed inputs)
    if (!isFromCalculator && formData.age && formData.gender && formData.height && formData.weight && formData.activityLevel && formData.goal) {
      const stats = calculateStats(formData);
      setCalculatedStats(stats);
      setFormData(prev => ({ ...prev, calorieTarget: stats.recommended }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.age, formData.gender, formData.height, formData.weight, formData.activityLevel, formData.goal]);

  const handleInputChange = (field, value) => {
    setIsFromCalculator(false); // Reset flag if user edits manually
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDietaryChange = (field, value) => {
    setFormData(prev => {
      const newPrefs = { ...prev.dietaryPreferences, [field]: value };
      // Logic to uncheck conflicting diets
      if (field === 'vegan' && value) { newPrefs.vegetarian = true; newPrefs.eggetarian = false; newPrefs.nonVeg = false; }
      if (field === 'vegetarian' && value) { newPrefs.eggetarian = false; newPrefs.nonVeg = false; }
      if (field === 'keto' && value) { newPrefs.lowCarb = true; }
      return { ...prev, dietaryPreferences: newPrefs };
    });
  };

  const handleAllergyChange = (allergy) => {
    setFormData(prev => {
      const allergies = prev.dietaryPreferences.allergies;
      const newAllergies = allergies.includes(allergy) ? allergies.filter(a => a !== allergy) : [...allergies, allergy];
      return { ...prev, dietaryPreferences: { ...prev.dietaryPreferences, allergies: newAllergies } };
    });
  };

  const handleGenerate = () => {
    const plan = generateWeeklyPlan(formData);
    setGeneratedPlan(plan);
    setCurrentStep(5);
  };

  // Handle download ( DOWNLOAD MEAL PLAN )

  const handleDownload = () => {
    if (!generatedPlan) return;

    let content = `FitVision AI - Weekly Meal Plan\n`;
    content += `Goal: ${formData.goal.replace('-', ' ')}\n`;
    content += `Calories: ${formData.calorieTarget} kcal\n\n`;

    generatedPlan.forEach(day => {
      content += `----------------------------------------\n`;
      content += `${day.day} (${day.date})\n`;
      content += `----------------------------------------\n`;
      day.meals.forEach(meal => {
        content += `[${meal.name}] ${meal.title} (${meal.calories} kcal)\n`;
        content += `   ${meal.description}\n`;
        content += `   Ingredients: ${meal.ingredients.join(', ')}\n`;
        content += `   Macros: P: ${meal.macros.protein} | C: ${meal.macros.carbs} | F: ${meal.macros.fat}\n\n`;
      });
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitvision-meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getIconColorClasses = (color) => {
    const colors = {
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500'
    };
    return colors[color] || colors.emerald;
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
    else if (currentStep === 4) handleGenerate();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.goal !== '';
      case 2: return formData.age && formData.gender && formData.height && formData.weight && formData.activityLevel;
      case 3: return formData.calorieTarget >= 1200 && formData.calorieTarget <= 4000;
      case 4: return true;
      default: return false;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-down">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">AI Powered Meal Planner</h1>
            <p className="text-lg sm:text-xl text-emerald-100">Personalized daily nutrition tailored to your goals</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <BackButton onClick={handleBack} />
        {currentStep <= 4 && (
          <div className="mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}>
                      {currentStep > step ? <i className="ri-check-line text-xl"></i> : step}
                    </div>
                    <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 text-center hidden sm:block">
                      {step === 1 && 'Goal'} {step === 2 && 'Profile'} {step === 3 && 'Calories'} {step === 4 && 'Preferences'}
                    </p>
                  </div>
                  {step < 4 && <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-emerald-600' : 'bg-gray-200 dark:bg-slate-700'}`}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 1: What's Your Goal?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleInputChange('goal', goal.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${formData.goal === goal.id ? `border-${goal.color}-500 bg-${goal.color}-50 dark:bg-${goal.color}-900/20` : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${goal.color}-100 dark:bg-${goal.color}-900/30`}>
                    <i className={`${goal.icon} text-xl text-${goal.color}-600 dark:text-${goal.color}-400`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{goal.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 2: Personal Profile</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name (Optional)</label>
                <input type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age *</label>
                <input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="e.g., 25" min="13" max="100" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender *</label>
                <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Height (cm) *</label>
                <input type="number" value={formData.height} onChange={(e) => handleInputChange('height', e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="e.g., 175" min="1" max="300" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (kg) *</label>
                <input type="number" value={formData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white" placeholder="e.g., 75" min="1" max="500" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activity Level *</label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleInputChange('activityLevel', level.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${formData.activityLevel === level.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}`}
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{level.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 3: Daily Calorie Target</h2>

            {/* Stats cards removed as per request */}

            {calculatedStats.isCapped && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6 flex items-start gap-3">
                <i className="ri-alert-line text-orange-600 dark:text-orange-400 text-xl mt-0.5"></i>
                <div>
                  <h4 className="font-bold text-orange-900 dark:text-orange-200">Maximum Calorie Limit Reached</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-300">Your calculated requirement is above 4000 kcal, but the meal plan is capped at 4000 kcal for safety and practicality.</p>
                </div>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 border border-gray-200 dark:border-slate-600">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Calories</label>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formData.calorieTarget} kcal</span>
              </div>
              <input
                type="range"
                min="1200"
                max="4000"
                step="50"
                value={formData.calorieTarget}
                onChange={(e) => handleInputChange('calorieTarget', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>1200</span>
                <span>4000 (Max)</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Step 4: Preferences</h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diet Type</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {DIET_TYPES.map(type => (
                  <label key={type.id} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.dietaryPreferences[type.id] ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'}`}>
                    <input
                      type="checkbox"
                      checked={formData.dietaryPreferences[type.id]}
                      onChange={(e) => handleDietaryChange(type.id, e.target.checked)}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-3 font-medium text-gray-900 dark:text-white capitalize">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>


          </div>
        )}

        {currentStep === 5 && generatedPlan && (
          <div className="space-y-6" data-aos="fade-up">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your AI Generated Weekly Plan</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{formData.calorieTarget} kcal • {formData.goal.replace('-', ' ')}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDownload} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2">
                    <i className="ri-download-line"></i> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button onClick={() => { setCurrentStep(1); setGeneratedPlan(null); }} className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-lg font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    Create New
                  </button>
                </div>
              </div>
            </div>

            {generatedPlan.map((dayPlan, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                <div className="bg-gray-50 dark:bg-slate-700 p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{dayPlan.day}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{dayPlan.date}</span>
                </div>
                <div className="p-4 space-y-4">
                  {dayPlan.meals.map((meal, j) => (
                    <div key={j} className="flex flex-col sm:flex-row gap-5 p-5 rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${getIconColorClasses(meal.color)} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                        <i className={`${meal.icon} text-2xl`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <div>
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{meal.name}</h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">{meal.title}</p>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                            {meal.calories} kcal
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{meal.description}</p>

                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Ingredients</p>
                          <div className="flex flex-wrap gap-2">
                            {meal.ingredients.map((ing, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-slate-700 text-xs text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-600">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-50 dark:border-slate-700">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Protein</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{meal.macros.protein}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Carbohydrate</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{meal.macros.carbs}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Fat</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{meal.macros.fat}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep <= 4 && (
          <div className="mt-8 flex justify-between">
            <button onClick={prevStep} disabled={currentStep === 1} className={`px-6 py-3 rounded-lg font-semibold ${currentStep === 1 ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600'}`}>
              Previous
            </button>
            <button onClick={nextStep} disabled={!canProceed()} className={`px-6 py-3 rounded-lg font-semibold ${canProceed() ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}>
              {currentStep === 4 ? 'Generate Plan' : 'Next Step'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlans;
