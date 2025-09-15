# Multilingual Internship Recommendation System - Frontend

A comprehensive React frontend for an Internship Recommendation System with multilingual support, accessibility features, and professional UI design inspired by SIH (Smart India Hackathon) problem statement cards.

## 🌟 Features

### 1. **Multilingual Support**
- Support for **13 major Indian languages**:
  - English, Hindi, Tamil, Telugu, Kannada, Malayalam
  - Bengali, Gujarati, Marathi, Punjabi, Odia, Assamese, Urdu
- Dynamic language switching with real-time translation
- Comprehensive translation dictionary for all UI elements

### 2. **Smart Autocomplete System**
- **Education-based Department Suggestions**: When B.Tech is selected, shows relevant departments (CSE, IT, AIML, ECE, EEE, etc.)
- **Dynamic Backend Integration**: Fetches suggestions from backend APIs for:
  - Sector suggestions
  - Location suggestions  
  - Skills suggestions
- **Debounced Search**: Optimized API calls with 300ms delay
- **Real-time Filtering**: Shows suggestions as user types (minimum 2 characters)

### 3. **Professional UI Cards**
- **SIH-inspired Design**: Cards styled similar to Smart India Hackathon problem statements
- **Comprehensive Information Display**:
  - Bold internship title
  - Company name
  - Location
  - Stipend (highlighted in green)
  - Skills (displayed as colorful tags)
  - Recommendation score (badge-style)
  - Detailed reasons for recommendation
- **Interactive Elements**: Hover effects and smooth transitions

### 4. **Accessibility Features**
- **Text-to-Speech**: 🔊 Read button on each card
- **Web Speech API Integration**: Reads entire card content aloud
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Support for high contrast preferences
- **Reduced Motion**: Respects user's motion preferences

### 5. **Professional Styling**
- **Modern Design**: Glassmorphism effects with backdrop blur
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Gradient Backgrounds**: Beautiful color schemes
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Clean, readable fonts

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://127.0.0.1:5000`

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Open Browser**:
   Navigate to `http://localhost:3000`

## 📱 Usage

### Language Selection
- Use the language dropdown in the header to switch between languages
- All form labels, buttons, and content will update instantly

### Form Filling
1. **Education**: Select from dropdown or type to see suggestions
2. **Department**: Automatically populated based on education selection
3. **Sector**: Type to see dynamic suggestions from backend
4. **Location**: Type to see location suggestions
5. **Skills**: Enter comma-separated skills with autocomplete support

### Viewing Results
- Internships are displayed as professional cards
- Each card shows comprehensive information
- Click the 🔊 button to hear the card content read aloud
- Cards are sorted by recommendation score

## 🎨 Design Features

### Card Layout
```
┌─────────────────────────────────────┐
│ 🎯 Internship Title            🔊    │
├─────────────────────────────────────┤
│ Company: TechCorp                    │
│ Location: Bangalore                  │
│ Stipend: ₹25,000                    │
│ Skills: [Python] [React] [Node.js]  │
│ Score: 8                             │
├─────────────────────────────────────┤
│ Why Recommended?                    │
│ ✓ Education matches: B.Tech         │
│ ✓ Department matches: CSE            │
│ ✓ Skill match: Python, React        │
└─────────────────────────────────────┘
```

### Color Scheme
- **Primary**: Gradient from #667eea to #764ba2
- **Success**: #27ae60 (for stipend)
- **Skills**: Gradient from #f093fb to #f5576c
- **Background**: Gradient with glassmorphism effects

## 🔧 Technical Implementation

### Components Structure
```
App.js
├── Header (Language Selector)
├── Search Form
│   ├── Education Input (with department suggestions)
│   ├── Department Input
│   ├── Sector Input (with backend autocomplete)
│   ├── Location Input (with backend autocomplete)
│   ├── Skills Input (with backend autocomplete)
│   └── Submit Button
└── Results Section
    └── InternshipCard Components
        ├── Card Header (Title + Read Button)
        ├── Company Info
        ├── Location & Stipend
        ├── Skills Tags
        ├── Score Badge
        └── Reasons Section
```

### Key Features Implementation

#### 1. **Translation System**
```javascript
const t = translations[language];
// Dynamic translation for all UI elements
```

#### 2. **Autocomplete Logic**
```javascript
// Debounced autocomplete with backend integration
const debouncedAutocomplete = (field, query, delay = 300) => {
  // API call to backend autocomplete endpoints
};
```

#### 3. **Speech Synthesis**
```javascript
const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'en' ? 'en-US' : 'hi-IN';
  speechSynthesis.speak(utterance);
};
```

## 📊 API Integration

### Backend Endpoints Used
- `POST /find_internships` - Get internship recommendations
- `GET /autocomplete/sector?q={query}` - Sector suggestions
- `GET /autocomplete/location?q={query}` - Location suggestions
- `GET /autocomplete/skills?q={query}` - Skills suggestions

### Request Format
```javascript
{
  "education": "B.Tech",
  "department": "CSE",
  "sector": "Technology",
  "location": "Bangalore",
  "skills": ["Python", "JavaScript", "React"]
}
```

### Response Format
```javascript
[
  {
    "title": "Software Development Intern",
    "company": "TechCorp",
    "location": "Bangalore",
    "stipend": "₹25,000",
    "skills": ["Python", "JavaScript", "React"],
    "score": 8,
    "reasons": [
      "Education matches: B.Tech",
      "Department matches: CSE",
      "Skill match: Python, JavaScript, React"
    ]
  }
]
```

## 🎯 Accessibility Features

### WCAG Compliance
- **Keyboard Navigation**: All elements accessible via keyboard
- **Screen Reader Support**: Proper semantic HTML and ARIA labels
- **Color Contrast**: High contrast ratios for readability
- **Focus Indicators**: Clear focus states for navigation
- **Text-to-Speech**: Audio support for all content

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layout
- **Desktop Enhanced**: Full feature set on larger screens

## 🚀 Performance Optimizations

- **Debounced API Calls**: Prevents excessive backend requests
- **Memoized Components**: Optimized re-rendering
- **Lazy Loading**: Efficient resource loading
- **CSS Optimizations**: Hardware-accelerated animations

## 🔮 Future Enhancements

- **Voice Input**: Speech-to-text for form filling
- **Advanced Filtering**: More sophisticated search options
- **Favorites System**: Save preferred internships
- **Comparison Tool**: Compare multiple internships
- **Export Features**: PDF/CSV export of results
- **Social Sharing**: Share internships on social media

## 📝 Development Notes

### File Structure
```
src/
├── App.js              # Main application component
├── App.css             # Professional styling
├── translations.js     # Multilingual support
└── README.md          # Documentation
```

### Dependencies
- `react` - Core React library
- `axios` - HTTP client for API calls
- `speechSynthesis` - Web Speech API for TTS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for accessibility and multilingual support**