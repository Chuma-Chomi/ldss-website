import { PrismaClient, Role, StaffRole, GradeLevel, Audience, ProfileType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('LDSSadmin123', 10); // Admin default password

  // Create Admin user with TS number
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ldss.edu.zm' },
    update: {},
    create: {
      id: '202501',
      email: 'admin@ldss.edu.zm',
      password: adminPassword,
      role: Role.ADMIN,
      profile: {
        create: {
          firstName: 'Muma',
          lastName: 'Abraham',
          phone: '+260123456789',
          type: ProfileType.STAFF,
          staff: {
            create: {
              tsNumber: '202501', // Admin TS number (6 digits)
              position: StaffRole.ADMIN
            },
          },
        },
      },
    },
    include: { profile: { include: { staff: true } } },
  });

  // Create Staff user with TS number (for registration example)
  const staffPassword = await bcrypt.hash('LDSSstaff123', 10);
  const staffUser = await prisma.user.upsert({
    where: { email: 'staff@ldss.edu.zm' },
    update: {},
    create: {
      id: '2025001',
      email: 'staff@ldss.edu.zm',
      password: staffPassword, // Hashed staff password
      role: Role.TEACHER,
      profile: {
        create: {
          firstName: 'Mukisi',
          lastName: 'Desmond',
          phone: '+260987654321',
          type: ProfileType.STAFF,
          staff: {
            create: {
              tsNumber: '2025001', // Staff TS number (7 digits)
              position: StaffRole.DEPUTY,
              subjects: ['Mathematics', 'English']
            },
          },
        },
      },
    },
    include: { profile: { include: { staff: true } } },
  });

  // Create Learner user with Exam Number (12 digits, stored as learnerId)
  const learnerUser = await prisma.user.upsert({
    where: { email: 'learner@ldss.edu.zm' },
    update: {},
    create: {
      id: '202500123456',
      email: 'learner@ldss.edu.zm',
      password: 'LDSS2025', // Default password for learners
      role: Role.STUDENT,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Banda',
          phone: '+260555555555',
          type: ProfileType.STUDENT,
          student: {
            create: {
              learnerId: '202500123456', // Exam number (12 digits) stored as learnerId
              grade: GradeLevel.FORM2,
              section: 'A',
              guardians: [{ name: 'Mr. Banda', phone: '+260955123456' }]
            },
          },
        },
      },
    },
    include: { profile: { include: { student: true } } },
  });

  const sampleClass = await prisma.class.create({
    data: {
      name: 'Form 2A Mathematics',
      grade: GradeLevel.FORM2,
      section: 'A',
      capacity: 40,
      instructorId: staffUser.profile?.staff?.id,
    },
    include: { instructor: { include: { profile: true } } },
  });

  await prisma.enrollment.create({
    data: {
      studentId: learnerUser.profile?.student?.id!,
      classId: sampleClass.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Welcome to LDSS Portal',
      body: 'The unified school management system is now live. Please log in with your credentials.',
      audience: Audience.ALL,
      published: true,
      staffId: adminUser.profile?.staff?.id!,
    },
  });

  console.log('Seed data created successfully');
  console.log('');
  console.log('LOGIN CREDENTIALS:');
  console.log('==================');
  console.log('Admin Login:');
  console.log('  Username: 202501');
  console.log('  Password: LDSSadmin123');
  console.log('');
  console.log('Staff Login:');
  console.log('  Username: 2025001');
  console.log('  Password: LDSSstaff123');
  console.log('');
  console.log('Learner Login:');
  console.log('  Username: 202500123456');
  console.log('  Password: LDSS2025');
  console.log('');
  console.log('REGISTRATION FORMATS:');
  console.log('====================');
  console.log('Staff Registration:');
  console.log('  TS Number: 4-15 digits ONLY (no letters)');
  console.log('  Password: Custom password set during registration');
  console.log('  Example: 2025002 / customPassword');
  console.log('');
  console.log('Learner Registration:');
  console.log('  Exam Number: 12-15 digits ONLY (no letters)');
  console.log('  Password: Default LDSS2025 (can be changed later)');
  console.log('  Example: 202500123457 / LDSS2025');
  console.log('');
  console.log('IMPORTANT: Whoever registers gets their own unique ID!');
  console.log('These are just sample credentials for testing.');
  console.log('All IDs must be NUMBERS ONLY - no letters allowed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
