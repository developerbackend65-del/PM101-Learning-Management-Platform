import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  const permissions = [
    {
      name: 'manage_users',
      description: 'Create, update, delete, and view all users in the system',
    },
    {
      name: 'manage_courses',
      description: 'Create, update, delete, and publish courses',
    },
    {
      name: 'manage_content',
      description: 'Create, update, and delete course content and materials',
    },
    {
      name: 'view_analytics',
      description: 'View platform analytics, reports, and statistics',
    },
    {
      name: 'manage_orders',
      description: 'View, process, and manage customer orders and payments',
    },
    {
      name: 'manage_learning_paths',
      description: 'Create, update, and delete learning paths and curricula',
    },
  ];

  console.log('Seeding permissions...');

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: { description: permission.description },
      create: permission,
    });

    console.log(`✓ ${permission.name}`);
  }

  console.log('\n✅ Permissions seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
