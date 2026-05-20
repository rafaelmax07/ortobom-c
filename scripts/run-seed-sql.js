const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF;

if (!token || !projectRef) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN or SUPABASE_PROJECT_REF in .env.local');
  process.exit(1);
}

const sqlPath = path.join(__dirname, '../supabase/seed.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('❌ seed.sql not found at ' + sqlPath);
  process.exit(1);
}

const query = fs.readFileSync(sqlPath, 'utf8');

async function runSeed() {
  console.log(`🚀 Sending seed.sql (~${Math.round(query.length / 1024)} KB) to Supabase project ${projectRef}...`);
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('❌ Error executing SQL:', data);
      process.exit(1);
    }

    console.log('✅ SQL executed successfully! Database seeded successfully.');
  } catch (err) {
    console.error('❌ Network error executing SQL:', err);
    process.exit(1);
  }
}

runSeed();
