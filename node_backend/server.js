import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

// Mongo connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'internship_recommendation';
const COLLECTION = 'internships';

let db, internshipsCol;

async function connectMongo() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  internshipsCol = db.collection(COLLECTION);
  console.log('Connected to MongoDB');
}

// Lightweight skill graph relationships
const skillGraph = {
  html: ['css', 'javascript'],
  css: ['html', 'javascript'],
  javascript: ['html', 'css', 'react', 'node.js', 'typescript'],
  react: ['javascript', 'redux', 'node.js'],
  'node.js': ['javascript', 'express', 'mongodb'],
  express: ['node.js', 'javascript'],
  mongodb: ['node.js', 'express', 'sql'],
  sql: ['databases', 'mysql', 'postgresql'],
  python: ['pandas', 'numpy', 'machine learning', 'flask', 'django'],
  'machine learning': ['python', 'data science', 'deep learning'],
  'data science': ['python', 'pandas', 'numpy', 'machine learning'],
  'deep learning': ['python', 'pytorch', 'tensorflow'],
  django: ['python'],
  flask: ['python'],
  pandas: ['python', 'data science'],
  numpy: ['python', 'data science'],
  typescript: ['javascript'],
};

function normalizeSkill(s) {
  return (s || '').toString().trim().toLowerCase();
}

function getRelatedSkills(skills) {
  const related = new Set();
  for (const s of skills) {
    const rel = skillGraph[normalizeSkill(s)] || [];
    rel.forEach(r => related.add(r));
  }
  return related;
}

// Enhanced scoring function with skill-first approach and narrative diversity
function scoreInternship(user, intern) {
  const reasons = [];
  let score = 0;

  const userEducation = (user.education || '').toLowerCase();
  const userDept = (user.department || '').toLowerCase();
  const userSector = (user.sector || '').toLowerCase();
  const userLocation = (user.location || '').toLowerCase();
  const userSkills = new Set((user.skills || []).map(normalizeSkill));

  const iEducation = (intern.education || '').toLowerCase();
  const iDept = (intern.department || '').toLowerCase();
  const iSector = (intern.sector || '').toLowerCase();
  const iLocation = (intern.location || '').toLowerCase();
  const iSkills = new Set((intern.skills || []).map(normalizeSkill));

  // Skill overlap: CRITICAL - Primary filter
  const matchingSkills = [...iSkills].filter(s => userSkills.has(s));
  const missingSkills = [...iSkills].filter(s => !userSkills.has(s));
  const relatedSkills = [...iSkills].filter(s => getRelatedSkills(user.skills || []).has(s));

  // SKILL-FIRST APPROACH: No skill match = very low score (avoid skill mismatch)
  if (matchingSkills.length === 0 && relatedSkills.length === 0) {
    // Only recommend if there's strong education/department/sector match
    if (userEducation === iEducation && userDept === iDept && userSector === iSector) {
      score += 1; // Minimal score for perfect non-skill match
      reasons.push(`Perfect education/department/sector match despite skill gap`);
    } else {
      return { score: 0, reasons: [], narratives: [], category: 'no_match', matchingSkills, missingSkills, relatedSkills };
    }
  }

  // Skill scoring: Exact matches get highest priority
  if (matchingSkills.length > 0) {
    score += matchingSkills.length * 3; // Increased weight
    reasons.push(`Skill match: ${matchingSkills.join(', ')}`);
  }
  
  // Related skills: Secondary but important
  if (relatedSkills.length > 0) {
    score += Math.min(relatedSkills.length * 2, matchingSkills.length * 2); // Cap to not exceed exact matches
    reasons.push(`Related skills: ${relatedSkills.join(', ')}`);
  }

  // Education/Department/Sector: Important but secondary to skills
  if (userEducation && userEducation === iEducation) {
    score += 2;
    reasons.push(`Education matches: ${intern.education}`);
  }
  if (userDept && userDept === iDept) {
    score += 2;
    reasons.push(`Department matches: ${intern.department}`);
  }
  if (userSector && userSector === iSector) {
    score += 2;
    reasons.push(`Sector matches: ${intern.sector}`);
  }

  // Location: Tie-breaker only if skills exist
  if ((matchingSkills.length > 0 || relatedSkills.length > 0) && userLocation && userLocation === iLocation) {
    score += 1;
    reasons.push(`Location matches: ${intern.location}`);
  }

  // Stipend consideration (bonus for good stipend)
  const stipend = parseInt(intern.stipend) || 0;
  if (stipend >= 20000) {
    score += 1;
    reasons.push(`Competitive stipend: ₹${stipend}`);
  }

  // Opportunity gap: Growth potential roles
  const opportunityGap = missingSkills.length > 0 && missingSkills.length <= 2 && (matchingSkills.length >= 1 || userSector === iSector || userDept === iDept);
  if (opportunityGap) {
    score += 1;
    const gapText = missingSkills.join(', ');
    reasons.push(`Growth potential: add ${gapText} to qualify fully`);
  }

  // Enhanced narrative generation with diversity
  const narratives = [];
  
  // Skill-based narratives
  if (matchingSkills.length >= 3) {
    narratives.push(`Excellent skill alignment! You have ${matchingSkills.slice(0, 3).join(', ')} which are core requirements.`);
  } else if (matchingSkills.length === 2) {
    narratives.push(`Strong skill match with ${matchingSkills.join(' and ')} - you're well-qualified for this role.`);
  } else if (matchingSkills.length === 1) {
    narratives.push(`Good foundation with ${matchingSkills[0]} - this role builds on your existing expertise.`);
  }
  
  // Related skills narrative
  if (relatedSkills.length > 0) {
    narratives.push(`Your skills connect to ${relatedSkills.join(', ')}, showing strong potential for growth.`);
  }
  
  // Education/Department narratives
  if (userEducation === iEducation) {
    narratives.push(`Your ${intern.education} background provides the right foundation for this internship.`);
  }
  if (userDept === iDept) {
    narratives.push(`Your ${intern.department} specialization aligns perfectly with this opportunity.`);
  }
  
  // Sector narratives
  if (userSector === iSector) {
    narratives.push(`This ${intern.sector} role matches your career interests and sector knowledge.`);
  }
  
  // Location narratives
  if (userLocation === iLocation && (matchingSkills.length > 0 || relatedSkills.length > 0)) {
    narratives.push(`Convenient location match in ${intern.location} - no relocation needed!`);
  }
  
  // Stipend narratives
  if (stipend >= 25000) {
    narratives.push(`Attractive stipend of ₹${stipend} makes this a financially rewarding opportunity.`);
  } else if (stipend >= 15000) {
    narratives.push(`Decent stipend of ₹${stipend} provides good learning compensation.`);
  }
  
  // Growth opportunity narratives
  if (opportunityGap) {
    narratives.push(`Stretch opportunity: Learn ${missingSkills.join(', ')} to become fully qualified - great for career growth!`);
  }
  
  // Company/sector specific narratives
  if (intern.sector === 'Technology') {
    narratives.push(`Tech sector experience will boost your digital skills and marketability.`);
  } else if (intern.sector === 'Finance') {
    narratives.push(`Finance sector exposure will enhance your analytical and business skills.`);
  } else if (intern.sector === 'Healthcare') {
    narratives.push(`Healthcare sector experience is valuable for understanding industry challenges.`);
  }

  // Enhanced category classification
  let category = 'alternative';
  if (matchingSkills.length >= 3 || (matchingSkills.length >= 2 && relatedSkills.length >= 1)) {
    category = 'best_fit';
  } else if (opportunityGap || (matchingSkills.length >= 1 && relatedSkills.length >= 2)) {
    category = 'growth';
  } else if (matchingSkills.length >= 1 || relatedSkills.length >= 2) {
    category = 'best_fit';
  } else if (userEducation === iEducation && userDept === iDept && userSector === iSector) {
    category = 'alternative';
  }

  return { score, reasons, narratives, category, matchingSkills, missingSkills, relatedSkills };
}

