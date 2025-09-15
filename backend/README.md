# Enhanced Internship Recommendation System - Backend

This Flask backend provides a rule-based algorithm for recommending internships and autocomplete functionality for user inputs.

## 🚀 Features

### 1. Rule-based Recommendation Algorithm
- **Education match**: +2 points
- **Department match**: +2 points  
- **Sector match**: +2 points
- **Location match**: +1 point
- **Skill match**: +2 points per matching skill
- Returns top 5 internships sorted by score
- Includes detailed reasons for each recommendation

### 2. Autocomplete APIs
- `/autocomplete/education` - Education level suggestions
- `/autocomplete/department` - Department suggestions
- `/autocomplete/sector` - Industry sector suggestions
- `/autocomplete/location` - Location suggestions
- `/autocomplete/skills` - Skill suggestions

## 📋 API Endpoints

### POST `/find_internships`
Find internships based on user criteria.

**Request Body:**
```json
{
  "education": "B.Tech",
  "department": "CSE", 
  "sector": "Technology",
  "location": "Bangalore",
  "skills": ["Python", "JavaScript", "React"]
}
```

**Response:**
```json
[
  {
    "title": "Software Development Intern",
    "company": "TechCorp",
    "education": "B.Tech",
    "department": "CSE",
    "sector": "Technology", 
    "location": "Bangalore",
    "skills": ["Python", "JavaScript", "React", "Node.js"],
    "duration": "6 months",
    "stipend": "25000",
    "score": 8,
    "reasons": [
      "Education matches: B.Tech",
      "Department matches: CSE", 
      "Sector matches: Technology",
      "Location matches: Bangalore",
      "Skill match: Python, JavaScript, React"
    ]
  }
]
```

### GET `/autocomplete/{field}?q={query}`
Get autocomplete suggestions for a specific field.

**Parameters:**
- `field`: One of `education`, `department`, `sector`, `location`, `skills`
- `q`: Search query (minimum 2 characters)

**Response:**
```json
["B.Tech", "BBA", "B.Com", "MBA"]
```

## 🛠️ Setup and Installation

1. **Install Dependencies:**
   ```bash
   pip install flask flask-cors pymongo
   ```

2. **Start MongoDB:**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod
   ```

3. **Insert Sample Data:**
   ```bash
   python sample_data.py
   ```

4. **Start the Flask Server:**
   ```bash
   python app.py
   ```

5. **Test the API:**
   ```bash
   python test_api.py
   ```

## 🧪 Testing

The `test_api.py` script tests all endpoints:

```bash
python test_api.py
```

Sample test output:
```
🚀 Testing Enhanced Internship Recommendation System API
============================================================

Testing autocomplete/education with query 'btech'...
✅ Found 1 suggestions: ['B.Tech']

Testing find_internships endpoint...
✅ Found 3 internships

1. Software Development Intern (Score: 8)
   Reasons: ['Education matches: B.Tech', 'Department matches: CSE', 'Sector matches: Technology', 'Location matches: Bangalore', 'Skill match: Python, JavaScript, React']
```

## 📊 Scoring Algorithm Details

| Criteria | Points | Description |
|----------|--------|-------------|
| Education Match | +2 | Exact match on education level |
| Department Match | +2 | Exact match on department |
| Sector Match | +2 | Exact match on industry sector |
| Location Match | +1 | Exact match on location |
| Skill Match | +2 per skill | Each matching skill adds 2 points |

## 🔧 Configuration

- **MongoDB Connection**: `mongodb://localhost:27017/`
- **Database**: `internship_recommendation`
- **Collection**: `internships`
- **Flask Port**: 5000 (default)

## 📝 Database Schema

Each internship document should have:
```json
{
  "title": "string",
  "company": "string", 
  "education": "string",
  "department": "string",
  "sector": "string",
  "location": "string",
  "skills": ["string"],
  "duration": "string",
  "stipend": "string"
}
```

## 🚀 Usage Examples

### Frontend Integration

```javascript
// Get autocomplete suggestions
const response = await fetch('/autocomplete/skills?q=python');
const suggestions = await response.json();

// Find internships
const internships = await fetch('/find_internships', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    education: 'B.Tech',
    department: 'CSE',
    sector: 'Technology', 
    location: 'Bangalore',
    skills: ['Python', 'JavaScript']
  })
});
```

## 🐛 Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running on localhost:27017
2. **No Results**: Check if sample data is inserted using `sample_data.py`
3. **CORS Issues**: The backend includes CORS headers for frontend integration
4. **Empty Autocomplete**: Ensure there's data in the database with the queried field

## 📈 Future Enhancements

- Machine learning-based recommendations
- User preference learning
- Advanced filtering options
- Recommendation explanation improvements
- Performance optimization for large datasets
