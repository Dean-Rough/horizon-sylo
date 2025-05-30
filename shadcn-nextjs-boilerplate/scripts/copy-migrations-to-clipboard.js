const fs = require('fs');
const path = require('path');

function copyToClipboard(text) {
  // For macOS
  const { spawn } = require('child_process');
  const proc = spawn('pbcopy');
  proc.stdin.write(text);
  proc.stdin.end();
}

function prepareMigrationSQL() {
  console.log('📋 Preparing migration SQL for Supabase SQL Editor...');
  
  // Read Phase 2 migration
  const phase2Path = path.join(__dirname, '../supabase/phase2-migration.sql');
  const phase2SQL = fs.readFileSync(phase2Path, 'utf8');
  
  // Read Phase 3 migration
  const phase3Path = path.join(__dirname, '../supabase/phase3-migration.sql');
  const phase3SQL = fs.readFileSync(phase3Path, 'utf8');
  
  // Combine both migrations with clear separators
  const combinedSQL = `-- =====================================================
-- SYLO PROJECT MIGRATIONS - PHASE 2 & 3
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql
-- =====================================================

${phase2SQL}

-- =====================================================
-- END OF PHASE 2 - BEGINNING OF PHASE 3
-- =====================================================

${phase3SQL}

-- =====================================================
-- MIGRATION COMPLETE!
-- =====================================================
-- Verify all tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'clients', 'projects', 'tasks',
  'suppliers', 'materials', 'material_collections', 
  'collection_materials', 'project_assets', 'material_samples'
)
ORDER BY table_name;
`;

  // Save to file for manual use
  const outputPath = path.join(__dirname, '../supabase/combined-migrations.sql');
  fs.writeFileSync(outputPath, combinedSQL);
  
  console.log(`✅ Combined migration SQL saved to: ${outputPath}`);
  
  // Try to copy to clipboard (macOS)
  try {
    copyToClipboard(combinedSQL);
    console.log('📋 SQL copied to clipboard! You can now paste it into Supabase SQL Editor.');
  } catch (err) {
    console.log('⚠️  Could not copy to clipboard automatically. Please copy the file manually.');
  }
  
  console.log('\n🔗 Next steps:');
  console.log('1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql');
  console.log('2. Paste the SQL (from clipboard or file)');
  console.log('3. Click "Run" to execute the migration');
  console.log('4. Verify the tables were created successfully');
  
  return combinedSQL;
}

if (require.main === module) {
  prepareMigrationSQL();
}

module.exports = { prepareMigrationSQL };