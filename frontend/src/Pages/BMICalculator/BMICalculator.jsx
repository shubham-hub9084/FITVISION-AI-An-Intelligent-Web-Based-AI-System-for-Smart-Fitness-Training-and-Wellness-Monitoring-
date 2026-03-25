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

        if (!heightM || !weightKg) return;

        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        let category = '';
        let color = '';
        let message = '';
        let arrowPosition = 0;
        if (bmi < 18.5) {
            category = 'Underweight';
            color = 'text-blue-500';
            message = 'You may need to increase your calorie intake to reach a healthy weight.';
            arrowPosition = (bmi / 18.5) * 25;
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            color = 'text-emerald-500';
            message = 'Great job! You are at a healthy weight.';
            arrowPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            color = 'text-orange-500';
            message = 'Consider a balanced diet and regular exercise to manage your weight.';
            arrowPosition = 50 + ((bmi - 25) / 5) * 25;
        } else {
            category = 'Obese';
            color = 'text-red-500';
            message = 'It is recommended to consult a healthcare provider for a personalized plan.';
            arrowPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
        }

        setResult({ bmi, category, color, message, arrowPosition });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">


            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-down">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">BMI Calculator</h1>
                    <p className="text-xl text-emerald-100">Check your Body Mass Index to understand your health status</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-12">
                <BackButton className="text-white hover:text-emerald-100 mb-6" />
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-10 transition-colors duration-300" data-aos="fade-up">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enter Your Details</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Age <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">(2 - 120 yrs)</span>
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
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                        placeholder="e.g. 25"
                                        min="2"
                                        max="120"
                                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Height (cm) <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">(50 - 300 cm)</span>
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
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. 175"
                                    min="50"
                                    max="300"
                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Weight (kg) <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">(20 - 500 kg)</span>
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
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. 70"
                                    min="20"
                                    max="500"
                                    onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                                />
                            </div>

                            <button
                                onClick={calculateBMI}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Calculate BMI
                            </button>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-8 text-center border border-gray-100 dark:border-slate-600 h-full flex flex-col justify-center transition-colors duration-300">
                            {!result ? (
                                <div className="text-gray-500 dark:text-gray-400">
                                    <div className="w-20 h-20 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-calculator-line text-3xl text-gray-600 dark:text-gray-300"></i>
                                    </div>
                                    <p className="text-lg">Enter your details to see your BMI result</p>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <p className="text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide">Your BMI Score</p>
                                    <div className={`text-6xl font-bold ${result.color}`}>{result.bmi}</div>
                                    <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold bg-white dark:bg-slate-800 border shadow-sm ${result.color}`}>
                                        {result.category}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mt-4">{result.message}</p>

                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-600 relative">
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                            <div className="w-1/4 text-center">Underweight</div>
                                            <div className="w-1/4 text-center">Normal</div>
                                            <div className="w-1/4 text-center">Overweight</div>
                                            <div className="w-1/4 text-center">Obese</div>
                                        </div>
                                        <div className="relative h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden flex shadow-inner">
                                            <div className="w-1/4 bg-blue-500 h-full"></div>
                                            <div className="w-1/4 bg-emerald-500 h-full"></div>
                                            <div className="w-1/4 bg-orange-500 h-full"></div>
                                            <div className="w-1/4 bg-red-500 h-full"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1 font-medium">
                                            <div className="w-1/4 text-center">&lt; 18.5</div>
                                            <div className="w-1/4 text-center">18.5 - 24.9</div>
                                            <div className="w-1/4 text-center">25.0 - 29.9</div>
                                            <div className="w-1/4 text-center">&ge; 30.0</div>
                                        </div>
                                        <div className="absolute top-[34px] left-0 w-full">
                                            <div
                                                className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-800 dark:border-b-white transform -translate-x-1/2 transition-all duration-1000 ease-out drop-shadow-md"
                                                style={{ left: `${result.arrowPosition}%`, marginTop: '8px' }}
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