// Learning path generator for no-match scenarios
function generateLearningPaths(user) {
  const learningPaths = [];
  const userSkills = (user.skills || []).map(normalizeSkill);
  const userSector = (user.sector || '').toLowerCase();
  const userEducation = (user.education || '').toLowerCase();

  // Technology sector learning paths
  if (userSector === 'technology' || userEducation.includes('tech')) {
    if (!userSkills.includes('python')) {
      learningPaths.push({
        title: "Python Programming Fundamentals",
        description: "Learn Python basics to qualify for most tech internships",
        duration: "4-6 weeks",
        difficulty: "Beginner",
        skills: ["Python", "Programming Logic", "Data Structures"],
        resources: ["Python.org tutorial", "Codecademy Python course", "FreeCodeCamp Python"]
      });
    }
    if (!userSkills.includes('javascript')) {
      learningPaths.push({
        title: "JavaScript & Web Development",
        description: "Master JavaScript for frontend and backend development",
        duration: "6-8 weeks",
        difficulty: "Intermediate",
        skills: ["JavaScript", "HTML", "CSS", "React"],
        resources: ["MDN Web Docs", "JavaScript.info", "React documentation"]
      });
    }
    if (!userSkills.includes('sql')) {
      learningPaths.push({
        title: "SQL & Database Management",
        description: "Learn SQL for data analysis and backend development",
        duration: "3-4 weeks",
        difficulty: "Beginner",
        skills: ["SQL", "Database Design", "Data Analysis"],
        resources: ["W3Schools SQL", "SQLBolt", "Khan Academy SQL"]
      });
    }
  }

  // Business sector learning paths
  if (userSector === 'marketing' || userSector === 'business') {
    if (!userSkills.includes('digital marketing')) {
      learningPaths.push({
        title: "Digital Marketing Fundamentals",
        description: "Learn digital marketing strategies and tools",
        duration: "4-5 weeks",
        difficulty: "Beginner",
        skills: ["Digital Marketing", "SEO", "Social Media Marketing"],
        resources: ["Google Digital Marketing Course", "HubSpot Academy", "Coursera Digital Marketing"]
      });
    }
    if (!userSkills.includes('excel')) {
      learningPaths.push({
        title: "Excel & Data Analysis",
        description: "Master Excel for business analysis and reporting",
        duration: "3-4 weeks",
        difficulty: "Beginner",
        skills: ["Excel", "Data Analysis", "Pivot Tables"],
        resources: ["Microsoft Excel Help", "ExcelJet", "Chandoo.org"]
      });
    }
  }

  // Finance sector learning paths
  if (userSector === 'finance') {
    if (!userSkills.includes('financial analysis')) {
      learningPaths.push({
        title: "Financial Analysis & Modeling",
        description: "Learn financial analysis techniques and Excel modeling",
        duration: "5-6 weeks",
        difficulty: "Intermediate",
        skills: ["Financial Analysis", "Excel", "Financial Modeling"],
        resources: ["CFI Financial Modeling", "Wall Street Prep", "Investopedia"]
      });
    }
  }

  // Design sector learning paths
  if (userSector === 'design') {
    if (!userSkills.includes('figma')) {
      learningPaths.push({
        title: "UI/UX Design with Figma",
        description: "Learn design principles and Figma for UI/UX work",
        duration: "4-5 weeks",
        difficulty: "Beginner",
        skills: ["Figma", "UI Design", "UX Research"],
        resources: ["Figma Academy", "Design+Code", "UX Mastery"]
      });
    }
  }

  // General skill learning paths
  if (!userSkills.includes('project management')) {
    learningPaths.push({
      title: "Project Management Fundamentals",
      description: "Learn project management principles and tools",
      duration: "3-4 weeks",
      difficulty: "Beginner",
      skills: ["Project Management", "Agile", "Team Collaboration"],
      resources: ["PMI Learning", "Coursera Project Management", "Asana Academy"]
    });
  }

  return learningPaths.slice(0, 3); // Return top 3 learning paths
}

