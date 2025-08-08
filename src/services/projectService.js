const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (cvId, name, description, url) => {
  return prisma.project.create({
    data: {
      cvId,
      name,
      description,
      url,
    },
  });
};

const getProjectById = async (id) => {
    return prisma.project.findUnique({ where: { id }, include: { cv: true } });
};

const updateProject = async (id, name, description, url) => {
  return prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      url,
    },
  });
};

const deleteProject = async (id) => {
  return prisma.project.delete({
    where: { id },
  });
};

module.exports = {
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
