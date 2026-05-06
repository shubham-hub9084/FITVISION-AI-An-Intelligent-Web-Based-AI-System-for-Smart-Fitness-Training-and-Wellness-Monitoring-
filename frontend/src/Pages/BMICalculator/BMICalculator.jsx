import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import BackButton from '../../components/BackButton';

const BMICalculator = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        sex: '',
        height: '',
        weight: ''
    });
    const [result, setResult] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 900, once: true });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateBMI = () => {
        const heightM = Number(formData.height) / 100;
        const weightKg = Number(formData.weight);
        const ageYears = Number(formData.age);
        const gender = formData.sex;

        if (!heightM || !weightKg) return;

        const bmiNum = (weightKg / (heightM * heightM));
        const bmi = bmiNum.toFixed(1);
        
        let category = '';
        let color = '';
        let message = '';
        let arrowPosition = 0;
        
        if (bmiNum < 18.5) {
            category = 'Underweight';
            color = 'text-blue-500';
            message = 'You may need to increase your calorie intake to reach a healthier weight.';
            arrowPosition = (bmiNum / 18.5) * 25;
        } else if (bmiNum >= 18.5 && bmiNum < 25) {
            category = 'Normal Weight';
            color = 'text-emerald-500';
            message = 'Great job! You are within the healthy body weight range.';
            arrowPosition = 25 + ((bmiNum - 18.5) / 6.5) * 25;
        } else if (bmiNum >= 25 && bmiNum < 30) {
            category = 'Overweight';
            color = 'text-orange-500';
            message = 'Consider a balanced diet and regular physical activity to manage your weight safely.';
            arrowPosition = 50 + ((bmiNum - 25) / 5) * 25;
        } else if (bmiNum >= 30 && bmiNum < 35) {
            category = 'Obese Class I';
            color = 'text-red-500';
            message = 'Aiming for a moderate weight loss can significantly improve your long-term health.';
            arrowPosition = 75 + ((bmiNum - 30) / 10) * 25;
        } else if (bmiNum >= 35 && bmiNum < 40) {
            category = 'Obese Class II';
            color = 'text-red-600';
            message = 'A structured weight loss program and consultation with a healthcare provider is recommended.';
            arrowPosition = 75 + ((bmiNum - 30) / 10) * 25;
        } else {
            category = 'Severe Obesity Class III';
            color = 'text-red-700';
            message = 'It is highly recommended to consult a healthcare provider for a personalized and medically supervised plan.';
            arrowPosition = 100;
        }

        // Estimate TDEE
        let tdee = 0;
        if (gender && ageYears) {
            let bmr = (10 * weightKg) + (6.25 * Number(formData.height)) - (5 * ageYears);
            bmr += (gender.toLowerCase() === 'male') ? 5 : -161;
            
            // Default to sedentary (1.2) multiplier since explicit activity level is omitted
            tdee = Math.round(bmr * 1.2);
        } else {
            tdee = Math.round(weightKg * 24 * 1.2); 
        }

        // Determine Adjustments and Goals
        let targetCalories = 0;
        let weeklyGoal = '';
        let advice = '';

        if (category === 'Underweight') {
            targetCalories = tdee + 400;
            weeklyGoal = 'Gain 0.25 - 0.5 kg / week';
            advice = 'Eat healthy, high-energy foods like nuts, avocados, and lean meats. Try light weightlifting to build strong muscles.';
        } else if (category === 'Normal Weight') {
            targetCalories = tdee;
            weeklyGoal = 'Maintain Current Weight';
            advice = 'You are perfectly balanced! Keep eating healthy meals and try to stay active a few times a week.';
        } else if (category === 'Overweight') {
            targetCalories = tdee - 500;
            weeklyGoal = 'Lose ~0.5 kg / week';
            advice = 'Try eating slightly less junk food and sweets. Drink more water and aim for a daily walk to burn extra calories.';
        } else if (category === 'Obese Class I') {
            targetCalories = tdee - 600;
            weeklyGoal = 'Lose 0.5 - 0.75 kg / week';
            advice = 'Start moving more with easy exercises like walking or swimming. Eat smaller meals, and fill half your plate with vegetables.';
        } else if (category === 'Obese Class II') {
            targetCalories = tdee - 750;
            weeklyGoal = 'Lose ~0.75 kg / week';
            advice = 'It is a good idea to talk to a doctor before starting a diet. For now, try avoiding sugary drinks and eating more plain vegetables.';
        } else {
            targetCalories = tdee - 1000;
            weeklyGoal = 'Lose 0.75 - 1.0 kg / week';
            advice = 'Please talk to a doctor to help you lose weight safely. Start by making very small, easy changes to what you eat every day.';
        }

        // Safety Floor
        const MIN_CALORIES_MALE = 1500;
        const MIN_CALORIES_FEMALE = 1200;
        const absoluteMin = (gender?.toLowerCase() === 'female') ? MIN_CALORIES_FEMALE : MIN_CALORIES_MALE;
        
        if (targetCalories < absoluteMin) targetCalories = absoluteMin;

        setResult({ bmi, category, color, message, arrowPosition, tdee, targetCalories, weeklyGoal, advice });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">


            <div className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 text-white py-8 sm:py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" data-aos="fade-down">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-sm">BMI Calculator</h1>
                    <p className="text-lg sm:text-xl text-emerald-50 font-medium drop-shadow-sm">Check your Body Mass Index to understand your health status</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <BackButton className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 text-lg transition-colors" />
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-emerald-500/10 dark:shadow-cyan-900/20 p-8 sm:p-12 transition-colors duration-300 border border-gray-100 dark:border-slate-700" data-aos="fade-up">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Enter Your Details</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="block text-base font-bold text-gray-800 dark:text-gray-300">
                                        Age <span className="text-gray-500 dark:text-gray-400 text-sm font-medium ml-1">(2 - 120 yrs)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '' || (Number(val) <= 120)) {
                                                handleInputChange(e);
                                            }
                                        }}
                                        className="w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all shadow-sm"
                                        placeholder="e.g. 25"
                                        min="2"
                                        max="120"
                                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-base font-bold text-gray-800 dark:text-gray-300">Gender</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all shadow-sm"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3 mt-6">
                                <label className="block text-base font-bold text-gray-800 dark:text-gray-300">
                                    Height (cm) <span className="text-gray-500 dark:text-gray-400 text-sm font-medium ml-1">(50 - 300 cm)</span>
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (Number(val) <= 300)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all shadow-sm"
                                    placeholder="e.g. 175"
                                    min="50"
                                    max="300"
                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                />
                            </div>

                            <div className="space-y-3 mt-6">
                                <label className="block text-base font-bold text-gray-800 dark:text-gray-300">
                                    Weight (kg) <span className="text-gray-500 dark:text-gray-400 text-sm font-medium ml-1">(20 - 500 kg)</span>
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (Number(val) <= 500)) {
                                            handleInputChange(e);
                                        }
                                    }}
                                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 dark:bg-slate-700/50 text-gray-900 dark:text-white transition-all shadow-sm"
                                    placeholder="e.g. 70"
                                    min="20"
                                    max="500"
                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                />
                            </div>

                            <button
                                onClick={calculateBMI}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 active:scale-95 transform hover:-translate-y-0.5 mt-4"
                            >
                                Calculate BMI
                            </button>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-8 sm:p-10 text-center border border-gray-100 dark:border-slate-600 h-full flex flex-col justify-center transition-colors duration-300 shadow-inner">
                            {!result ? (
                                <div className="text-gray-500 dark:text-gray-400">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-calculator-line text-3xl text-gray-600 dark:text-gray-300"></i>
                                    </div>
                                    <p className="text-lg">Enter your details to see your BMI result</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fade-in flex flex-col h-full justify-center">
                                    <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 uppercase tracking-widest text-base sm:text-lg mb-1">Your BMI Score</p>
                                    <div className={`text-8xl sm:text-9xl font-extrabold drop-shadow-sm ${result.color} leading-none`}>{result.bmi}</div>
                                    <div>
                                        <div className={`inline-block px-6 py-2 rounded-full text-base sm:text-lg font-extrabold bg-white dark:bg-slate-800 border-2 shadow-md ${result.color} dark:border-slate-700`}>
                                            {result.category}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 mt-4 text-base sm:text-lg leading-relaxed font-medium">{result.message}</p>

                                    {/* New BMI Recommendations Details */}
                                    <div className="mt-8 bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-xl shadow-gray-200/50 dark:shadow-none text-left animate-fade-in-up">
                                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-100 dark:border-slate-700 pb-3"><i className="ri-road-map-line mr-3 text-teal-500 text-2xl"></i> Your Action Plan</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
                                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-700/60 dark:to-slate-800/90 p-5 rounded-xl border border-emerald-100/50 dark:border-slate-600/50 flex flex-col justify-center transform transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase mb-2 tracking-wider flex items-center"><i className="ri-fire-fill text-orange-500 mr-2 text-lg"></i> Target Intake</p>
                                                <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">{result.targetCalories} <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">kcal/day</span></p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/60 dark:to-slate-800/90 p-5 rounded-xl border border-blue-100/50 dark:border-slate-600/50 flex flex-col justify-center transform transition-transform hover:-translate-y-1 shadow-sm hover:shadow-md">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase mb-2 tracking-wider flex items-center"><i className="ri-focus-2-line text-blue-500 mr-2 text-lg"></i> Weekly Goal</p>
                                                <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">{result.weeklyGoal}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/40 dark:to-teal-900/40 p-5 rounded-xl border border-emerald-500/20 dark:border-emerald-500/10 shadow-inner">
                                            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-extrabold uppercase mb-2 flex items-center tracking-wider"><i className="ri-lightbulb-flash-fill mr-2 text-xl"></i> Recommendation</p>
                                            <p className="text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">{result.advice}</p>
                                        </div>
                                        {result.category.includes('Obese') && (
                                            <p className="text-sm text-red-600 dark:text-red-400 mt-5 flex items-start bg-red-50 dark:bg-red-900/30 p-4 rounded-xl border border-red-200 dark:border-red-900/40 shadow-sm"><i className="ri-alarm-warning-fill mr-3 mt-0.5 text-xl"></i> <span><strong>Medical Notice:</strong> Significant weight adjustments should be supervised by a healthcare professional.</span></p>
                                        )}
                                    </div>

                                    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-slate-600 relative">
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-3 font-bold px-1">
                                            <div className="w-1/4 text-center">Underweight</div>
                                            <div className="w-1/4 text-center">Normal</div>
                                            <div className="w-1/4 text-center">Overweight</div>
                                            <div className="w-1/4 text-center">Obese</div>
                                        </div>
                                        <div className="relative h-4 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden flex shadow-inner">
                                            <div className="w-1/4 bg-blue-500 h-full"></div>
                                            <div className="w-1/4 bg-emerald-500 h-full"></div>
                                            <div className="w-1/4 bg-orange-500 h-full"></div>
                                            <div className="w-1/4 bg-red-500 h-full"></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-2 px-1 font-semibold">
                                            <div className="w-1/4 text-center">&lt; 18.5</div>
                                            <div className="w-1/4 text-center">18.5 - 24.9</div>
                                            <div className="w-1/4 text-center">25.0 - 29.9</div>
                                            <div className="w-1/4 text-center">&ge; 30.0</div>
                                        </div>
                                        <div className="absolute top-[46px] left-0 w-full">
                                            <div
                                                className="absolute w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[10px] border-b-gray-800 dark:border-b-white transform -translate-x-1/2 transition-all duration-1000 ease-out drop-shadow-lg"
                                                style={{ left: `${result.arrowPosition}%`, marginTop: '10px' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BMICalculator;
