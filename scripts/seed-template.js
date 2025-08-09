const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    const templatePath = path.join(__dirname, '../temp-templates/modern-professional.ejs');
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    await prisma.template.create({
      data: {
        name: 'Modern Professional',
        description: 'A clean, modern, two-column template.',
        content: templateContent,
      },
    });

    console.log('Successfully seeded the database with the "Modern Professional" template.');
  } catch (error) {
    console.error('Error seeding template:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
