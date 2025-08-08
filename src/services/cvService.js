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
    include: {
      viewCount: true,
    },
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

const cuid = require('cuid');

const togglePublic = async (id, isPublic) => {
  const cv = await getCvById(id);
  let data = { isPublic };
  if (isPublic && !cv.publicId) {
    data.publicId = cuid();
  }
  return prisma.cv.update({
    where: { id },
    data,
  });
};


// TODO: Add services for Biography, Skill, Education, Project, WorkExperience

module.exports = {
  createCv,
  getCvsByUserId,
  getCvById,
  updateCv,
  deleteCv,
  togglePublic,
};
