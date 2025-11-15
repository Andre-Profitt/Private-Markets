import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default roles
  const roles = [
    { name: 'ADMIN', description: 'System administrator with full access' },
    { name: 'INVESTOR', description: 'Accredited investor' },
    { name: 'SELLER', description: 'Shareholder selling positions' },
    { name: 'COMPLIANCE', description: 'Compliance officer' },
    { name: 'OPS', description: 'Operations team member' },
  ];

  for (const roleData of roles) {
    await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData,
    });
  }

  console.log('Roles created');

  // Create admin user
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (adminRole) {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@platform.com' },
      update: {},
      create: {
        email: 'admin@platform.com',
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });

    // Assign admin role
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });

    console.log('Admin user created: admin@platform.com / admin123');
  }

  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
