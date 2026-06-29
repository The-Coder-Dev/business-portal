import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Point to the barrel index — drizzle-kit resolves all re-exports
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Verbose output during generate/push for debugging
  verbose: true,
  strict: true,
});
