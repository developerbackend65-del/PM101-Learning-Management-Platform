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
  await prisma.course.create({
    data: {
      title: 'JavaScript Basics',
      description: 'Learn JavaScript from scratch',
      thumbnailUrl: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
      duration: 600,
      level: 'Beginner',
      price: 0,
      adminId: admin.id,
      modules: {
        create: [
          {
            title: 'Introduction to JavaScript',
            description: 'JavaScript basics',
            orderIndex: 1,

            lessons: {
              create: [
                {
                  title: 'What is JavaScript',
                  videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
                  orderIndex: 1,
                },
                {
                  title: 'Variables and Data Types',
                  videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'Functions and Arrays',
            description: 'Learn functions and arrays',
            orderIndex: 2,

            lessons: {
              create: [
                {
                  title: 'Functions',
                  videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
                  orderIndex: 1,
                },
                {
                  title: 'Arrays',
                  videoUrl: 'https://www.youtube.com/watch?v=oigfaZ5ApsM',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'DOM and Events',
            description: 'Learn DOM manipulation',
            orderIndex: 3,

            lessons: {
              create: [
                {
                  title: 'DOM Introduction',
                  videoUrl: 'https://www.youtube.com/watch?v=0ik6X4DJKCc',
                  orderIndex: 1,
                },
                {
                  title: 'Events in JavaScript',
                  videoUrl: 'https://www.youtube.com/watch?v=XF1_MlZ5l6M',
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // =========================
  // COURSE 2
  // =========================

  await prisma.course.create({
    data: {
      title: 'HTML & CSS Fundamentals',
      description: 'Learn HTML and CSS for beginners',
      thumbnailUrl: 'https://img.youtube.com/vi/mU6anWqZJcc/maxresdefault.jpg',
      duration: 720,
      level: 'Beginner',
      price: 0,
      adminId: admin.id,
      modules: {
        create: [
          {
            title: 'HTML Basics',
            description: 'Introduction to HTML',
            orderIndex: 1,

            lessons: {
              create: [
                {
                  title: 'HTML Introduction',
                  videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
                  orderIndex: 1,
                },
                {
                  title: 'HTML Forms',
                  videoUrl: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'CSS Basics',
            description: 'Introduction to CSS',
            orderIndex: 2,

            lessons: {
              create: [
                {
                  title: 'CSS Crash Course',
                  videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
                  orderIndex: 1,
                },
                {
                  title: 'Flexbox',
                  videoUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'Responsive Design',
            description: 'Responsive web design',
            orderIndex: 3,

            lessons: {
              create: [
                {
                  title: 'Media Queries',
                  videoUrl: 'https://www.youtube.com/watch?v=2KL-z9A56SQ',
                  orderIndex: 1,
                },
                {
                  title: 'Responsive Layout',
                  videoUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s',
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // =========================
  // COURSE 3
  // =========================

  await prisma.course.create({
    data: {
      title: 'Node.js Basics',
      description: 'Learn Node.js fundamentals',
      thumbnailUrl: 'https://img.youtube.com/vi/TlB_eWDSMt4/maxresdefault.jpg',
      duration: 800,
      level: 'Intermediate',
      price: 0,
      adminId: admin.id,
      modules: {
        create: [
          {
            title: 'Node.js Introduction',
            description: 'Getting started with Node.js',
            orderIndex: 1,

            lessons: {
              create: [
                {
                  title: 'What is Node.js',
                  videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
                  orderIndex: 1,
                },
                {
                  title: 'Installing Node.js',
                  videoUrl: 'https://www.youtube.com/watch?v=ENrzD9HAZK4',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'Express Basics',
            description: 'Learn Express.js',
            orderIndex: 2,

            lessons: {
              create: [
                {
                  title: 'Express Introduction',
                  videoUrl: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
                  orderIndex: 1,
                },
                {
                  title: 'Routes and Controllers',
                  videoUrl: 'https://www.youtube.com/watch?v=pKd0Rpw7O48',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'REST APIs',
            description: 'Build REST APIs',
            orderIndex: 3,

            lessons: {
              create: [
                {
                  title: 'REST API Basics',
                  videoUrl: 'https://www.youtube.com/watch?v=fgTGADljAeg',
                  orderIndex: 1,
                },
                {
                  title: 'CRUD Operations',
                  videoUrl: 'https://www.youtube.com/watch?v=l8WPWK9mS5M',
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // =========================
  // COURSE 4
  // =========================

  await prisma.course.create({
    data: {
      title: 'React for Beginners',
      description: 'Learn React from scratch',
      thumbnailUrl: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
      duration: 900,
      level: 'Intermediate',
      price: 0,
      adminId: admin.id,
      modules: {
        create: [
          {
            title: 'React Basics',
            description: 'Introduction to React',
            orderIndex: 1,

            lessons: {
              create: [
                {
                  title: 'What is React',
                  videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
                  orderIndex: 1,
                },
                {
                  title: 'JSX and Components',
                  videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'State and Props',
            description: 'Learn state and props',
            orderIndex: 2,

            lessons: {
              create: [
                {
                  title: 'React Props',
                  videoUrl: 'https://www.youtube.com/watch?v=PHaECbrKgs0',
                  orderIndex: 1,
                },
                {
                  title: 'React State',
                  videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
                  orderIndex: 2,
                },
              ],
            },
          },

          {
            title: 'React Hooks',
            description: 'Learn React hooks',
            orderIndex: 3,

            lessons: {
              create: [
                {
                  title: 'useState Hook',
                  videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
                  orderIndex: 1,
                },
                {
                  title: 'useEffect Hook',
                  videoUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
                  orderIndex: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('🌱 Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
