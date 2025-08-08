const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTemplates = async () => {
  return prisma.template.findMany();
};

const getTemplateById = async (id) => {
  return prisma.template.findUnique({ where: { id } });
};

const createTemplate = async (name, description, content) => {
  return prisma.template.create({
    data: { name, description, content },
  });
};

const updateTemplate = async (id, name, description, content) => {
  return prisma.template.update({
    where: { id },
    data: { name, description, content },
  });
};

const deleteTemplate = async (id) => {
  return prisma.template.delete({ where: { id } });
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
