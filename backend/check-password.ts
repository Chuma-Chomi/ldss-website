import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function checkPassword() {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: '202501' },
      select: { id: true, password: true, role: true }
    });
    
    if (admin) {
      console.log('Admin user found:', admin.id);
      console.log('Password hash:', admin.password);
      
      // Test the expected password
      const isValid = await bcrypt.compare('LDSSadmin123', admin.password);
      console.log('Password "LDSSadmin123" is valid:', isValid);
      
      // Test alternative passwords
      const testPasswords = ['LDSSadmin123', 'admin123', 'password', 'LDSSadmin'];
      for (const pwd of testPasswords) {
        const valid = await bcrypt.compare(pwd, admin.password);
        console.log(`Password "${pwd}" is valid:`, valid);
      }
    } else {
      console.log('Admin user not found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPassword();
