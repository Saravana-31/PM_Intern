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
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
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

  const t = translations[language];
  const debounceRefs = useRef({});
  const speechRef = useRef(null);

  // Debounced autocomplete function
  const debouncedAutocomplete = (field, query, delay = 300) => {
    if (debounceRefs.current[field]) {
      clearTimeout(debounceRefs.current[field]);
    }
    
    debounceRefs.current[field] = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/autocomplete/${field}?q=${query}`);
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
    try {
      const submitData = {
        education: formData.education[0] || "", // Take first education if multiple
        department: formData.department[0] || "", // Take first department if multiple
        sector: formData.sector[0] || "", // Take first sector if multiple
        location: formData.location[0] || "", // Take first location if multiple
        skills: formData.skills // Skills as array
      };
      const res = await axios.post("http://127.0.0.1:5000/find_internships", submitData);
      setResults(res.data);
    } catch (error) {
      console.error("Error fetching internships:", error);
      setResults([]);
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
    
    // Set language based on selected language
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
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeechState({ isPlaying: true, isPaused: false, currentCard: cardIndex });
    };

    utterance.onend = () => {
      setSpeechState({ isPlaying: false, isPaused: false, currentCard: null });
    };

    utterance.onerror = () => {
      setSpeechState({ isPlaying: false, isPaused: false, currentCard: null });
    };

    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const InternshipCard = ({ internship, index }) => {
    const cardText = `${t.internshipTitle}: ${internship.title}. ${t.company}: ${internship.company}. ${t.location}: ${internship.location}. ${t.stipend}: ${internship.stipend}. ${t.skills}: ${internship.skills.join(", ")}. ${t.score}: ${internship.score}. ${t.whyRecommended}: ${internship.reasons.join(". ")}`;

    const getSpeechButtonIcon = () => {
      if (speechState.currentCard === index) {
        if (speechState.isPlaying) return "⏸️";
        if (speechState.isPaused) return "▶️";
      }
      return "🔊";
    };

    return (
      <div className="internship-card">
        <div className="card-header">
          <h3 className="card-title">{internship.title}</h3>
          <button 
            className="read-button"
            onClick={() => speakText(cardText, index)}
            title={speechState.currentCard === index && speechState.isPlaying ? "Pause" : speechState.currentCard === index && speechState.isPaused ? "Resume" : t.readAloud}
          >
            {getSpeechButtonIcon()}
          </button>
        </div>
        
        <div className="card-content">
          <div className="card-row">
            <span className="label">{t.company}:</span>
            <span className="value">{internship.company}</span>
          </div>
          
          <div className="card-row">
            <span className="label">{t.location}:</span>
            <span className="value">{internship.location}</span>
          </div>
          
          <div className="card-row">
            <span className="label">{t.stipend}:</span>
            <span className="value stipend">{internship.stipend}</span>
          </div>
          
          <div className="card-row">
            <span className="label">{t.skills}:</span>
            <div className="skills-container">
              {internship.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
          
          <div className="card-row">
            <span className="label">{t.score}:</span>
            <span className="value score">{internship.score}</span>
          </div>
          
          <div className="reasons-section">
            <h4 className="reasons-title">{t.whyRecommended}</h4>
            <ul className="reasons-list">
              {internship.reasons.map((reason, idx) => (
                <li key={idx} className="reason-item">✔ {reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">{t.find}</h1>
        
        <div className="language-selector">
          <label className="language-label">{t.selectLanguage}:</label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="language-dropdown"
          >
            {Object.entries(languageNames).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="app-main">
        <div className="search-form">
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

          <button 
            onClick={handleSubmit} 
            className="submit-button"
            disabled={loading}
          >
            {loading ? t.loading : t.submit}
          </button>
        </div>

        <div className="results-section">
          {results.filter(internship => internship.score > 0).length > 0 ? (
            <div className="results-grid">
              {results
                .filter(internship => internship.score > 0)
                .map((internship, index) => (
                  <InternshipCard key={index} internship={internship} index={index} />
                ))}
            </div>
          ) : (
            !loading && (
              <div className="no-results">
                <p>{t.noResults}</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
