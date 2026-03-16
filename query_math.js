const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const res = await pool.query(`
      SELECT 
        difficulty,
        COUNT(*) as count
      FROM questions
      WHERE section = 'Mathematics'
      GROUP BY difficulty
      ORDER BY CASE difficulty WHEN 'easy' THEN 1 WHEN 'medium' THEN 2 WHEN 'hard' THEN 3 END
    `);
    console.log('Math question distribution:', res.rows);
    
    const samples = await pool.query(`
      SELECT id, prompt, difficulty, skillId, explanation
      FROM questions
      WHERE section = 'Mathematics'
      ORDER BY difficulty, RANDOM()
      LIMIT 5
    `);
    console.log('\nSample questions:');
    samples.rows.forEach(q => {
      console.log(`\n[${q.difficulty.toUpperCase()}] ${q.skillId}`);
      console.log(`Prompt: ${q.prompt.substring(0, 100)}...`);
    });
    
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
