import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { translations, languageNames } from "./translations";
import MultiTagInput from "./MultiTagInput";
import { predefinedOptions, getDepartmentsForEducation } from "./predefinedOptions";

function App() {
  const [formData, setFormData] = useState({
    education: [],
    department: [],
    sector: [],
    location: [],
    skills: []
  });
  const [results, setResults] = useState({ best_fit: [], growth: [], alternative: [], learningPaths: [] });
  const [filteredResults, setFilteredResults] = useState({ best_fit: [], growth: [], alternative: [], learningPaths: [] });
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minStipend: '',
    maxStipend: '',
    location: '',
    skill: ''
  });
  const [suggestions, setSuggestions] = useState({
    education: [],
    department: [],
    sector: [],
    location: [],
    skills: []
  });
  const [showSuggestions, setShowSuggestions] = useState({
    education: false,
    department: false,
    sector: false,
    location: false,
    skills: false
  });
  const [speechState, setSpeechState] = useState({
    isPlaying: false,
    isPaused: false,
    currentCard: null
  });
  const [speechSettings, setSpeechSettings] = useState({
    rate: 0.8,
    pitch: 1.1,
    volume: 1
  });

  const t = translations[language];
  const debounceRefs = useRef({});
  const speechRef = useRef(null);

  // Filter results based on current filters
  useEffect(() => {
    const applyFilters = (items) => {
      return items.filter(item => {
        // Stipend filter
        if (filters.minStipend && parseInt(item.stipend) < parseInt(filters.minStipend)) return false;
        if (filters.maxStipend && parseInt(item.stipend) > parseInt(filters.maxStipend)) return false;
        
        // Location filter
        if (filters.location && !item.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        
        // Skill filter
        if (filters.skill && !item.skills.some(skill => 
          skill.toLowerCase().includes(filters.skill.toLowerCase())
        )) return false;
        
        return true;
      });
    };

    setFilteredResults({
      best_fit: applyFilters(results.best_fit),
      growth: applyFilters(results.growth),
      alternative: applyFilters(results.alternative),
      learningPaths: results.learningPaths // Learning paths don't need filtering
    });
  }, [results, filters]);

  // Debounced autocomplete function
  const debouncedAutocomplete = (field, query, delay = 300) => {
    if (debounceRefs.current[field]) {
      clearTimeout(debounceRefs.current[field]);
    }
    
    debounceRefs.current[field] = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const response = await axios.get(`http://127.0.0.1:4000/autocomplete/${field}?q=${query}`);
          setSuggestions(prev => ({ ...prev, [field]: response.data }));
        } catch (error) {
          console.error(`Error fetching ${field} suggestions:`, error);
        }
      } else {
        setSuggestions(prev => ({ ...prev, [field]: [] }));
      }
    }, delay);
  };

  const handleTagChange = (field, tags) => {
    setFormData({ ...formData, [field]: tags });
    
    // Handle department suggestions based on education
    if (field === "education" && tags.length > 0) {
      const latestEducation = tags[tags.length - 1];
      const departments = getDepartmentsForEducation(latestEducation);
      setSuggestions(prev => ({ ...prev, department: departments }));
    }
  };

  const handleInputChange = (field, value) => {
    if (["sector", "location", "skills"].includes(field)) {
      debouncedAutocomplete(field, value);
    }
  };

  const handleSuggestionClick = (field, suggestion) => {
    setFormData({ ...formData, [field]: suggestion });
    setShowSuggestions(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const submitData = {
      education: formData.education[0] || "",
      department: formData.department[0] || "",
      sector: formData.sector[0] || "",
      location: formData.location[0] || "",
      skills: formData.skills
    };
    try {
      // Try Node backend first
      const resNode = await axios.post("http://127.0.0.1:4000/recommend", submitData, { timeout: 4000 });
      const data = resNode?.data;
      const hasAny = !!(data && ((data.best_fit && data.best_fit.length) || (data.growth && data.growth.length) || (data.alternative && data.alternative.length)));
      if (hasAny) {
        setResults({
          best_fit: data.best_fit || [],
          growth: data.growth || [],
          alternative: data.alternative || [],
          learningPaths: data.learningPaths || []
        });
        return;
      }
      // Fall through to Flask if empty
    } catch (e) {
      // Ignore and fall back to Flask
    }
    try {
      // Fallback: Flask backend
      const resFlask = await axios.post("http://127.0.0.1:5000/find_internships", submitData, { timeout: 4000 });
      const arr = Array.isArray(resFlask.data) ? resFlask.data : [];
      // Map to categories: treat as best_fit list
      setResults({ best_fit: arr.filter(x => (x && typeof x.score === 'number' ? x.score > 0 : true)), growth: [], alternative: [], learningPaths: [] });
    } catch (error) {
      console.error("Error fetching internships (both backends):", error);
      setResults({ best_fit: [], growth: [], alternative: [], learningPaths: [] });
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text, cardIndex) => {
    if (!('speechSynthesis' in window)) return;

    // If clicking the same card that's currently playing/paused
    if (speechState.currentCard === cardIndex) {
      if (speechState.isPlaying) {
        // Currently playing - pause it
        speechSynthesis.pause();
        setSpeechState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
      } else if (speechState.isPaused) {
        // Currently paused - resume it
        speechSynthesis.resume();
        setSpeechState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      } else {
        // Stopped - start fresh
        startSpeech(text, cardIndex);
      }
    } else {
      // Different card - stop current and start new
      speechSynthesis.cancel();
      startSpeech(text, cardIndex);
    }
  };

  const startSpeech = (text, cardIndex) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Enhanced language mapping with voice selection
    const languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ur': 'ur-IN'
    };
    
    utterance.lang = languageMap[language] || 'en-US';
    utterance.rate = speechSettings.rate;
    utterance.pitch = speechSettings.pitch;
    utterance.volume = speechSettings.volume;

    // Try to select appropriate voice for the language
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === utterance.lang && voice.name.includes('Google')
    ) || voices.find(voice => 
      voice.lang === utterance.lang
    ) || voices.find(voice => 
      voice.lang.startsWith(utterance.lang.split('-')[0])
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setSpeechState({ isPlaying: true, isPaused: false, currentCard: cardIndex });
    };

    utterance.onend = () => {
      setSpeechState({ isPlaying: false, isPaused: false, currentCard: null });
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setSpeechState({ isPlaying: false, isPaused: false, currentCard: null });
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  // const InternshipCard = ({ internship, index }) => {
  //   const reasonsOrNarratives = (internship.narratives && internship.narratives.length ? internship.narratives : (internship.reasons || []));
  //   const skillsArray = Array.isArray(internship.skills) ? internship.skills : [];
  //   const cardText = `${t.internshipTitle}: ${internship.title || ''}. ${t.company}: ${internship.company || ''}. ${t.location}: ${internship.location || ''}. ${t.stipend}: ${internship.stipend || ''}. ${t.skills}: ${skillsArray.join(", ")}. ${t.score}: ${internship.score ?? 0}. ${t.whyRecommended}: ${reasonsOrNarratives.join(". ")}`;

  //   const getSpeechButtonIcon = () => {
  //     if (speechState.currentCard === index) {
  //       if (speechState.isPlaying) return "⏸️";
  //       if (speechState.isPaused) return "▶️";
  //     }
  //     return "🔊";
  //   };

  //   return (
  //     <div className="internship-card">
  //       <div className="card-header">
  //         <h3 className="card-title">{internship.title}</h3>
  //         <button 
  //           className="read-button"
  //           onClick={() => speakText(cardText, index)}
  //           title={speechState.currentCard === index && speechState.isPlaying ? "Pause" : speechState.currentCard === index && speechState.isPaused ? "Resume" : t.readAloud}
  //         >
  //           {getSpeechButtonIcon()}
  //         </button>
  const InternshipCard = ({ internship, index }) => {
    const reasonsOrNarratives = (internship.narratives && internship.narratives.length 
      ? internship.narratives 
      : (internship.reasons || []));
    const skillsArray = Array.isArray(internship.skills) ? internship.skills : [];
  
    // Build card text in selected language
    const cardText = `
      ${t.internshipTitle}: ${internship.title || ''}.
      ${t.company}: ${internship.company || ''}.
      ${t.location}: ${internship.location || ''}.
      ${t.stipend}: ${internship.stipend || ''}.
      ${t.skills}: ${skillsArray.join(", ")}.
      ${t.score}: ${internship.score ?? 0}.
      ${t.whyRecommended}: ${reasonsOrNarratives.join(". ")}
    `;
  
    const getSpeechButtonIcon = () => {
      if (speechState.currentCard === index) {
        if (speechState.isPlaying) return "⏸️";
        if (speechState.isPaused) return "▶️";
      }
      return "🔊";
    };
  
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">{internship.title}</h3>
          <button
            className="ml-4 p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200 text-blue-600"
            onClick={() => speakText(cardText, index)}
            title={speechState.currentCard === index && speechState.isPlaying ? "Pause" : speechState.currentCard === index && speechState.isPaused ? "Resume" : t.readAloud}
          >
            <span className="text-lg">{getSpeechButtonIcon()}</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">{t.company}:</span>
            <span className="text-sm text-gray-900 font-medium">{internship.company}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">{t.location}:</span>
            <span className="text-sm text-gray-900">{internship.location}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">{t.stipend}:</span>
            <span className="text-sm text-green-600 font-semibold">₹{internship.stipend}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600">{t.skills}:</span>
            <div className="flex flex-wrap gap-1 max-w-xs">
              {skillsArray.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">{t.score}:</span>
            <span className="text-sm text-purple-600 font-semibold">{internship.score}</span>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">{t.whyRecommended}</h4>
            <ul className="space-y-1">
              {reasonsOrNarratives.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start">
                  <span className="text-green-500 mr-2 mt-0.5">✔</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const LearningPathCard = ({ learningPath, index }) => {
    const cardText = `
      Learning Path: ${learningPath.title}.
      Description: ${learningPath.description}.
      Duration: ${learningPath.duration}.
      Difficulty: ${learningPath.difficulty}.
      Skills to learn: ${learningPath.skills.join(", ")}.
      Resources: ${learningPath.resources.join(", ")}
    `;

    const getSpeechButtonIcon = () => {
      if (speechState.currentCard === `learning-${index}`) {
        if (speechState.isPlaying) return "⏸️";
        if (speechState.isPaused) return "▶️";
      }
      return "🔊";
    };

    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border border-purple-200 p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-purple-900 leading-tight">{learningPath.title}</h3>
          <button
            className="ml-4 p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors duration-200 text-purple-600"
            onClick={() => speakText(cardText, `learning-${index}`)}
            title={speechState.currentCard === `learning-${index}` && speechState.isPlaying ? "Pause" : speechState.currentCard === `learning-${index}` && speechState.isPaused ? "Resume" : t.readAloud}
          >
            <span className="text-lg">{getSpeechButtonIcon()}</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-700 text-sm leading-relaxed">{learningPath.description}</p>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Duration:</span>
            <span className="text-sm text-purple-600 font-medium">{learningPath.duration}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-600">Difficulty:</span>
            <span className="text-sm text-orange-600 font-medium">{learningPath.difficulty}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-600">Skills:</span>
            <div className="flex flex-wrap gap-1 max-w-xs">
              {learningPath.skills.map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">Resources:</h4>
            <ul className="space-y-1">
              {learningPath.resources.map((resource, idx) => (
                <li key={idx} className="text-sm text-purple-700 flex items-start">
                  <span className="text-purple-500 mr-2 mt-0.5">📚</span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{t.find}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">{t.selectLanguage}:</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">🔊 Voice:</label>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-600">Rate:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechSettings.rate}
                    onChange={(e) => setSpeechSettings({...speechSettings, rate: parseFloat(e.target.value)})}
                    className="w-16"
                  />
                  <span className="text-xs text-gray-600 w-8">{speechSettings.rate.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-600">Pitch:</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechSettings.pitch}
                    onChange={(e) => setSpeechSettings({...speechSettings, pitch: parseFloat(e.target.value)})}
                    className="w-16"
                  />
                  <span className="text-xs text-gray-600 w-8">{speechSettings.pitch.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Search Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MultiTagInput
              label={t.education}
              placeholder={t.selectEducation}
              value={formData.education}
              onChange={(tags) => handleTagChange('education', tags)}
              suggestions={suggestions.education}
              preDefinedOptions={predefinedOptions.education}
            />

            <MultiTagInput
              label={t.department}
              placeholder={t.selectDepartment}
              value={formData.department}
              onChange={(tags) => handleTagChange('department', tags)}
              suggestions={suggestions.department}
              preDefinedOptions={getDepartmentsForEducation(formData.education[formData.education.length - 1])}
            />

            <MultiTagInput
              label={t.sector}
              placeholder={t.selectSector}
              value={formData.sector}
              onChange={(tags) => handleTagChange('sector', tags)}
              suggestions={suggestions.sector}
              preDefinedOptions={predefinedOptions.sectors}
              onInputChange={(value) => handleInputChange('sector', value)}
            />

            <MultiTagInput
              label={t.location}
              placeholder={t.selectLocation}
              value={formData.location}
              onChange={(tags) => handleTagChange('location', tags)}
              suggestions={suggestions.location}
              preDefinedOptions={predefinedOptions.locations}
              onInputChange={(value) => handleInputChange('location', value)}
            />

            <MultiTagInput
              label={t.skills}
              placeholder={t.enterSkills}
              value={formData.skills}
              onChange={(tags) => handleTagChange('skills', tags)}
              suggestions={suggestions.skills}
              preDefinedOptions={predefinedOptions.skills}
              onInputChange={(value) => handleInputChange('skills', value)}
            />

            <div className="flex items-end">
              <button 
                onClick={handleSubmit} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t.loading}
                  </div>
                ) : (
                  t.submit
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {(results?.best_fit?.length > 0 || results?.growth?.length > 0 || results?.alternative?.length > 0) && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Stipend (₹)</label>
                <input
                  type="number"
                  value={filters.minStipend}
                  onChange={(e) => setFilters({...filters, minStipend: e.target.value})}
                  placeholder="e.g., 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Stipend (₹)</label>
                <input
                  type="number"
                  value={filters.maxStipend}
                  onChange={(e) => setFilters({...filters, maxStipend: e.target.value})}
                  placeholder="e.g., 30000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  placeholder="e.g., Bangalore"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <input
                  type="text"
                  value={filters.skill}
                  onChange={(e) => setFilters({...filters, skill: e.target.value})}
                  placeholder="e.g., Python"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({minStipend: '', maxStipend: '', location: '', skill: ''})}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {(!loading && (!filteredResults?.best_fit?.length && !filteredResults?.growth?.length && !filteredResults?.alternative?.length && !filteredResults?.learningPaths?.length)) ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600">{t.noResults}</p>
            </div>
          ) : (
            <>
              {filteredResults?.learningPaths?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
                    <span className="mr-3">📚</span>
                    Learning Paths
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.learningPaths.map((learningPath, index) => (
                      <LearningPathCard key={`learning-${index}`} learningPath={learningPath} index={index} />
                    ))}
                  </div>
                </section>
              )}
              
              {filteredResults?.best_fit?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
                    <span className="mr-3">🎯</span>
                    Best Fit Internships ({filteredResults.best_fit.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.best_fit.map((internship, index) => (
                      <InternshipCard key={`best-${index}`} internship={internship} index={index} />
                    ))}
                  </div>
                </section>
              )}
              
              {filteredResults?.growth?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center">
                    <span className="mr-3">🚀</span>
                    Growth Potential ({filteredResults.growth.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.growth.map((internship, index) => (
                      <InternshipCard key={`growth-${index}`} internship={internship} index={index} />
                    ))}
                  </div>
                </section>
              )}
              
              {filteredResults?.alternative?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
                    <span className="mr-3">🌍</span>
                    Alternative Opportunities ({filteredResults.alternative.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.alternative.map((internship, index) => (
                      <InternshipCard key={`alt-${index}`} internship={internship} index={index} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
