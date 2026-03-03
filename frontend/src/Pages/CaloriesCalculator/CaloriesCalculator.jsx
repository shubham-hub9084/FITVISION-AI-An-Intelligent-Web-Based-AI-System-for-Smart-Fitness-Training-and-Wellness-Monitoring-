import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import BackButton from '../../components/BackButton';
import CalculatorFAQ from './CalculatorFAQ';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../../context/AuthContext';

const CaloriesCalculator = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Scenarios ...
  const [units, setUnits] = useState('metric'); // 'metric' or 'imperial'
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(175); // used when metric
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [weightKg, setWeightKg] = useState(75);
  const [weightLbs, setWeightLbs] = useState(165);
  const [activity, setActivity] = useState('moderate');

  // UI State
  const [showGainInfo, setShowGainInfo] = useState(false);

  // Calculation results
  const [results, setResults] = useState(null); // Object containing all scenarios
  const [selectedScenario, setSelectedScenario] = useState(null); // To show macros for a specific one

  // Macro preferences (hidden in basic view but used for calculation)
  const [proteinPerKg, setProteinPerKg] = useState(1.8);
  const [fatPerc, setFatPerc] = useState(25);

  // History
  const [history, setHistory] = useState([]);

  // Activity multipliers
  const activityMultipliers = {
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  // Helper: convert imperial to metric
  function heightToCm() {
    if (units === 'metric') return Number(heightCm);
    const totalInches = Number(heightFt) * 12 + Number(heightIn);
    return +(totalInches * 2.54).toFixed(2);
  }

  function weightToKg() {
    if (units === 'metric') return Number(weightKg);
    return +(Number(weightLbs) * 0.45359237).toFixed(2);
  }

  // BMR using Mifflin-St Jeor Equation
  function calculateBMR({ gender, age, weightKg, heightCm }) {
    const w = Number(weightKg);
    const h = Number(heightCm);
    const a = Number(age);
    const base = 10 * w + 6.25 * h - 5 * a;
    return gender === 'male' ? Math.round(base + 5) : Math.round(base - 161);
  }

  function calcTDEE(bmrVal, activityKey) {
    const multiplier = activityMultipliers[activityKey] || 1.2;
    return Math.round(bmrVal * multiplier);
  }

  // Calculate all scenarios
  function calculateAll() {
    const hc = heightToCm();
    const wk = weightToKg();
    const b = calculateBMR({ gender, age, weightKg: wk, heightCm: hc });
    const t = calcTDEE(b, activity);

    // Sync with User Profile if logged in
    if (user && updateProfile) {
      updateProfile({
        weight: wk,
        height: hc,
        activityLevel: activity
      });
    }

    const scenarios = {
      maintain: { calories: t, label: 'Maintain weight', percent: 100 },
      mildLoss: { calories: Math.round(t - 275), label: 'Mild weight loss', sub: '0.25 kg/week', percent: Math.round(((t - 275) / t) * 100) },
      loss: { calories: Math.round(t - 550), label: 'Weight loss', sub: '0.5 kg/week', percent: Math.round(((t - 550) / t) * 100) },
      extremeLoss: { calories: Math.round(t - 1100), label: 'Extreme weight loss', sub: '1 kg/week', percent: Math.round(((t - 1100) / t) * 100) },
      mildGain: { calories: Math.round(t + 275), label: 'Mild weight gain', sub: '0.25 kg/week', percent: Math.round(((t + 275) / t) * 100) },
      gain: { calories: Math.round(t + 550), label: 'Weight gain', sub: '0.5 kg/week', percent: Math.round(((t + 550) / t) * 100) },
      fastGain: { calories: Math.round(t + 1100), label: 'Fast weight gain', sub: '1 kg/week', percent: Math.round(((t + 1100) / t) * 100) },
    };

    setResults({ bmr: b, tdee: t, scenarios });
    setSelectedScenario(null); // Reset selection

    // Save to history (simplified)
    const snapshot = {
      id: Date.now(),
      date: new Date().toISOString(),
      inputs: { units, gender, age, heightCm: hc, weightKg: wk, activity },
      results: { bmr: b, tdee: t, scenarios }
    };
    const newHistory = [snapshot, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('fitvision_calcalc_history_v2', JSON.stringify(newHistory));
  }

  // Load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem('fitvision_calcalc_history_v2');
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  // Sync imperial/metric
  useEffect(() => {
    if (units === 'metric') {
      const kg = weightToKg();
      setWeightKg(kg);
      const cm = heightToCm();
      setHeightCm(cm);
    } else {
      const kg = Number(weightKg);
      const lbs = +(kg / 0.45359237).toFixed(1);
      setWeightLbs(lbs);
      const cm = Number(heightCm);
      const totalInches = +(cm / 2.54).toFixed(2);
      const ft = Math.floor(totalInches / 12);
      const inch = Math.round(totalInches - ft * 12);
      setHeightFt(ft);
      setHeightIn(inch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  const isValid = () => {
    if (age <= 0 || age > 120) return false;
    const hc = heightToCm();
    const wk = weightToKg();
    if (hc <= 0 || wk <= 0) return false;
    return true;
  };

  const handleScenarioClick = (key) => {
    const scenario = results.scenarios[key];
    let goal = 'healthy-weight';
    if (key.includes('Loss')) goal = 'lose-weight';
    else if (key.includes('Gain')) goal = 'muscle-gain';

    if (user && updateProfile) {
      updateProfile({ goal });
    }

    navigate('/meal-plans', {
      state: {
        age,
        gender,
        height: heightToCm(),
        weight: weightToKg(),
        activity,
        goal,
        targetCalories: scenario.calories
      }
    });
  };

  const handleDownload = () => {
    if (!results) return;

    const dataToSave = {
      date: new Date().toISOString(),
      inputs: {
        units,
        gender,
        age,
        height: units === 'metric' ? `${heightCm} cm` : `${heightFt}ft ${heightIn}in`,
        weight: units === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs`,
        activity
      },
      results: {
        bmr: results.bmr,
        tdee: results.tdee,
        scenarios: results.scenarios
      }
    };

    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitvision-calories-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-12 sm:py-16 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-down">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Calories Calculator</h1>
          <p className="text-xl text-emerald-100 font-medium">
            Calculate your daily calorie needs to maintain, lose, or gain weight
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <BackButton />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Left: Calculator Form */}
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-slate-700" data-aos="fade-up">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => setUnits('metric')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all ${units === 'metric'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  Metric Units
                </button>
                <button
                  onClick={() => setUnits('imperial')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-all ${units === 'imperial'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  US Units
                </button>
              </div>

              <div className="p-6 sm:p-10 space-y-6">
                {/* Age */}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <label htmlFor="age" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age</label>
                  <div className="flex items-center gap-4">
                    <input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full sm:w-32 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                      min={15}
                      max={80}
                      onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">years (15-80)</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gender</span>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${gender === 'male' ? 'border-emerald-600' : 'border-gray-400 group-hover:border-emerald-500'}`}>
                        {gender === 'male' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                      </div>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={(e) => setGender(e.target.value)}
                        className="hidden"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Male</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${gender === 'female' ? 'border-emerald-600' : 'border-gray-400 group-hover:border-emerald-500'}`}>
                        {gender === 'female' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                      </div>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={(e) => setGender(e.target.value)}
                        className="hidden"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Female</span>
                    </label>
                  </div>
                </div>

                {/* Height */}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start sm:items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 pt-2 sm:pt-0">Height</label>
                  {units === 'metric' ? (
                    <div className="relative w-full sm:w-48">
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(Number(e.target.value))}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                        min="1"
                        max="300"
                        onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                      />
                      <span className="absolute right-4 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 select-none">cm</span>
                    </div>
                  ) : (
                    <div className="flex gap-4 w-full sm:w-64">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(Number(e.target.value))}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                          min="1"
                          max="9"
                          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        />
                        <span className="absolute right-4 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 select-none">ft</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(Number(e.target.value))}
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                          min="0"
                          max="11"
                          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                        />
                        <span className="absolute right-4 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 select-none">in</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight</label>
                  <div className="relative w-full sm:w-48">
                    <input
                      type="number"
                      value={units === 'metric' ? weightKg : weightLbs}
                      onChange={(e) => units === 'metric' ? setWeightKg(Number(e.target.value)) : setWeightLbs(Number(e.target.value))}
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                      min="1"
                      max={units === 'metric' ? "500" : "1000"}
                      onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                    />
                    <span className="absolute right-4 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 select-none">{units === 'metric' ? 'kg' : 'lbs'}</span>
                  </div>
                </div>

                {/* Activity */}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-center gap-4">
                  <label htmlFor="activity" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity</label>
                  <select
                    id="activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full sm:max-w-md px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-shadow"
                  >
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="pt-6 sm:pl-[120px] flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={calculateAll}
                    disabled={!isValid()}
                    className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isValid()
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                      : 'bg-gray-400 cursor-not-allowed shadow-none'
                      }`}
                  >
                    Calculate Results
                  </button>
                  <button
                    onClick={() => {
                      setAge(25);
                      setHeightCm(175);
                      setWeightKg(75);
                      setActivity('moderate');
                      setResults(null);
                    }}
                    className="px-8 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-slate-700" data-aos="fade-up">
                <div className="bg-emerald-600 px-6 py-5 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <i className="ri-fire-line"></i> Daily Calorie Estimates
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDownload}
                      className="text-white/90 hover:text-white text-sm flex items-center transition-colors font-medium backdrop-blur-sm bg-white/10 px-3 py-1.5 rounded-lg hover:bg-white/20"
                      title="Download results as JSON"
                    >
                      <i className="ri-download-cloud-2-line mr-2"></i> Save
                    </button>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-8 border-l-4 border-emerald-500 pl-4 py-1 italic bg-gray-50 dark:bg-slate-700/30 rounded-r-lg">
                    Select any option below to instantly generate your <strong>personalized meal plan</strong> tailored to that calorie goal.
                  </p>

                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {/* Maintain */}
                        <tr
                          className="border-b border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-700/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 cursor-pointer transition-colors group"
                          onClick={() => handleScenarioClick('maintain')}
                        >
                          <td className="p-5 w-1/2 group-hover:pl-6 transition-all duration-300">
                            <div className="font-bold text-gray-900 dark:text-white text-lg">{results.scenarios.maintain.label}</div>
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              Generate Plan <i className="ri-arrow-right-line"></i>
                            </div>
                          </td>
                          <td className="p-5 text-right sm:text-left">
                            <div className="font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
                              {results.scenarios.maintain.calories.toLocaleString()}
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">kcal</span>
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{results.scenarios.maintain.percent}% TDEE</div>
                          </td>
                        </tr>

                        {/* Weight Loss Scenarios */}
                        {['mildLoss', 'loss', 'extremeLoss'].map((key) => (
                          <tr
                            key={key}
                            className="border-b last:border-0 border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors group"
                            onClick={() => handleScenarioClick(key)}
                          >
                            <td className="p-5 group-hover:pl-6 transition-all duration-300">
                              <div className="font-semibold text-gray-900 dark:text-white">{results.scenarios[key].label}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{results.scenarios[key].sub}</div>
                            </td>
                            <td className="p-5 text-right sm:text-left">
                              <div className={`font-bold text-xl ${key === 'extremeLoss' ? 'text-red-500 dark:text-red-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {results.scenarios[key].calories.toLocaleString()}
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">kcal</span>
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{results.scenarios[key].percent}% TDEE</div>
                            </td>
                          </tr>
                        ))}

                        {/* Weight Gain Scenarios (Conditional) */}
                        {showGainInfo && ['mildGain', 'gain', 'fastGain'].map((key) => (
                          <tr
                            key={key}
                            className="border-b last:border-0 border-gray-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-colors group"
                            onClick={() => handleScenarioClick(key)}
                          >
                            <td className="p-5 group-hover:pl-6 transition-all duration-300">
                              <div className="font-semibold text-gray-900 dark:text-white">{results.scenarios[key].label}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{results.scenarios[key].sub}</div>
                            </td>
                            <td className="p-5 text-right sm:text-left">
                              <div className="font-bold text-xl text-gray-800 dark:text-gray-200">
                                {results.scenarios[key].calories.toLocaleString()}
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">kcal</span>
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{results.scenarios[key].percent}% TDEE</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowGainInfo(!showGainInfo)}
                      className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-semibold flex items-center gap-1 transition-colors bg-emerald-50 dark:bg-slate-700 px-4 py-2 rounded-full"
                    >
                      {showGainInfo ? <i className="ri-arrow-up-s-line"></i> : <i className="ri-add-circle-line"></i>}
                      {showGainInfo ? 'Hide weight gain options' : 'View weight gain options'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right: FAQ & Info */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 transition-colors duration-300 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="ri-run-line text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activity Levels</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></div>
                  <div>
                    <strong className="block text-gray-900 dark:text-white text-sm mb-1">Sedentary / Light</strong>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Little to no exercise, desk job (1-3 days/week).
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></div>
                  <div>
                    <strong className="block text-gray-900 dark:text-white text-sm mb-1">Moderate</strong>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Moderate exercise or sports (3-5 days/week).
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></div>
                  <div>
                    <strong className="block text-gray-900 dark:text-white text-sm mb-1">Very Active</strong>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      Hard exercise or physical job (6-7 days/week).
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
                  Correct activity level is key for accurate results.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section - Full Width */}
        <div className="mt-14 sm:mt-24">
          <CalculatorFAQ />
        </div>
      </div>
    </div>
  );
};

export default CaloriesCalculator;
