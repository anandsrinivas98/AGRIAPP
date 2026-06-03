import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Enables Row-Level Security (RLS) on all tables in the public schema.
 * This secures all tables from public access (via Supabase REST API / anon key)
 * by defaulting to "default deny" behavior. Direct connections (like the backend's)
 * connect as the owner 'postgres' and bypass RLS automatically.
 */
async function enableRlsOnAllTables() {
  try {
    console.log('🔒 Starting database RLS enforcement...');

    // Run dynamic SQL to enable RLS on all tables in the public schema
    await prisma.$executeRawUnsafe(`
      DO $$
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN 
              SELECT tablename 
              FROM pg_tables 
              WHERE schemaname = 'public'
          LOOP
              EXECUTE format('ALTER TABLE "public".%I ENABLE ROW LEVEL SECURITY;', r.tablename);
              RAISE NOTICE 'Enabled RLS on table: %', r.tablename;
          END LOOP;
      END $$;
    `);

    console.log('✅ Successfully enabled Row-Level Security (RLS) on all public tables!');
  } catch (error) {
    console.error('❌ Failed to enable Row-Level Security (RLS):', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  enableRlsOnAllTables()
    .then(() => {
      console.log('\n✨ Database security update completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database security update failed:', error);
      process.exit(1);
    });
}

export { enableRlsOnAllTables };
