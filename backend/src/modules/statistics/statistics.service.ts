import prisma from '@/config/prisma';

type Scope = {
  regionId?: string;
  districtId?: string;
  assemblyId?: string;
};

export async function getMemberStatistics(scope: Scope) {
  const { regionId, districtId, assemblyId } = scope;
  const whereClause = assemblyId
    ? { assemblyId }
    : districtId
      ? { assembly: { districtId } }
      : regionId
        ? { assembly: { district: { regionId } } }
        : {};

  const [members, maleCount, femaleCount] = await Promise.all([
    prisma.member.count({ where: whereClause }),
    prisma.member.count({ where: { ...whereClause, gender: 'MALE' } }),
    prisma.member.count({ where: { ...whereClause, gender: 'FEMALE' } }),
  ]);

  return {
    totalMembers: members,
    gender: { male: maleCount, female: femaleCount },
  };
}
