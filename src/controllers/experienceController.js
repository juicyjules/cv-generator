const experienceService = require('../services/experienceService');
const cvService = require('../services/cvService');

const createExperience = async (req, res) => {
  const { cvId } = req.params;
  const { company, position, startDate, endDate, description } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(cvId);
    if (!cv || cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const experience = await experienceService.createExperience(cvId, company, position, startDate, endDate, description);
    res.status(201).json({ message: 'Experience created successfully', experience });
  } catch (error) {
    res.status(400).json({ message: 'Error creating experience' });
  }
};

const updateExperience = async (req, res) => {
  const { id } = req.params;
  const { company, position, startDate, endDate, description } = req.body;
  const userId = req.userId;

  try {
    const experience = await experienceService.getExperienceById(id);
    if (!experience || experience.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedExperience = await experienceService.updateExperience(id, company, position, startDate, endDate, description);
    res.status(200).json({ message: 'Experience updated successfully', experience: updatedExperience });
  } catch (error) {
    res.status(400).json({ message: 'Error updating experience' });
  }
};

const deleteExperience = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const experience = await experienceService.getExperienceById(id);
    if (!experience || experience.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await experienceService.deleteExperience(id);
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting experience' });
  }
};

module.exports = {
  createExperience,
  updateExperience,
  deleteExperience,
};
