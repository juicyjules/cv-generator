const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSkill = async (cvId, name, level) => {
  return prisma.skill.create({
    data: {
      cvId,
      name,
      level,
    },
  });
};

const getSkillById = async (id) => {
    return prisma.skill.findUnique({ where: { id }, include: { cv: true } });
};

const updateSkill = async (id, name, level) => {
  return prisma.skill.update({
    where: { id },
    data: {
      name,
      level,
    },
  });
};

const deleteSkill = async (id) => {
  return prisma.skill.delete({
    where: { id },
  });
};

module.exports = {
  createSkill,
  getSkillById,
  updateSkill,
  deleteSkill,
};
