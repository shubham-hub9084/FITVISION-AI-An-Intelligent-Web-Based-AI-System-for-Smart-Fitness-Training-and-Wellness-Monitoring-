import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import BackButton from '../components/BackButton';
import CameraWorkout from '../Pages/UserDashboard/CameraWorkout';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Workouts = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCameraWorkout, setShowCameraWorkout] = useState(false);


  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const workoutCategories = [
    { id: "all", name: "All Workouts", icon: "ri-grid-line" },
    { id: "strength", name: "Strength", icon: "ri-sword-line" },
    { id: "cardio", name: "Cardio", icon: "ri-heart-pulse-line" },
    { id: "flexibility", name: "Flexibility", icon: "ri-expand-diagonal-line" },
    { id: "hiit", name: "HIIT", icon: "ri-fire-line" },
    { id: "yoga", name: "Yoga", icon: "ri-leaf-line" }
  ];

  const workoutPrograms = [
    {
      id: 1,
      title: "Full Body Strength Builder",
      category: "strength",
      difficulty: "intermediate",
      duration: 45,
      calories: 380,
      exercises: 8,
      description: "Build total body strength with compound movements and progressive overload.",
      image: "https://readdy.ai/api/search-image?query=Athletic%20person%20performing%20strength%20training%20exercises%20with%20dumbbells%20in%20a%20modern%20minimalist%20gym%2C%20focused%20and%20determined%20expression%2C%20professional%20fitness%20photography%2C%20clean%20white%20background%20with%20subtle%20equipment%20visible%2C%20emphasizing%20proper%20form%20and%20muscle%20engagement&width=400&height=300&seq=workout1&orientation=landscape",
      trainer: "Sarah Johnson",
      rating: 4.8,
      completions: 12400
    },
    {
      id: 2,
      title: "HIIT Fat Burn Circuit",
      category: "hiit",
      difficulty: "advanced",
      duration: 30,
      calories: 450,
      exercises: 10,
      description: "High-intensity intervals designed to maximize calorie burn and boost metabolism.",
      image: "https://readdy.ai/api/search-image?query=Energetic%20athlete%20doing%20high%20intensity%20interval%20training%20burpees%2C%20dynamic%20action%20shot%2C%20modern%20fitness%20studio%20with%20minimal%20clean%20background%2C%20sweat%20and%20determination%20visible%2C%20professional%20sports%20photography&width=400&height=300&seq=workout2&orientation=landscape",
      trainer: "Mike Chen",
      rating: 4.9,
      completions: 18200
    },
    {
      id: 3,
      title: "Morning Yoga Flow",
      category: "yoga",
      difficulty: "beginner",
      duration: 20,
      calories: 120,
      exercises: 12,
      description: "Gentle morning sequence to wake up your body and improve flexibility.",
      image: "https://readdy.ai/api/search-image?query=Peaceful%20woman%20practicing%20yoga%20flow%20in%20warrior%20pose%2C%20serene%20expression%2C%20bright%20airy%20studio%20with%20natural%20light%2C%20minimal%20clean%20white%20background%2C%20plants%20and%20calm%20atmosphere%2C%20professional%20wellness%20photography&width=400&height=300&seq=workout3&orientation=landscape",
      trainer: "Emma Wilson",
      rating: 4.7,
      completions: 25600
    },
    {
      id: 4,
      title: "Cardio Endurance Builder",
      category: "cardio",
      difficulty: "intermediate",
      duration: 40,
      calories: 420,
      exercises: 6,
      description: "Boost cardiovascular fitness with progressive cardio intervals.",
      image: "https://readdy.ai/api/search-image?query=Fit%20person%20running%20on%20treadmill%20with%20perfect%20form%2C%20side%20profile%20view%2C%20modern%20gym%20with%20clean%20white%20walls%2C%20focused%20expression%20showing%20endurance%2C%20professional%20fitness%20photography%20with%20minimal%20equipment%20visible&width=400&height=300&seq=workout4&orientation=landscape",
      trainer: "David Martinez",
      rating: 4.6,
      completions: 15800
    },
    {
      id: 5,
      title: "Core & Abs Destroyer",
      category: "strength",
      difficulty: "intermediate",
      duration: 25,
      calories: 280,
      exercises: 10,
      description: "Target your core with effective exercises for definition and strength.",
      image: "https://readdy.ai/api/search-image?query=Athletic%20person%20performing%20plank%20exercise%20showing%20strong%20core%20muscles%2C%20determined%20face%2C%20clean%20modern%20fitness%20space%20with%20white%20background%2C%20professional%20form%20demonstration%2C%20minimal%20gym%20equipment%20visible&width=400&height=300&seq=workout5&orientation=landscape",
      trainer: "Lisa Anderson",
      rating: 4.8,
      completions: 21300
    },
    {
      id: 6,
      title: "Flexibility & Mobility",
      category: "flexibility",
      difficulty: "beginner",
      duration: 30,
      calories: 150,
      exercises: 15,
      description: "Improve range of motion and prevent injury with targeted stretches.",
      image: "https://readdy.ai/api/search-image?query=Person%20performing%20deep%20stretching%20exercise%20showing%20flexibility%2C%20calm%20and%20focused%20expression%2C%20bright%20minimalist%20studio%20with%20white%20background%2C%20professional%20wellness%20photography%2C%20clean%20and%20peaceful%20atmosphere&width=400&height=300&seq=workout6&orientation=landscape",
      trainer: "Alex Kim",
      rating: 4.7,
      completions: 19400
    }
  ];

  const aiFeatures = [
    {
      title: "Real-Time Form Analysis",
      description: "AI monitors your movements and provides instant feedback on exercise form",
      icon: "ri-eye-line",
      color: "emerald"
    },
    {
      title: "Automatic Rep Counting",
      description: "Never lose count again with intelligent rep detection",
      icon: "ri-refresh-line",
      color: "blue"
    },
    {
      title: "Personalized Adjustments",
      description: "AI adapts workout intensity based on your performance",
      icon: "ri-user-heart-line",
      color: "purple"
    },
    {
      title: "Injury Prevention",
      description: "Get alerts when form breaks down to prevent injuries",
      icon: "ri-shield-check-line",
      color: "orange"
    }
  ];

  const filteredWorkouts = workoutPrograms.filter((workout) => {
    const categoryMatch = selectedCategory === "all" || workout.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || workout.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {showCameraWorkout && <CameraWorkout onClose={() => setShowCameraWorkout(false)} />}



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="mb-12 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI-Enhanced Training</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/30" : feature.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30" : feature.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                  <i className={`${feature.icon} text-xl ${feature.color === "emerald" ? "text-emerald-600 dark:text-emerald-400" : feature.color === "blue" ? "text-blue-600 dark:text-blue-400" : feature.color === "purple" ? "text-purple-600 dark:text-purple-400" : "text-orange-600 dark:text-orange-400"}`}></i>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8" data-aos="fade-up">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {workoutCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 ${selectedCategory === category.id ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`}
                    >
                      <i className={category.icon}></i>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-48">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                <div className="relative">
                  <button
                    onClick={() => {
                      const select = document.getElementById("difficulty-select");
                      select?.focus();
                    }}
                    className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-left cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-center justify-between"
                  >
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{selectedDifficulty}</span>
                    <i className="ri-arrow-down-s-line text-gray-400"></i>
                  </button>
                  <select
                    id="difficulty-select"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer pr-8"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{filteredWorkouts.length} Workouts Available</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredWorkouts.map((workout, index) => (
              <div key={workout.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300" data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-slate-700">
                  <img src={workout.image} alt={workout.title} className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getDifficultyColor(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-black/70 text-white rounded text-xs flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      {workout.duration}m
                    </span>
                    <span className="px-2 py-1 bg-black/70 text-white rounded text-xs flex items-center gap-1">
                      <i className="ri-fire-line"></i>
                      {workout.calories} cal
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{workout.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{workout.description}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-emerald-600 dark:text-emerald-400 text-sm"></i>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{workout.trainer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="ri-star-fill text-yellow-400"></i>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{workout.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="ri-list-check text-emerald-600 dark:text-emerald-400"></i>
                      {workout.exercises} exercises
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-group-line text-gray-400"></i>
                      {workout.completions.toLocaleString()} completed
                    </span>
                  </div>

                  <button
                    onClick={() => setShowCameraWorkout(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="ri-play-line"></i>
                    Start Workout
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkouts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-line text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workouts found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters to see more results</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 sm:p-12 text-white text-center" data-aos="fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Transform Your Fitness?</h2>
          <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
            Start your AI-powered workout today and experience the future of personal training.
          </p>
          <button
            onClick={() => setShowCameraWorkout(true)}
            className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <i className="ri-camera-line"></i>
            Enable Camera &amp; Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
