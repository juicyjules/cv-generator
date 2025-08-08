const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user && user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Admins only' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = adminAuthMiddleware;
