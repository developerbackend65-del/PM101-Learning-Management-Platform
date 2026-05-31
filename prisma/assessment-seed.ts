import { PrismaClient, QuestionType } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// ─────────────────────────────────────────────────────────────
// 👇 REPLACE these with your real IDs from the database
// ─────────────────────────────────────────────────────────────
const COURSE_HTML_CSS_ID = 'f6a408e5-b401-4019-be90-2f7f102ead5f'; // HTML & CSS Fundamentals
const COURSE_NODEJS_ID = '52f99b77-6bed-4ba4-81fa-abe753323085'; // Node.js Basics

const MODULE_DOM_EVENTS_ID = '7e85e69a-5ad3-4c1c-bd07-6a13ac94b329'; // JS: DOM and Events
const MODULE_NODEJS_INTRO_ID = '4afda63c-621a-4f81-aece-cee4578b068a'; // Node: Node.js Introduction
const MODULE_REACT_BASICS_ID = 'eb572e26-45fd-4315-8b96-b06233444cb8'; // React: React Basics
const MODULE_STATE_PROPS_ID = 'ad4abc6a-dcaa-458e-bf0f-c556584bc641'; // React: State and Props
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding assessments...\n');

  // ─────────────────────────────────────────────
  // COURSE ASSESSMENT 1 — HTML & CSS Fundamentals
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      courseId: COURSE_HTML_CSS_ID,
      title: 'HTML & CSS Fundamentals – Final Assessment',
      passingScore: 70,
      timeLimit: 25,
      questions: {
        create: [
          {
            text: 'Which HTML tag defines the largest heading?',
            type: QuestionType.multiple_choice,
            options: { a: '<h6>', b: '<heading>', c: '<h1>', d: '<head>' },
            correctAnswer: 'c',
          },
          {
            text: 'Which CSS property controls text color?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'font-color',
              b: 'text-color',
              c: 'color',
              d: 'foreground',
            },
            correctAnswer: 'c',
          },
          {
            text: 'CSS class selectors are defined with a "#" symbol.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'b',
          },
        ],
      },
    },
  });
  console.log('✅ Course assessment created: HTML & CSS Fundamentals');

  // ─────────────────────────────────────────────
  // COURSE ASSESSMENT 2 — Node.js Basics
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      courseId: COURSE_NODEJS_ID,
      title: 'Node.js Basics – Final Assessment',
      passingScore: 70,
      timeLimit: 30,
      questions: {
        create: [
          {
            text: 'What is Node.js?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'A browser-based JavaScript framework',
              b: 'A server-side JavaScript runtime built on V8',
              c: 'A CSS preprocessor',
              d: 'A database management system',
            },
            correctAnswer: 'b',
          },
          {
            text: 'Which built-in module creates an HTTP server in Node.js?',
            type: QuestionType.multiple_choice,
            options: { a: 'fs', b: 'path', c: 'http', d: 'url' },
            correctAnswer: 'c',
          },
          {
            text: 'Express.js is a built-in Node.js module.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'b',
          },
        ],
      },
    },
  });
  console.log('✅ Course assessment created: Node.js Basics');

  // ─────────────────────────────────────────────
  // MODULE ASSESSMENT 1 — JS: DOM and Events
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      moduleId: MODULE_DOM_EVENTS_ID,
      title: 'DOM and Events – Module Quiz',
      passingScore: 60,
      timeLimit: 15,
      questions: {
        create: [
          {
            text: 'Which method selects an element by its ID?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'querySelector()',
              b: 'getElementById()',
              c: 'getElementByClass()',
              d: 'selectById()',
            },
            correctAnswer: 'b',
          },
          {
            text: 'Which property changes the visible text of an element?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'innerText',
              b: 'textValue',
              c: 'nodeContent',
              d: 'htmlContent',
            },
            correctAnswer: 'a',
          },
          {
            text: 'document.querySelector() returns all matching elements as an array.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'b',
          },
        ],
      },
    },
  });
  console.log('✅ Module assessment created: DOM and Events');

  // ─────────────────────────────────────────────
  // MODULE ASSESSMENT 2 — Node: Node.js Introduction
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      moduleId: MODULE_NODEJS_INTRO_ID,
      title: 'Node.js Introduction – Module Quiz',
      passingScore: 60,
      timeLimit: 15,
      questions: {
        create: [
          {
            text: 'Which JavaScript engine does Node.js use?',
            type: QuestionType.multiple_choice,
            options: { a: 'SpiderMonkey', b: 'V8', c: 'Chakra', d: 'Nitro' },
            correctAnswer: 'b',
          },
          {
            text: 'Which file lists all project dependencies in a Node.js project?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'node_modules.json',
              b: 'deps.json',
              c: 'package.json',
              d: 'config.json',
            },
            correctAnswer: 'c',
          },
          {
            text: 'Node.js runs JavaScript inside the browser.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'b',
          },
        ],
      },
    },
  });
  console.log('✅ Module assessment created: Node.js Introduction');

  // ─────────────────────────────────────────────
  // MODULE ASSESSMENT 3 — React: React Basics
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      moduleId: MODULE_REACT_BASICS_ID,
      title: 'React Basics – Module Quiz',
      passingScore: 60,
      timeLimit: 15,
      questions: {
        create: [
          {
            text: 'What is React?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'A back-end framework for Node.js',
              b: 'A JavaScript library for building user interfaces',
              c: 'A CSS preprocessor',
              d: 'A database query language',
            },
            correctAnswer: 'b',
          },
          {
            text: 'What does JSX stand for?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'JavaScript XML',
              b: 'Java Syntax Extension',
              c: 'JSON XML',
              d: 'JavaScript Extra',
            },
            correctAnswer: 'a',
          },
          {
            text: 'A React component name must start with an uppercase letter.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'a',
          },
        ],
      },
    },
  });
  console.log('✅ Module assessment created: React Basics');

  // ─────────────────────────────────────────────
  // MODULE ASSESSMENT 4 — React: State and Props
  // ─────────────────────────────────────────────
  await prisma.assessment.create({
    data: {
      moduleId: MODULE_STATE_PROPS_ID,
      title: 'State and Props – Module Quiz',
      passingScore: 60,
      timeLimit: 15,
      questions: {
        create: [
          {
            text: 'What are props in React?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'Internal mutable state of a component',
              b: 'Read-only data passed from parent to child',
              c: 'CSS properties applied to components',
              d: 'Global variables in the app',
            },
            correctAnswer: 'b',
          },
          {
            text: 'Which hook manages state in a functional component?',
            type: QuestionType.multiple_choice,
            options: {
              a: 'useEffect',
              b: 'useContext',
              c: 'useState',
              d: 'useReducer',
            },
            correctAnswer: 'c',
          },
          {
            text: 'Props can be modified directly inside the child component.',
            type: QuestionType.true_false,
            options: { a: 'True', b: 'False' },
            correctAnswer: 'b',
          },
        ],
      },
    },
  });
  console.log('✅ Module assessment created: State and Props');

  console.log('\n🎉 Done! 6 assessments × 3 questions = 18 questions total.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
