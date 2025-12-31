import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });
    console.log('Users in database:');
    console.table(users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
