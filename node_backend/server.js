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

// Scoring function with skill priority and narratives
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

  // Skill overlap: strongly weighted
  const matchingSkills = [...iSkills].filter(s => userSkills.has(s));
  const missingSkills = [...iSkills].filter(s => !userSkills.has(s));
  const relatedSkills = [...iSkills].filter(s => getRelatedSkills(user.skills || []).has(s));

  // Skill match is prioritized: +2 per exact skill, +1 per related skill, cap related bonus to not exceed exacts
  if (matchingSkills.length > 0) {
    score += matchingSkills.length * 2;
    reasons.push(`Skill match: ${matchingSkills.join(', ')}`);
  }
  if (relatedSkills.length > 0) {
    score += Math.min(relatedSkills.length, Math.max(0, matchingSkills.length));
    reasons.push(`Related skills: ${relatedSkills.join(', ')}`);
  }

  // Education/Department/Sector: secondary
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

  // Location: tie-breaker/low weight, only if skills are non-zero or other criteria exist
  if ((matchingSkills.length > 0 || relatedSkills.length > 0) && userLocation && userLocation === iLocation) {
    score += 1;
    reasons.push(`Location matches: ${intern.location}`);
  }

  // Opportunity gap: if missing 1–2 skills but otherwise decent alignment
  const opportunityGap = missingSkills.length > 0 && missingSkills.length <= 2 && (matchingSkills.length >= 1 || userSector === iSector || userDept === iDept);
  if (opportunityGap) {
    score += 1; // small boost to surface growth roles
    const gapText = missingSkills.join(', ');
    reasons.push(`Growth potential: add ${gapText} to qualify fully`);
  }

  // Narrative explanation
  const narratives = [];
  if (matchingSkills.length >= 2) {
    narratives.push(`Because you know ${matchingSkills.slice(0, 3).join(', ')}, this role aligns strongly.`);
  } else if (matchingSkills.length === 1) {
    narratives.push(`Because you know ${matchingSkills[0]}, this role could be a good fit.`);
  }
  if (relatedSkills.length > 0) {
    narratives.push(`Your background connects to ${relatedSkills.join(', ')}, which this role values.`);
  }
  if (opportunityGap) {
    narratives.push(`Suggested as a stretch role: learn ${missingSkills.join(', ')} to be fully qualified.`);
  }
  if (userEducation === iEducation) {
    narratives.push(`Your education (${intern.education}) matches this internship.`);
  }
  if (userDept === iDept) {
    narratives.push(`Your department (${intern.department}) is relevant here.`);
  }
  if (userSector === iSector) {
    narratives.push(`You are targeting the same sector (${intern.sector}).`);
  }
  if (userLocation === iLocation && (matchingSkills.length > 0 || relatedSkills.length > 0)) {
    narratives.push(`This is also in your preferred location (${intern.location}).`);
  }

  // Category classification
  let category = 'alternative';
  if (matchingSkills.length >= 3) {
    category = 'best_fit';
  } else if (opportunityGap) {
    category = 'growth';
  } else if (matchingSkills.length >= 1 || relatedSkills.length >= 2) {
    category = 'best_fit';
  }

  return { score, reasons, narratives, category, matchingSkills, missingSkills, relatedSkills };
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

    res.json({ best_fit, growth, alternative });
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


