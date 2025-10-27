import bcrypt from 'bcryptjs';

import prisma from '../src/config/prisma';

async function main() {
  const roles = ['NationalAdmin', 'RegionalAdmin', 'DistrictAdmin', 'AssemblyAdmin', 'Pastor', 'Member'];

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const adminEmail = 'admin@brethrenfgm.org';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const nationalRole = await prisma.role.findUniqueOrThrow({ where: { name: 'NationalAdmin' } });
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: await bcrypt.hash('ChangeMe123!', 10),
        roleId: nationalRole.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
