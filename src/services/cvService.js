const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createCv = async (userId, title) => {
  return prisma.cv.create({
    data: {
      title,
      userId,
    },
  });
};

const getCvsByUserId = async (userId) => {
  return prisma.cv.findMany({
    where: { userId },
  });
};

const getCvById = async (id) => {
  return prisma.cv.findUnique({
    where: { id },
    include: {
      biography: true,
      skills: true,
      educations: true,
      projects: true,
      experiences: true,
    },
  });
};

const updateCv = async (id, title) => {
  return prisma.cv.update({
    where: { id },
    data: {
      title,
    },
  });
};

const deleteCv = async (id) => {
  return prisma.cv.delete({
    where: { id },
  });
};

// TODO: Add services for Biography, Skill, Education, Project, WorkExperience

module.exports = {
  createCv,
  getCvsByUserId,
  getCvById,
  updateCv,
  deleteCv,
};
