const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createEducation = async (cvId, institution, degree, startDate, endDate, description) => {
  return prisma.education.create({
    data: {
      cvId,
      institution,
      degree,
      startDate,
      endDate,
      description,
    },
  });
};

const getEducationById = async (id) => {
    return prisma.education.findUnique({ where: { id }, include: { cv: true } });
};

const updateEducation = async (id, institution, degree, startDate, endDate, description) => {
  return prisma.education.update({
    where: { id },
    data: {
      institution,
      degree,
      startDate,
      endDate,
      description,
    },
  });
};

const deleteEducation = async (id) => {
  return prisma.education.delete({
    where: { id },
  });
};

module.exports = {
  createEducation,
  getEducationById,
  updateEducation,
  deleteEducation,
};
