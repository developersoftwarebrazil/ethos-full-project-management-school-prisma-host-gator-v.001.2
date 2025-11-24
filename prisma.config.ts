import { defineConfig } from '@prisma/config';

// Prisma 6 aceita string, mas a tipagem instalada é do Prisma 7.
// Por isso ignoramos a tipagem aqui.
export default defineConfig({
  // @ts-expect-error Prisma 6 supports string schema, Prisma 7 types conflict
  schema: './prisma/schema.prisma',

  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});

