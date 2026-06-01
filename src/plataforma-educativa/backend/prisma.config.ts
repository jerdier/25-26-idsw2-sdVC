import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx ts-node ./prisma/seed.ts',
  },
  datasource: {
    // Usamos el helper env() nativo de Prisma 7
    url: env('DATABASE_URL'),
  },
});