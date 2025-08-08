const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createExperience = async (cvId, company, position, startDate, endDate, description) => {
  return prisma.workExperience.create({
    data: {
      cvId,
      company,
      position,
      startDate,
      endDate,
      description,
    },
  });
};

const getExperienceById = async (id) => {
    return prisma.workExperience.findUnique({ where: { id }, include: { cv: true } });
};

const updateExperience = async (id, company, position, startDate, endDate, description) => {
  return prisma.workExperience.update({
    where: { id },
    data: {
      company,
      position,
      startDate,
      endDate,
      description,
    },
  });
};

const deleteExperience = async (id) => {
  return prisma.workExperience.delete({
    where: { id },
  });
};

module.exports = {
  createExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
