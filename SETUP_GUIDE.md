# Setup Guide - AI-Based Internship Recommendation Engine

## Quick Start (Recommended)

### Option 1: Automated Setup
```bash
# Double-click start.bat
# This will automatically start all services
```

### Option 2: Manual Setup

#### Step 1: Start MongoDB
```bash
# Open Command Prompt as Administrator
mongod --dbpath C:\data\db
```

#### Step 2: Insert Sample Data
```bash
# Open new Command Prompt
cd backend
python sample_data.py
```

#### Step 3: Start Backend Services
```bash
# Terminal 1 - Node.js Backend
cd node_backend
node server.js

# Terminal 2 - Python Backend (Optional)
cd backend
python app.py
```

#### Step 4: Start Frontend
```bash
# Terminal 3 - React Frontend
cd intern_frontend
npm start
```

## Access URLs
- **Frontend**: http://localhost:3000
- **Node Backend**: http://localhost:4000
- **Python Backend**: http://localhost:5000

## Troubleshooting

### MongoDB Issues
```bash
# If MongoDB fails to start, create data directory:
mkdir C:\data\db

# Or use different path:
mongod --dbpath ./data/db
```

### Port Already in Use
```bash
# Kill processes on ports:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F

netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Node.js Issues
```bash
# Install dependencies:
cd node_backend
npm install

# Check if server.js exists:
dir server.js
```

### Python Issues
```bash
# Install dependencies:
cd backend
pip install flask flask-cors pymongo

# Check if app.py exists:
dir app.py
```

### React Issues
```bash
# Install dependencies:
cd intern_frontend
npm install

# Clear cache:
npm start -- --reset-cache
```

## Verification

### Test Backend APIs
```bash
# Test Node backend:
curl http://localhost:4000/recommend -X POST -H "Content-Type: application/json" -d "{\"skills\":[\"Python\"]}"

# Test Python backend:
curl http://localhost:5000/find_internships -X POST -H "Content-Type: application/json" -d "{\"skills\":[\"Python\"]}"
```

### Test Frontend
1. Open http://localhost:3000
2. Select a language
3. Enter skills (e.g., "Python", "JavaScript")
4. Click "Find Internships"
5. Verify results appear

## Success Indicators
- ✅ MongoDB running on port 27017
- ✅ Node backend running on port 4000
- ✅ Python backend running on port 5000
- ✅ React frontend running on port 3000
- ✅ Sample data inserted (26 internships)
- ✅ Frontend loads without errors
- ✅ Search returns results
- ✅ TTS works in selected language
