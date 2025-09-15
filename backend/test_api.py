#!/usr/bin/env python3
"""
Test script for the enhanced Internship Recommendation System API
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_find_internships():
    """Test the find_internships endpoint with sample data"""
    print("Testing find_internships endpoint...")
    
    sample_data = {
        "education": "B.Tech",
        "department": "CSE",
        "sector": "Technology",
        "location": "Bangalore",
        "skills": ["Python", "JavaScript", "React"]
    }
    
    try:
        response = requests.post(f"{BASE_URL}/find_internships", json=sample_data)
        if response.status_code == 200:
            results = response.json()
            print(f"✅ Found {len(results)} internships")
            for i, intern in enumerate(results, 1):
                print(f"\n{i}. {intern.get('title', 'N/A')} (Score: {intern.get('score', 0)})")
                print(f"   Reasons: {intern.get('reasons', [])}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Connection error: {e}")

def test_autocomplete_endpoints():
    """Test all autocomplete endpoints"""
    endpoints = [
        ("education", "btech"),
        ("department", "cse"),
        ("sector", "tech"),
        ("location", "bang"),
        ("skills", "python")
    ]
    
    for endpoint, query in endpoints:
        print(f"\nTesting autocomplete/{endpoint} with query '{query}'...")
        try:
            response = requests.get(f"{BASE_URL}/autocomplete/{endpoint}?q={query}")
            if response.status_code == 200:
                results = response.json()
                print(f"✅ Found {len(results)} suggestions: {results}")
            else:
                print(f"❌ Error: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Connection error: {e}")

def main():
    print("🚀 Testing Enhanced Internship Recommendation System API")
    print("=" * 60)
    
    # Test autocomplete endpoints first (they don't require data)
    test_autocomplete_endpoints()
    
    print("\n" + "=" * 60)
    
    # Test main recommendation endpoint
    test_find_internships()
    
    print("\n" + "=" * 60)
    print("✅ Testing completed!")

if __name__ == "__main__":
    main()
