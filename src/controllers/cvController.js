const cvService = require('../services/cvService');

const createCv = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.userId;
  try {
    const cv = await cvService.createCv(userId, title, content);
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
  const { title, content } = req.body;
  try {
    const cv = await cvService.getCvById(id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.userId !== req.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedCv = await cvService.updateCv(id, title, content);
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

module.exports = {
  createCv,
  getCvs,
  getCv,
  updateCv,
  deleteCv,
};
