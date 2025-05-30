const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filePath, phaseName) {
  console.log(`⏳ Running ${phaseName} migration: ${path.basename(filePath)}`);
  
  try {
    const migrationSQL = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL into individual statements, handling multi-line statements properly
    const statements = migrationSQL
      .split(/;\s*(?=\n|$)/) // Split on semicolon followed by whitespace and newline or end
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== ';');
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip empty statements and comments
      if (!statement || statement.startsWith('--')) {
        continue;
      }
      
      try {
        // Use the from() method to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });
        
        if (error) {
          // Try alternative approach if exec_sql doesn't exist
          if (error.message?.includes('function exec_sql') || error.code === '42883') {
            console.log('🔄 Trying alternative SQL execution method...');
            
            // For DDL statements, we can try using the REST API directly
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey
              },
              body: JSON.stringify({ sql: statement + ';' })
            });
            
            if (!response.ok) {
              console.error(`❌ Error executing statement ${i + 1}:`, await response.text());
              console.error(`Statement: ${statement.substring(0, 100)}...`);
              errorCount++;
              continue;
            }
          } else {
            console.error(`❌ Error executing statement ${i + 1}:`, error);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
            continue;
          }
        }
        
        successCount++;
        
        // Show progress for long migrations
        if (i % 10 === 0 && i > 0) {
          console.log(`   📊 Progress: ${i}/${statements.length} statements processed`);
        }
        
      } catch (err) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, err.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log(`✅ ${phaseName} migration completed: ${successCount} successful, ${errorCount} errors`);
    
    if (errorCount > 0) {
      console.log(`⚠️  Some statements failed, but migration continued. Check the errors above.`);
    }
    
    return { success: successCount, errors: errorCount };
    
  } catch (err) {
    console.error(`❌ Failed to read or process migration file:`, err);
    throw err;
  }
}

async function verifyTables(expectedTables) {
  console.log('🔍 Verifying tables were created...');
  
  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Table '${tableName}' verification failed:`, error.message);
      } else {
        console.log(`✅ Table '${tableName}' exists and is accessible`);
      }
    } catch (err) {
      console.error(`❌ Error verifying table '${tableName}':`, err.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting Sylo Phase 2 & 3 Database Migrations...');
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  
  try {
    // Test connection
    const { data: testData, error: testError } = await supabase.auth.getSession();
    if (testError && !testError.message.includes('session')) {
      console.error('❌ Failed to connect to Supabase:', testError);
      process.exit(1);
    }
    console.log('✅ Connected to Supabase successfully');
    
    // Phase 2 Migration
    console.log('\n🏗️  PHASE 2: Project Management Tables');
    console.log('=====================================');
    
    const phase2Path = path.join(__dirname, '../supabase/phase2-migration.sql');
    if (!fs.existsSync(phase2Path)) {
      console.error(`❌ Phase 2 migration file not found: ${phase2Path}`);
      process.exit(1);
    }
    
    const phase2Result = await executeSQLFile(phase2Path, 'Phase 2');
    
    // Verify Phase 2 tables
    await verifyTables(['clients', 'projects', 'tasks']);
    
    // Phase 3 Migration
    console.log('\n🎨 PHASE 3: Material Library System');
    console.log('===================================');
    
    const phase3Path = path.join(__dirname, '../supabase/phase3-migration.sql');
    if (!fs.existsSync(phase3Path)) {
      console.error(`❌ Phase 3 migration file not found: ${phase3Path}`);
      process.exit(1);
    }
    
    const phase3Result = await executeSQLFile(phase3Path, 'Phase 3');
    
    // Verify Phase 3 tables
    await verifyTables([
      'suppliers', 
      'materials', 
      'material_collections', 
      'collection_materials', 
      'project_assets', 
      'material_samples'
    ]);
    
    // Summary
    console.log('\n🎉 MIGRATION SUMMARY');
    console.log('===================');
    console.log(`Phase 2: ${phase2Result.success} successful, ${phase2Result.errors} errors`);
    console.log(`Phase 3: ${phase3Result.success} successful, ${phase3Result.errors} errors`);
    
    const totalErrors = phase2Result.errors + phase3Result.errors;
    if (totalErrors === 0) {
      console.log('✅ All migrations completed successfully!');
      console.log('🚀 Database is ready for Sylo project management and material library features');
    } else {
      console.log(`⚠️  Migrations completed with ${totalErrors} total errors. Please review the output above.`);
    }
    
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, executeSQLFile, verifyTables };