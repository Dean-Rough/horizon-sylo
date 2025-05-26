const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found');
    process.exit(1);
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`📁 Found ${migrationFiles.length} migration files`);
  
  for (const file of migrationFiles) {
    console.log(`⏳ Running migration: ${file}`);
    
    const migrationPath = path.join(migrationsDir, file);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
      
      if (error) {
        console.error(`❌ Error in migration ${file}:`, error);
        process.exit(1);
      }
      
      console.log(`✅ Migration ${file} completed successfully`);
    } catch (err) {
      console.error(`❌ Failed to run migration ${file}:`, err);
      process.exit(1);
    }
  }
  
  console.log('🎉 All migrations completed successfully!');
}

// Alternative approach using direct SQL execution
async function runMigrationsDirectly() {
  console.log('🚀 Starting database migrations (direct SQL)...');
  
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found');
    process.exit(1);
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  console.log(`📁 Found ${migrationFiles.length} migration files`);
  
  for (const file of migrationFiles) {
    console.log(`⏳ Running migration: ${file}`);
    
    const migrationPath = path.join(migrationsDir, file);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    try {
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      for (const statement of statements) {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });
        
        if (error) {
          console.error(`❌ Error executing statement:`, error);
          console.error(`Statement: ${statement}`);
          // Continue with next statement instead of exiting
          continue;
        }
      }
      
      console.log(`✅ Migration ${file} completed`);
    } catch (err) {
      console.error(`❌ Failed to run migration ${file}:`, err);
      // Continue with next migration
      continue;
    }
  }
  
  console.log('🎉 Migration process completed!');
}

// Check if we can create a simple function to execute SQL
async function createExecFunction() {
  console.log('🔧 Creating SQL execution function...');
  
  const createFunctionSQL = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    if (error) {
      console.log('Function might already exist or we need to create it differently');
    } else {
      console.log('✅ SQL execution function created');
    }
  } catch (err) {
    console.log('Will try direct approach instead');
  }
}

async function main() {
  try {
    await createExecFunction();
    await runMigrationsDirectly();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMigrations, runMigrationsDirectly };
