const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const verifyPassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await verifyPassword(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid old password');
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};

const deleteUser = async (userId) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

const updateUserProfile = async (userId, name, email) => {
    return prisma.user.update({
        where: { id: userId },
        data: { name, email },
    });
};

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
  changePassword,
  deleteUser,
  updateUserProfile,
};
