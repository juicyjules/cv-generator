const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cvService = require('../services/cvService');

const createCv = async (req, res) => {
  const { title } = req.body;
  const userId = req.userId;
  try {
    const cv = await cvService.createCv(userId, title);
    res.status(201).json({ message: 'CV created successfully', cv });
  } catch (error) {
    res.status(400).json({ message: 'Error creating CV', error: error.message });
  }
};

const getCvs = async (req, res) => {
  const userId = req.userId;
  try {
    const cvs = await cvService.getCvsByUserId(userId);
    res.status(200).json(cvs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CVs', error: error.message });
  }
};

const getCv = async (req, res) => {
  const { id } = req.params;
  try {
    const cv = await cvService.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.userId !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.status(200).json(cv);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching CV', error: error.message });
  }
};

const updateCv = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    let cv = await cvService.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.userId !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedCv = await cvService.updateCv(id, title);
    res.status(200).json({ message: 'CV updated successfully', cv: updatedCv });
  } catch (error) {
    res.status(400).json({ message: 'Error updating CV', error: error.message });
  }
};

const deleteCv = async (req, res) => {
  const { id } = req.params;
  try {
    const cv = await cvService.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.userId !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await cvService.deleteCv(id);
    res.status(200).json({ message: 'CV deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting CV', error: error.message });
  }
};

const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

const generatePdf = async (req, res) => {
  const { id } = req.params;
  const { template } = req.query;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(id);
    if (!cv || cv.userId !== userId) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const fs = require('fs').promises;

    const juice = require('juice');

    const templateFromDb = await prisma.template.findUnique({ where: { id: template } });
    if (!templateFromDb) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Handle profile picture
    let photoBase64;
    try {
      const imagePath = path.join(__dirname, `../../public${cv.user.photoUrl || '/img/default-avatar.svg'}`);
      const imageBuffer = await fs.readFile(imagePath);
      photoBase64 = `data:image/svg+xml;base64,${imageBuffer.toString('base64')}`;
    } catch (err) {
      // Fallback if image not found
      const defaultImagePath = path.join(__dirname, '../../public/img/default-avatar.svg');
      const imageBuffer = await fs.readFile(defaultImagePath);
      photoBase64 = `data:image/svg+xml;base64,${imageBuffer.toString('base64')}`;
    }

    const renderedHtml = ejs.render(templateFromDb.content, { cv, user: cv.user, photoBase64 });

    // Inline CSS
    const cssPath = path.join(__dirname, `../../temp-templates/modern-professional.css`);
    const css = await fs.readFile(cssPath, 'utf-8');
    const html = juice(renderedHtml, { extraCss: css });

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Disposition', 'attachment; filename=cv.pdf');
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};


const getPublicCv = async (req, res) => {
  const { publicId } = req.params;
  try {
    const cv = await prisma.cv.findUnique({
      where: { publicId, isPublic: true },
      include: {
        biography: true,
        skills: true,
        educations: true,
        projects: true,
        experiences: true,
      },
    });

    if (!cv) {
      return res.status(404).send('CV not found or is not public.');
    }

    // Increment view count
    await prisma.viewCount.upsert({
      where: { cvId: cv.id },
      update: { count: { increment: 1 } },
      create: { cvId: cv.id, count: 1 },
    });

    res.render('public-cv', { cv });
  } catch (error) {
    res.status(500).send('Error fetching CV');
  }
};


// TODO: Add controllers for Biography, Skill, Education, Project, WorkExperience

const togglePublic = async (req, res) => {
  const { id } = req.params;
  const { isPublic } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(id);
    if (!cv || cv.userId !== userId) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const updatedCv = await cvService.togglePublic(id, isPublic);
    res.status(200).json({ message: 'CV public status updated', cv: updatedCv });
  } catch (error) {
    res.status(500).json({ message: 'Error updating CV public status', error: error.message });
  }
};

module.exports = {
  createCv,
  getCvs,
  getCv,
  updateCv,
  deleteCv,
  generatePdf,
  getPublicCv,
  togglePublic,
};
