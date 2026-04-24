import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Coordinator (ADMIN)
  const coord = await prisma.user.upsert({
    where: { email: 'coord@smartseason.io' },
    update: {},
    create: {
      name: 'Coordinator Adaeze',
      email: 'coord@smartseason.io',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create Field Agent
  const agent = await prisma.user.upsert({
    where: { email: 'amina@smartseason.io' },
    update: {},
    create: {
      name: 'Amina Yusuf',
      email: 'amina@smartseason.io',
      password: hashedPassword,
      role: 'FIELD_AGENT',
    },
  });

  const agent2 = await prisma.user.upsert({
    where: { email: 'david@smartseason.io' },
    update: {},
    create: {
      name: 'David Okello',
      email: 'david@smartseason.io',
      password: hashedPassword,
      role: 'FIELD_AGENT',
    },
  });

  // 3. Create some fields
  const field1 = await prisma.field.create({
    data: {
      name: 'North Ridge',
      crop_type: 'Maize',
      planting_date: new Date('2025-02-12'),
      current_stage: 'Growing',
      assigned_agent_id: agent.id,
      created_by_id: coord.id,
    },
  });

  const field2 = await prisma.field.create({
    data: {
      name: 'Riverside Plot',
      crop_type: 'Rice',
      planting_date: new Date('2025-01-08'),
      current_stage: 'Ready',
      assigned_agent_id: agent2.id,
      created_by_id: coord.id,
    },
  });

  const field3 = await prisma.field.create({
    data: {
      name: 'Old Mill Field',
      crop_type: 'Soybean',
      planting_date: new Date('2024-09-04'),
      current_stage: 'Harvested',
      assigned_agent_id: agent.id,
      created_by_id: coord.id,
    },
  });

  // 4. Create some FieldUpdates (Logs)
  await prisma.fieldUpdate.create({
    data: {
      field_id: field1.id,
      updated_by_id: agent.id,
      stage: 'Growing',
      notes: 'Initial growth phase looking good.',
    },
  });

  await prisma.fieldUpdate.create({
    data: {
      field_id: field2.id,
      updated_by_id: agent2.id,
      stage: 'Ready',
      notes: 'Expected yield is high.',
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
