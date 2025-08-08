const educationService = require('../services/educationService');
const cvService = require('../services/cvService');

const createEducation = async (req, res) => {
  const { cvId } = req.params;
  const { institution, degree, startDate, endDate, description } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(cvId);
    if (!cv || cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const education = await educationService.createEducation(cvId, institution, degree, startDate, endDate, description);
    res.status(201).json({ message: 'Education created successfully', education });
  } catch (error) {
    res.status(400).json({ message: 'Error creating education' });
  }
};

const updateEducation = async (req, res) => {
  const { id } = req.params;
  const { institution, degree, startDate, endDate, description } = req.body;
  const userId = req.userId;

  try {
    const education = await educationService.getEducationById(id);
    if (!education || education.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedEducation = await educationService.updateEducation(id, institution, degree, startDate, endDate, description);
    res.status(200).json({ message: 'Education updated successfully', education: updatedEducation });
  } catch (error) {
    res.status(400).json({ message: 'Error updating education' });
  }
};

const deleteEducation = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const education = await educationService.getEducationById(id);
    if (!education || education.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await educationService.deleteEducation(id);
    res.status(200).json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education' });
  }
};

module.exports = {
  createEducation,
  updateEducation,
  deleteEducation,
};
