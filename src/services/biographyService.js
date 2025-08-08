const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const upsertBiography = async (cvId, content) => {
  return prisma.biography.upsert({
    where: { cvId },
    update: { content },
    create: { cvId, content },
  });
};

module.exports = {
  upsertBiography,
};
