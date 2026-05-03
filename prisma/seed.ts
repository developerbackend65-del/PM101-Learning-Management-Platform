import { PrismaClient, UserRole } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // ✅ 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@test.com',
      password_hash: 'hashed_password',
      role: UserRole.Admin,
      is_verified: true,
    },
  });

  console.log('Admin created:', admin.id);

  // ✅ 2. Create Courses + Modules + Lessons
  for (let i = 1; i <= 5; i++) {
    const course = await prisma.course.create({
      data: {
        title: `Course ${i}`,
        description: `Description for course ${i}`,
        level: i % 2 === 0 ? 'BEGINNER' : 'INTERMEDIATE',
        duration: 60 * i,
        adminId: admin.id,

        modules: {
          create: [
            {
              title: `Course ${i} - Module 1`,
              description: 'Module 1 description',
              orderIndex: 1,

              lessons: {
                create: [
                  {
                    title: 'Lesson 1',
                    content: 'Lesson 1 content',
                    orderIndex: 1,
                    videoUrl: 'https://video.com/1',
                  },
                  {
                    title: 'Lesson 2',
                    content: 'Lesson 2 content',
                    orderIndex: 2,
                    videoUrl: 'https://video.com/2',
                  },
                ],
              },
            },
            {
              title: `Course ${i} - Module 2`,
              description: 'Module 2 description',
              orderIndex: 2,

              lessons: {
                create: [
                  {
                    title: 'Lesson 1',
                    content: 'Lesson 1 content',
                    orderIndex: 1,
                    videoUrl: 'https://video.com/1',
                  },
                  {
                    title: 'Lesson 2',
                    content: 'Lesson 2 content',
                    orderIndex: 2,
                    videoUrl: 'https://video.com/2',
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`Course ${i} created:`, course.id);
  }

  console.log('🌱 Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
