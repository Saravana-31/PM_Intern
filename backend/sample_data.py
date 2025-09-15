#!/usr/bin/env python3
"""
Sample data insertion script for testing the Internship Recommendation System
"""

from pymongo import MongoClient

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["internship_recommendation"]
internships = db["internships"]

# Sample internship data
sample_internships = [
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
        "title": "Mobile App Development Intern",
        "company": "MobileFirst",
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Bangalore",
        "skills": ["React Native", "Flutter", "JavaScript", "Firebase"],
        "duration": "6 months",
        "stipend": "28000"
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
