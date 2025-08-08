const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createCv = async (userId, title, content) => {
  return prisma.cv.create({
    data: {
      title,
      content,
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
  });
};

const updateCv = async (id, title, content) => {
  return prisma.cv.update({
    where: { id },
    data: {
      title,
      content,
    },
  });
};

const deleteCv = async (id) => {
  return prisma.cv.delete({
    where: { id },
  });
};

module.exports = {
  createCv,
  getCvsByUserId,
  getCvById,
  updateCv,
  deleteCv,
};
