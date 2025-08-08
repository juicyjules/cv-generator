const skillService = require('../services/skillService');
const cvService = require('../services/cvService');

const createSkill = async (req, res) => {
  const { cvId } = req.params;
  const { name, level } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(cvId);
    if (!cv || cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const skill = await skillService.createSkill(cvId, name, level);
    res.status(201).json({ message: 'Skill created successfully', skill });
  } catch (error) {
    res.status(400).json({ message: 'Error creating skill' });
  }
};

const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, level } = req.body;
  const userId = req.userId;

  try {
    const skill = await skillService.getSkillById(id);
    if (!skill || skill.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedSkill = await skillService.updateSkill(id, name, level);
    res.status(200).json({ message: 'Skill updated successfully', skill: updatedSkill });
  } catch (error) {
    res.status(400).json({ message: 'Error updating skill' });
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const skill = await skillService.getSkillById(id);
    if (!skill || skill.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await skillService.deleteSkill(id);
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skill' });
  }
};

module.exports = {
  createSkill,
  updateSkill,
  deleteSkill,
};
