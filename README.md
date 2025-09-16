# AI-Based Internship Recommendation Engine for PM Internship Scheme

## 🎯 Problem Statement 25034 Solution

A comprehensive internship recommendation system that uses AI to match students with relevant internship opportunities while ensuring fairness and accessibility across different regions and skill levels.

## ✨ Key Features

### 🧠 Smart Recommendation Engine
- **Skill-First Approach**: Prioritizes skill matching to avoid skill mismatch issues
- **Fairness-Aware**: Ensures rural and non-Tier-1 city candidates get valid results
- **Narrative Diversity**: Provides human-like explanations for recommendations
- **Learning Path Generator**: Suggests skill development paths when no direct matches found

### 🌍 Multi-Language Support
- **12 Indian Languages**: Tamil, Hindi, Telugu, Kannada, Bengali, Marathi, Gujarati, Punjabi, Malayalam, Odia, Urdu, English
- **Regional TTS**: Text-to-speech in selected regional language with voice customization
- **Dynamic Translation**: All UI elements translate based on language selection

### 🎨 Modern UI/UX
- **TailwindCSS**: Clean, responsive design with modern components
- **Card-Based Layout**: SIH-style internship cards with clear information hierarchy
- **Interactive Filters**: Filter by stipend range, location, and skills
- **Accessibility**: Screen reader friendly with proper ARIA labels

### 🔊 Advanced Text-to-Speech
- **Multi-Language TTS**: Supports regional Indian languages
- **Voice Controls**: Adjustable rate, pitch, and volume
- **Smart Voice Selection**: Automatically selects best available voice for language
- **Play/Pause/Resume**: Full control over speech playback

## 🏗️ Architecture

### Frontend (React)
- **React 19** with modern hooks
- **TailwindCSS** for styling
- **Multi-tag Input** component with autocomplete
- **Responsive Design** for all screen sizes

### Backend (Dual Stack)
- **Node.js + Express** (Primary): Enhanced recommendation engine
- **Python + Flask** (Fallback): Basic recommendation system
- **MongoDB**: Database with comprehensive sample data

### Database
- **26+ Sample Internships** across various sectors and locations
- **Comprehensive Coverage**: Technology, Business, Finance, Design, Healthcare, Engineering
- **Fairness Implementation**: Includes rural and Tier-2/3 city opportunities

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MongoDB (v4.4+)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PM_Intern
   ```

2. **Setup MongoDB**
   ```bash
   # Start MongoDB service
   mongod
   
   # Insert sample data
   cd backend
   python sample_data.py
   ```

3. **Setup Node.js Backend**
   ```bash
   cd node_backend
   npm install
   npm run dev
   ```

4. **Setup Python Backend (Optional)**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

5. **Setup React Frontend**
   ```bash
   cd intern_frontend
   npm install
   npm start
   ```

### Access the Application
- Frontend: http://localhost:3000
- Node Backend: http://localhost:4000
- Python Backend: http://localhost:5000

## 📊 Sample Data

The system includes **26 comprehensive internship records** covering:

### Sectors
- Technology (Software, AI/ML, DevOps, Cybersecurity)
- Business (Marketing, HR, Operations, Consulting)
- Finance (Investment Banking, Accounting, Financial Analysis)
- Design (UI/UX, Graphic Design)
- Healthcare (Biotech, Pharmaceutical, Healthcare IT)
- Engineering (Mechanical, Civil, Electrical)
- Agriculture Tech
- E-commerce
- Education Technology

### Locations
- **Tier-1 Cities**: Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune, Kolkata
- **Tier-2/3 Cities**: Coimbatore, Indore, Jaipur, Bhubaneswar, Kochi
- **Rural Opportunities**: Agriculture tech, local business internships

### Skills Coverage
- **Programming**: Python, JavaScript, React, Node.js, SQL, etc.
- **Design**: Figma, Adobe XD, Photoshop, Illustrator
- **Business**: Excel, Digital Marketing, Analytics, Project Management
- **Engineering**: CAD, SolidWorks, AutoCAD, MATLAB
- **Healthcare**: Laboratory Techniques, Drug Development, Quality Control

## 🎯 Recommendation Algorithm

### Scoring System
1. **Skills Match** (Primary): +3 points per exact skill match
2. **Related Skills**: +2 points per related skill (capped)
3. **Education Match**: +2 points
4. **Department Match**: +2 points
5. **Sector Match**: +2 points
6. **Location Match**: +1 point (only if skills exist)
7. **Stipend Bonus**: +1 point for competitive stipends

### Categories
- **Best Fit**: 3+ skill matches or strong overall alignment
- **Growth Potential**: Missing 1-2 skills but good foundation
- **Alternative**: Education/department/sector match despite skill gap

### Fairness Features
- **No Skill Mismatch**: Won't recommend roles with zero skill overlap
- **Rural Inclusion**: Ensures non-Tier-1 opportunities are surfaced
- **Learning Paths**: Provides skill development suggestions

## 🔧 API Endpoints

### Node.js Backend (Primary)
- `POST /recommend` - Get internship recommendations
- `GET /autocomplete/:type` - Autocomplete suggestions

### Python Backend (Fallback)
- `POST /find_internships` - Basic recommendation
- `GET /autocomplete/:field` - Field-specific autocomplete

## 🌟 Unique Features for SIH

### 1. Narrative Diversity
Instead of generic "skills matched" responses, provides contextual explanations:
- "Excellent skill alignment! You have Python, JavaScript, React which are core requirements."
- "Convenient location match in Bangalore - no relocation needed!"
- "Attractive stipend of ₹25,000 makes this a financially rewarding opportunity."

### 2. Learning Path Generator
When no direct matches found, suggests targeted learning paths:
- Python Programming Fundamentals (4-6 weeks)
- JavaScript & Web Development (6-8 weeks)
- SQL & Database Management (3-4 weeks)
- Digital Marketing Fundamentals (4-5 weeks)

### 3. Fairness-Aware Filtering
- Ensures rural candidates see relevant opportunities
- Balances Tier-1 and Tier-2/3 city internships
- Provides growth opportunities for skill gaps

### 4. Voice-First Accessibility
- Regional language TTS with proper pronunciation
- Adjustable voice parameters (rate, pitch, volume)
- Smart voice selection for optimal clarity

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop Enhanced**: Full feature set on larger screens
- **Touch-Friendly**: Large tap targets and gestures

## 🔒 Security & Performance

- **CORS Enabled**: Cross-origin requests handled
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Graceful fallbacks
- **Performance**: Debounced autocomplete, efficient filtering

## 🧪 Testing

The system has been tested with:
- Various skill combinations
- Different education backgrounds
- Multiple language selections
- Filter combinations
- TTS functionality across languages

## 📈 Future Enhancements

- Machine Learning model integration
- User preference learning
- Advanced analytics dashboard
- Mobile app development
- Integration with job portals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed for SIH Problem Statement 25034.

## 👥 Team

Developed as a solution for the Smart India Hackathon 2024 - Problem Statement 25034: "AI-Based Internship Recommendation Engine for PM Internship Scheme"

---

**🎉 Ready to revolutionize internship matching with AI-powered recommendations!**
