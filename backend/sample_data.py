#!/usr/bin/env python3
"""
Sample data insertion script for testing the Internship Recommendation System
"""

from pymongo import MongoClient

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["internship_recommendation"]
internships = db["internships"]

# Comprehensive sample internship data covering various sectors, locations, and skills
sample_internships = [
    # Technology Sector - Tier 1 Cities
    {
        "title": "Software Development Intern",
        "company": "TechCorp",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Bangalore",
        "skills": ["Python", "JavaScript", "React", "Node.js"],
        "duration": "6 months",
        "stipend": "25000"
    },
    {
        "title": "Data Science Intern",
        "company": "DataViz Inc",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Mumbai",
        "skills": ["Python", "Machine Learning", "Pandas", "NumPy"],
        "duration": "3 months",
        "stipend": "30000"
    },
    {
        "title": "Web Development Intern",
        "company": "WebSolutions",
        "education": "B.Tech",
        "department": "IT",
        "sector": "Technology",
        "location": "Bangalore",
        "skills": ["HTML", "CSS", "JavaScript", "React", "Python"],
        "duration": "5 months",
        "stipend": "22000"
    },
    {
        "title": "Mobile App Development Intern",
        "company": "MobileFirst",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Bangalore",
        "skills": ["React Native", "Flutter", "JavaScript", "Firebase"],
        "duration": "6 months",
        "stipend": "28000"
    },
    {
        "title": "AI/ML Intern",
        "company": "AI Innovations",
        "education": "B.Tech",
        "department": "AIML",
        "sector": "Technology",
        "location": "Hyderabad",
        "skills": ["Python", "TensorFlow", "Deep Learning", "Computer Vision"],
        "duration": "6 months",
        "stipend": "32000"
    },
    {
        "title": "DevOps Intern",
        "company": "CloudTech",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Pune",
        "skills": ["Docker", "Kubernetes", "AWS", "Linux"],
        "duration": "4 months",
        "stipend": "26000"
    },
    {
        "title": "Cybersecurity Intern",
        "company": "SecureNet",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Delhi",
        "skills": ["Ethical Hacking", "Network Security", "Python", "Linux"],
        "duration": "5 months",
        "stipend": "24000"
    },
    
    # Business & Management Sector
    {
        "title": "Marketing Intern",
        "company": "BrandCo",
        "education": "BBA",
        "department": "Management",
        "sector": "Marketing",
        "location": "Delhi",
        "skills": ["Digital Marketing", "Social Media", "Analytics"],
        "duration": "4 months",
        "stipend": "15000"
    },
    {
        "title": "Business Analyst Intern",
        "company": "BusinessTech",
        "education": "MBA",
        "department": "Management",
        "sector": "Consulting",
        "location": "Hyderabad",
        "skills": ["SQL", "Excel", "Power BI", "Business Analysis"],
        "duration": "6 months",
        "stipend": "35000"
    },
    {
        "title": "HR Intern",
        "company": "PeopleFirst",
        "education": "BBA",
        "department": "HR",
        "sector": "Human Resources",
        "location": "Chennai",
        "skills": ["Recruitment", "Employee Relations", "HR Analytics"],
        "duration": "3 months",
        "stipend": "12000"
    },
    {
        "title": "Operations Intern",
        "company": "LogiFlow",
        "education": "BBA",
        "department": "Operations",
        "sector": "Logistics",
        "location": "Mumbai",
        "skills": ["Supply Chain", "Process Optimization", "Excel"],
        "duration": "4 months",
        "stipend": "18000"
    },
    
    # Finance Sector
    {
        "title": "Finance Intern",
        "company": "FinanceFirst",
        "education": "B.Com",
        "department": "Commerce",
        "sector": "Finance",
        "location": "Chennai",
        "skills": ["Excel", "Financial Analysis", "Accounting"],
        "duration": "6 months",
        "stipend": "20000"
    },
    {
        "title": "Investment Banking Intern",
        "company": "Capital Partners",
        "education": "MBA",
        "department": "Finance",
        "sector": "Finance",
        "location": "Mumbai",
        "skills": ["Financial Modeling", "Excel", "PowerPoint", "Research"],
        "duration": "6 months",
        "stipend": "40000"
    },
    {
        "title": "Accounting Intern",
        "company": "TaxPro",
        "education": "B.Com",
        "department": "Accounting",
        "sector": "Finance",
        "location": "Kolkata",
        "skills": ["Tally", "GST", "Excel", "Accounting"],
        "duration": "3 months",
        "stipend": "10000"
    },
    
    # Design & Creative Sector
    {
        "title": "UI/UX Design Intern",
        "company": "DesignStudio",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Design",
        "location": "Pune",
        "skills": ["Figma", "Adobe XD", "User Research", "Prototyping"],
        "duration": "4 months",
        "stipend": "18000"
    },
    {
        "title": "Graphic Design Intern",
        "company": "CreativeHub",
        "education": "B.Sc",
        "department": "Computer Science",
        "sector": "Design",
        "location": "Bangalore",
        "skills": ["Photoshop", "Illustrator", "InDesign", "Branding"],
        "duration": "3 months",
        "stipend": "14000"
    },
    
    # Healthcare & Biotechnology
    {
        "title": "Biotech Research Intern",
        "company": "BioTech Labs",
        "education": "B.Sc",
        "department": "Biology",
        "sector": "Healthcare",
        "location": "Bangalore",
        "skills": ["Laboratory Techniques", "Data Analysis", "Research"],
        "duration": "6 months",
        "stipend": "16000"
    },
    {
        "title": "Pharmaceutical Intern",
        "company": "MediCorp",
        "education": "B.Pharm",
        "department": "Pharmacy",
        "sector": "Healthcare",
        "location": "Hyderabad",
        "skills": ["Drug Development", "Quality Control", "Regulatory Affairs"],
        "duration": "4 months",
        "stipend": "15000"
    },
    
    # Engineering & Manufacturing
    {
        "title": "Mechanical Engineering Intern",
        "company": "AutoTech",
        "education": "B.Tech",
        "department": "ME",
        "sector": "Manufacturing",
        "location": "Chennai",
        "skills": ["CAD", "SolidWorks", "Manufacturing Processes"],
        "duration": "6 months",
        "stipend": "20000"
    },
    {
        "title": "Civil Engineering Intern",
        "company": "BuildCorp",
        "education": "B.Tech",
        "department": "CE",
        "sector": "Construction",
        "location": "Delhi",
        "skills": ["AutoCAD", "Project Management", "Site Survey"],
        "duration": "5 months",
        "stipend": "18000"
    },
    {
        "title": "Electrical Engineering Intern",
        "company": "PowerGrid",
        "education": "B.Tech",
        "department": "EEE",
        "sector": "Energy",
        "location": "Mumbai",
        "skills": ["Power Systems", "MATLAB", "Circuit Design"],
        "duration": "4 months",
        "stipend": "22000"
    },
    
    # Rural & Tier-2/3 Cities (Fairness Implementation)
    {
        "title": "Digital Marketing Intern",
        "company": "LocalBiz",
        "education": "BBA",
        "department": "Marketing",
        "sector": "Marketing",
        "location": "Coimbatore",
        "skills": ["Social Media", "Content Creation", "SEO"],
        "duration": "3 months",
        "stipend": "8000"
    },
    {
        "title": "Agriculture Tech Intern",
        "company": "AgriTech Solutions",
        "education": "B.Sc",
        "department": "Agriculture",
        "sector": "Agriculture",
        "location": "Indore",
        "skills": ["IoT", "Data Analysis", "Farm Management"],
        "duration": "4 months",
        "stipend": "12000"
    },
    {
        "title": "E-commerce Intern",
        "company": "RuralMart",
        "education": "BBA",
        "department": "Management",
        "sector": "E-commerce",
        "location": "Jaipur",
        "skills": ["Digital Marketing", "Customer Service", "Analytics"],
        "duration": "3 months",
        "stipend": "10000"
    },
    {
        "title": "Education Technology Intern",
        "company": "EduTech",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Education",
        "location": "Bhubaneswar",
        "skills": ["Web Development", "Educational Content", "Learning Management"],
        "duration": "5 months",
        "stipend": "15000"
    },
    {
        "title": "Healthcare IT Intern",
        "company": "MedTech Solutions",
        "education": "B.Tech",
        "department": "IT",
        "sector": "Healthcare",
        "location": "Kochi",
        "skills": ["Healthcare Systems", "Database Management", "Python"],
        "duration": "4 months",
        "stipend": "16000"
    }
]

def insert_sample_data():
    """Insert sample data into MongoDB"""
    try:
        # Clear existing data
        internships.delete_many({})
        print("🗑️  Cleared existing data")
        
        # Insert sample data
        result = internships.insert_many(sample_internships)
        print(f"✅ Inserted {len(result.inserted_ids)} sample internships")
        
        # Verify insertion
        count = internships.count_documents({})
        print(f"📊 Total internships in database: {count}")
        
        # Show sample data
        print("\n📋 Sample internships:")
        for i, intern in enumerate(sample_internships[:3], 1):
            print(f"{i}. {intern['title']} at {intern['company']}")
            print(f"   Education: {intern['education']}, Department: {intern['department']}")
            print(f"   Skills: {', '.join(intern['skills'])}")
            print()
            
    except Exception as e:
        print(f"❌ Error inserting data: {e}")

if __name__ == "__main__":
    print("🚀 Inserting sample data for Internship Recommendation System")
    print("=" * 60)
    insert_sample_data()
    print("=" * 60)
    print("✅ Sample data insertion completed!")
