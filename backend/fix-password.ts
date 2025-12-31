import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function fixPasswords() {
  try {
    console.log('Fixing user passwords...');
    
    // Fix admin password
    const adminPassword = await bcrypt.hash('LDSSadmin123', 10);
    const admin = await prisma.user.update({
      where: { id: '202501' },
      data: { password: adminPassword }
    });
    console.log('✅ Admin password fixed:', admin.id);
    
    // Fix staff password  
    const staffPassword = await bcrypt.hash('LDSSstaff123', 10);
    const staff = await prisma.user.update({
      where: { id: '2025001' },
      data: { 
        password: staffPassword,
        email: 'staff@ldss.edu.zm' // Add email to fix null issue
      }
    });
    console.log('✅ Staff password fixed:', staff.id);
    
    // Create/update student password
    const studentPassword = 'LDSS2025'; // Plain text for student
    const student = await prisma.user.upsert({
      where: { id: '202500123456' },
      update: { password: studentPassword },
      create: {
        id: '202500123456',
        email: 'learner@ldss.edu.zm',
        password: studentPassword,
        role: 'STUDENT'
      }
    });
    console.log('✅ Student user fixed:', student.id);
    
    console.log('\n🎉 All passwords fixed!');
    console.log('Login credentials:');
    console.log('Admin: 202501 / LDSSadmin123');
    console.log('Staff: 2025001 / LDSSstaff123');  
    console.log('Student: 202500123456 / LDSS2025');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
