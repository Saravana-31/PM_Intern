// Comprehensive predefined options for autocomplete
export const predefinedOptions = {
  education: [
    "B.Tech", "M.Tech", "B.Sc", "M.Sc", "BBA", "MBA", "B.Com", "M.Com",
    "BCA", "MCA", "B.E", "M.E", "Diploma", "Certificate", "Ph.D", "M.Phil",
    "B.A", "M.A", "B.Ed", "M.Ed", "LLB", "LLM", "B.Pharm", "M.Pharm",
    "BDS", "MDS", "MBBS", "MD", "MS", "BVSc", "MVSc"
  ],

  departments: {
    "B.Tech": ["CSE", "IT", "AIML", "ECE", "EEE", "ME", "CE", "Chemical", "Aerospace", "Biotech", "Civil", "Mechanical", "Electrical", "Electronics", "Computer Science", "Information Technology"],
    "M.Tech": ["CSE", "IT", "ECE", "EEE", "ME", "CE", "Chemical", "Aerospace", "Biotech", "Civil", "Mechanical", "Electrical", "Electronics", "Computer Science", "Information Technology", "Data Science", "AI/ML", "Cyber Security"],
    "BBA": ["Management", "Marketing", "Finance", "HR", "Operations", "International Business", "Digital Marketing", "Business Analytics"],
    "MBA": ["Management", "Marketing", "Finance", "HR", "Operations", "Strategy", "International Business", "Digital Marketing", "Business Analytics", "Supply Chain", "Entrepreneurship"],
    "B.Sc": ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Statistics", "Electronics", "Biotechnology", "Microbiology", "Environmental Science"],
    "M.Sc": ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Statistics", "Electronics", "Biotechnology", "Microbiology", "Environmental Science", "Data Science", "AI/ML"],
    "B.Com": ["Commerce", "Accounting", "Finance", "Economics", "Business Studies", "Taxation", "Banking", "Insurance"],
    "M.Com": ["Commerce", "Accounting", "Finance", "Economics", "Business Studies", "Taxation", "Banking", "Insurance", "International Business"],
    "BCA": ["Computer Applications", "Software Development", "Web Development", "Database Management"],
    "MCA": ["Computer Applications", "Software Development", "Web Development", "Database Management", "System Administration", "Network Management"],
    "B.E": ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Chemical", "Aerospace", "Biotechnology"],
    "M.E": ["Computer Science", "Information Technology", "Electronics", "Electrical", "Mechanical", "Civil", "Chemical", "Aerospace", "Biotechnology", "Data Science", "AI/ML"],
    "Diploma": ["Computer Science", "Electronics", "Electrical", "Mechanical", "Civil", "Chemical", "Automobile", "Textile", "Fashion Design"],
    "Certificate": ["Digital Marketing", "Web Development", "Data Analysis", "Graphic Design", "UI/UX Design", "Project Management", "Quality Assurance"]
  },

  sectors: [
    "Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "E-commerce", "Automotive", "Aerospace", "Energy",
    "Telecommunications", "Media", "Entertainment", "Sports", "Travel", "Hospitality", "Real Estate", "Construction", "Agriculture",
    "Food & Beverage", "Fashion", "Beauty", "Pharmaceuticals", "Biotechnology", "Consulting", "Legal", "Government", "Non-profit",
    "Startup", "Fintech", "Edtech", "Healthtech", "Agritech", "Cleantech", "AI/ML", "Data Science", "Cybersecurity", "Blockchain",
    "IoT", "Robotics", "AR/VR", "Gaming", "Social Media", "Digital Marketing", "Content Creation", "Design", "Architecture"
  ],

  locations: [
    "Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara",
    "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi",
    "Srinagar", "Aurangabad", "Navi Mumbai", "Solapur", "Vijayawada", "Kolhapur", "Amritsar", "Noida", "Ranchi", "Howrah",
    "Coimbatore", "Raipur", "Jabalpur", "Gwalior", "Chandigarh", "Tiruchirappalli", "Madurai", "Guwahati", "Hubli-Dharwad", "Mysore",
    "Kochi", "Bhubaneswar", "Bhavnagar", "Salem", "Warangal", "Guntur", "Bhiwandi", "Amravati", "Nanded", "Kolhapur",
    "Sangli", "Malegaon", "Ulhasnagar", "Jalgaon", "Akola", "Latur", "Ahmadnagar", "Dhule", "Ichalkaranji", "Parbhani",
    "Jalna", "Bhusawal", "Chalisgaon", "Aurangabad", "Jalna", "Beed", "Amalner", "Dhule", "Ichalkaranji", "Parbhani"
  ],

  skills: [
    // Programming Languages
    "Python", "JavaScript", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin", "Scala", "TypeScript",
    
    // Web Development
    "HTML", "CSS", "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET",
    
    // Mobile Development
    "React Native", "Flutter", "Ionic", "Xamarin", "Cordova", "PhoneGap",
    
    // Database
    "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "SQLite", "Cassandra", "Elasticsearch",
    
    // Cloud & DevOps
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "GitLab", "CI/CD",
    
    // Data Science & AI/ML
    "Machine Learning", "Deep Learning", "Data Science", "Artificial Intelligence", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn",
    
    // Design & UI/UX
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InDesign", "Canva", "Prototyping", "Wireframing",
    
    // Digital Marketing
    "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing", "Google Analytics", "Facebook Ads", "Google Ads",
    
    // Business & Management
    "Project Management", "Agile", "Scrum", "Business Analysis", "Data Analysis", "Excel", "Power BI", "Tableau", "Salesforce", "SAP",
    
    // Other Technical Skills
    "Linux", "Windows", "macOS", "Networking", "Cybersecurity", "Blockchain", "IoT", "AR/VR", "Game Development", "Unity", "Unreal Engine",
    
    // Soft Skills
    "Communication", "Leadership", "Team Management", "Problem Solving", "Critical Thinking", "Time Management", "Presentation Skills", "Negotiation", "Customer Service"
  ]
};

// Helper function to get departments based on education
export const getDepartmentsForEducation = (education) => {
  return predefinedOptions.departments[education] || [];
};
