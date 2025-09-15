from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import re

app = Flask(__name__)
CORS(app)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["internship_recommendation"]
internships = db["internships"]

# Rule-based scoring algorithm with reasons
def calculate_score_and_reasons(user_input, internship):
    score = 0
    reasons = []
    
    # Education match: +2 points
    if user_input.get("education") and user_input["education"].lower() == internship.get("education", "").lower():
        score += 2
        reasons.append(f"Education matches: {internship.get('education', '')}")
    
    # Department match: +2 points
    if user_input.get("department") and user_input["department"].lower() == internship.get("department", "").lower():
        score += 2
        reasons.append(f"Department matches: {internship.get('department', '')}")
    
    # Sector match: +2 points
    if user_input.get("sector") and user_input["sector"].lower() == internship.get("sector", "").lower():
        score += 2
        reasons.append(f"Sector matches: {internship.get('sector', '')}")
    
    # Location match: +1 point
    if user_input.get("location") and user_input["location"].lower() == internship.get("location", "").lower():
        score += 1
        reasons.append(f"Location matches: {internship.get('location', '')}")
    
    # Skill match: +2 per skill
    if user_input.get("skills"):
        user_skills = set(skill.lower() for skill in user_input["skills"])
        internship_skills = set(skill.lower() for skill in internship.get("skills", []))
        matching_skills = user_skills.intersection(internship_skills)
        if matching_skills:
            score += len(matching_skills) * 2
            reasons.append(f"Skill match: {', '.join(matching_skills)}")
    
    return score, reasons

# API to get internships
@app.route("/find_internships", methods=["POST"])
def find_internships():
    data = request.json
    all_internships = list(internships.find({}, {"_id": 0}))
    scored = []
    
    for intern in all_internships:
        score, reasons = calculate_score_and_reasons(data, intern)
        scored.append({
            **intern,
            "score": score,
            "reasons": reasons
        })
    
    # Sort by score (descending) and return top 5
    scored = sorted(scored, key=lambda x: x["score"], reverse=True)[:5]
    return jsonify(scored)

# Autocomplete endpoints
@app.route("/autocomplete/education", methods=["GET"])
def autocomplete_education():
    query = request.args.get("q", "").lower()
    if len(query) < 2:
        return jsonify([])
    
    # Get unique education values from database
    pipeline = [
        {"$group": {"_id": "$education"}},
        {"$match": {"_id": {"$regex": query, "$options": "i"}}},
        {"$limit": 10}
    ]
    results = list(internships.aggregate(pipeline))
    return jsonify([result["_id"] for result in results if result["_id"]])

@app.route("/autocomplete/department", methods=["GET"])
def autocomplete_department():
    query = request.args.get("q", "").lower()
    if len(query) < 2:
        return jsonify([])
    
    pipeline = [
        {"$group": {"_id": "$department"}},
        {"$match": {"_id": {"$regex": query, "$options": "i"}}},
        {"$limit": 10}
    ]
    results = list(internships.aggregate(pipeline))
    return jsonify([result["_id"] for result in results if result["_id"]])

@app.route("/autocomplete/sector", methods=["GET"])
def autocomplete_sector():
    query = request.args.get("q", "").lower()
    if len(query) < 2:
        return jsonify([])
    
    pipeline = [
        {"$group": {"_id": "$sector"}},
        {"$match": {"_id": {"$regex": query, "$options": "i"}}},
        {"$limit": 10}
    ]
    results = list(internships.aggregate(pipeline))
    return jsonify([result["_id"] for result in results if result["_id"]])

@app.route("/autocomplete/location", methods=["GET"])
def autocomplete_location():
    query = request.args.get("q", "").lower()
    if len(query) < 2:
        return jsonify([])
    
    pipeline = [
        {"$group": {"_id": "$location"}},
        {"$match": {"_id": {"$regex": query, "$options": "i"}}},
        {"$limit": 10}
    ]
    results = list(internships.aggregate(pipeline))
    return jsonify([result["_id"] for result in results if result["_id"]])

@app.route("/autocomplete/skills", methods=["GET"])
def autocomplete_skills():
    query = request.args.get("q", "").lower()
    if len(query) < 2:
        return jsonify([])
    
    # Unwind skills array and get unique skills
    pipeline = [
        {"$unwind": "$skills"},
        {"$group": {"_id": "$skills"}},
        {"$match": {"_id": {"$regex": query, "$options": "i"}}},
        {"$limit": 10}
    ]
    results = list(internships.aggregate(pipeline))
    return jsonify([result["_id"] for result in results if result["_id"]])

if __name__ == "__main__":
    app.run(debug=True)
