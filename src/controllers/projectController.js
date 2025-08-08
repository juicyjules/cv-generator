const projectService = require('../services/projectService');
const cvService = require('../services/cvService');

const createProject = async (req, res) => {
  const { cvId } = req.params;
  const { name, description, url } = req.body;
  const userId = req.userId;

  try {
    const cv = await cvService.getCvById(cvId);
    if (!cv || cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const project = await projectService.createProject(cvId, name, description, url);
    res.status(201).json({ message: 'Project created successfully', project });
  } catch (error) {
    res.status(400).json({ message: 'Error creating project' });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, url } = req.body;
  const userId = req.userId;

  try {
    const project = await projectService.getProjectById(id);
    if (!project || project.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedProject = await projectService.updateProject(id, name, description, url);
    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(400).json({ message: 'Error updating project' });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const project = await projectService.getProjectById(id);
    if (!project || project.cv.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await projectService.deleteProject(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
};
