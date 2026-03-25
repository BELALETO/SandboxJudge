import fs from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Problem from '../src/modules/problem/problem.model.js';

const uri = 'mongodb://172.18.0.3:27017/SandboxJudge';

async function seedProblems() {
  try {
    await mongoose.connect(uri);

    const dataPath = path.join(process.cwd(), 'seed', 'problems.json');
    const data = await fs.readFile(dataPath, 'utf-8');
    const problems = JSON.parse(data);
    // console.log('problems :>> ', problems);

    const problemsWithSlug = problems.map((p) => ({
      ...p,
      slug: slugify(p.title, { lower: true })
    }));

    await Problem.deleteMany({});
    await Problem.insertMany(problemsWithSlug, { ordered: false });

    console.log('Problems seeded successfully!');
  } catch (error) {
    console.error('Error seeding problems:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteProblems() {
  try {
    await mongoose.connect(uri);
    await Problem.deleteMany({});
    console.log('All problems deleted successfully!');
  } catch (error) {
    console.error('Error deleting problems:', error);
  } finally {
    await mongoose.disconnect();
  }
}

const command = process.argv[2];

if (command === '--delete') {
  deleteProblems();
} else if (command === '--seed') {
  seedProblems();
} else {
  console.log('Usage: node seed.js --seed | --delete');
  process.exit(1);
}