// POST /recommend
app.post('/recommend', async (req, res) => {
  try {
    const user = req.body || {};

    const docs = await internshipsCol.find({}, { projection: { _id: 0 } }).toArray();
    const enriched = docs.map(doc => {
      const { score, reasons, narratives, category, matchingSkills, missingSkills, relatedSkills } = scoreInternship(user, doc);
      return { ...doc, score, reasons, narratives, category, matchingSkills, missingSkills, relatedSkills };
    });

    // Hide zero-score
    const filtered = enriched.filter(e => e.score > 0);

    // Sort primarily by score, tie-breakers: matching skills desc, location match last
    filtered.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aMatch = (a.matchingSkills || []).length;
      const bMatch = (b.matchingSkills || []).length;
      if (bMatch !== aMatch) return bMatch - aMatch;
      return 0;
    });

    // Categorize
    const best_fit = filtered.filter(e => e.category === 'best_fit').slice(0, 10);
    const growth = filtered.filter(e => e.category === 'growth').slice(0, 10);
    const alternative = filtered.filter(e => e.category === 'alternative').slice(0, 10);

    // Generate learning paths if no good matches
    let learningPaths = [];
    if (best_fit.length === 0 && growth.length === 0) {
      learningPaths = generateLearningPaths(user);
    }

    res.json({ best_fit, growth, alternative, learningPaths });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Autocomplete endpoints (skills, sector, location, education, department)
async function distinctLike(field, query) {
  if (!query || query.length < 1) return [];
  const pipeline = [
    { $match: { [field]: { $exists: true } } },
    { $group: { _id: `$${field}` } },
  ];
  const results = await internshipsCol.aggregate(pipeline).toArray();
  const values = results.map(r => r._id).filter(Boolean);
  const flat = Array.isArray(values[0]) ? [...new Set(values.flat().map(v => v.toString()))] : values.map(v => v.toString());
  return flat.filter(v => v.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
}

app.get('/autocomplete/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const q = (req.query.q || '').toString();
    let field;
    if (type === 'skills') field = 'skills';
    else if (type === 'sector') field = 'sector';
    else if (type === 'location') field = 'location';
    else if (type === 'education') field = 'education';
    else if (type === 'department') field = 'department';
    else return res.json([]);

    const data = await distinctLike(field, q);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.json([]);
  }
});

const PORT = process.env.PORT || 4000;
connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Node backend listening on :${PORT}`));
});


