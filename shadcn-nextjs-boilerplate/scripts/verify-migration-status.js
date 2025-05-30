const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Checking database tables...');
  
  const expectedTables = [
    'clients', 'projects', 'tasks',
    'suppliers', 'materials', 'material_collections', 
    'collection_materials', 'project_assets', 'material_samples'
  ];
  
  const results = {};
  
  for (const tableName of expectedTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        results[tableName] = { exists: false, error: error.message };
      } else {
        results[tableName] = { exists: true, count: count || 0 };
      }
    } catch (err) {
      results[tableName] = { exists: false, error: err.message };
    }
  }
  
  return results;
}

async function checkRLSPolicies() {
  console.log('🔒 Checking RLS policies...');
  
  try {
    // Query to check RLS status and policies
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          schemaname,
          tablename,
          rowsecurity as rls_enabled,
          (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policy_count
        FROM pg_tables t
        WHERE schemaname = 'public' 
        AND tablename IN ('clients', 'projects', 'tasks', 'suppliers', 'materials', 'material_collections', 'collection_materials', 'project_assets', 'material_samples')
        ORDER BY tablename;
      `
    });
    
    if (error) {
      console.log('⚠️  Could not check RLS policies via API');
      return null;
    }
    
    return data;
  } catch (err) {
    console.log('⚠️  Could not check RLS policies:', err.message);
    return null;
  }
}

async function checkIndexes() {
  console.log('📊 Checking indexes...');
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename IN ('clients', 'projects', 'tasks', 'suppliers', 'materials', 'material_collections', 'collection_materials', 'project_assets', 'material_samples')
        ORDER BY tablename, indexname;
      `
    });
    
    if (error) {
      console.log('⚠️  Could not check indexes via API');
      return null;
    }
    
    return data;
  } catch (err) {
    console.log('⚠️  Could not check indexes:', err.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Verifying Sylo Database Migration Status...');
  console.log('===============================================\n');
  
  // Check tables
  const tableResults = await checkTables();
  
  console.log('📋 TABLE STATUS:');
  console.log('================');
  
  let allTablesExist = true;
  for (const [tableName, result] of Object.entries(tableResults)) {
    if (result.exists) {
      console.log(`✅ ${tableName} - EXISTS (${result.count} rows)`);
    } else {
      console.log(`❌ ${tableName} - MISSING: ${result.error}`);
      allTablesExist = false;
    }
  }
  
  if (allTablesExist) {
    console.log('\n🎉 All required tables exist!');
  } else {
    console.log('\n⚠️  Some tables are missing. Migration needs to be completed.');
  }
  
  // Check RLS and indexes (these might fail due to API limitations)
  console.log('\n🔒 RLS & INDEX STATUS:');
  console.log('======================');
  
  const rlsData = await checkRLSPolicies();
  const indexData = await checkIndexes();
  
  if (!rlsData && !indexData) {
    console.log('⚠️  Cannot verify RLS policies and indexes via API.');
    console.log('📝 To complete the migration properly, you need to:');
    console.log('   1. Sign in to Supabase Dashboard');
    console.log('   2. Go to SQL Editor: https://supabase.com/dashboard/project/jnkfafylcsfnxcueecyx/sql');
    console.log('   3. Paste and run the combined migration SQL');
    console.log('   4. The SQL is available in: supabase/combined-migrations.sql');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('===========');
  console.log(`Tables created: ${Object.values(tableResults).filter(r => r.exists).length}/9`);
  console.log('RLS Policies: Unknown (requires manual verification)');
  console.log('Indexes: Unknown (requires manual verification)');
  console.log('Triggers: Unknown (requires manual verification)');
  
  if (allTablesExist) {
    console.log('\n✅ Core database structure is ready!');
    console.log('🔧 TypeScript types can be updated.');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkTables, checkRLSPolicies, checkIndexes };