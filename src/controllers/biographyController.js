const biographyService = require('../services/biographyService');
const cvService = require('../services/cvService');

const upsertBiography = async (req, res) => {
  const { cvId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(cvId);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const biography = await biographyService.upsertBiography(cvId, content);
    res.status(200).json({ message: 'Biography updated successfully', biography });
  } catch (error) {
    res.status(400).json({ message: 'Error updating biography', error: error.message });
  }
};

module.exports = {
  upsertBiography,
};
