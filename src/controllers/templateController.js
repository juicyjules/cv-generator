const templateService = require('../services/templateService');

const getTemplates = async (req, res) => {
  try {
    const templates = await templateService.getTemplates();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates' });
  }
};

const getTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    const template = await templateService.getTemplateById(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template' });
  }
};

const createTemplate = async (req, res) => {
  const { name, description, content } = req.body;
  try {
    const template = await templateService.createTemplate(name, description, content);
    res.status(201).json({ message: 'Template created successfully', template });
  } catch (error) {
    res.status(400).json({ message: 'Error creating template' });
  }
};

const updateTemplate = async (req, res) => {
  const { id } = req.params;
  const { name, description, content } = req.body;
  try {
    const template = await templateService.updateTemplate(id, name, description, content);
    res.status(200).json({ message: 'Template updated successfully', template });
  } catch (error) {
    res.status(400).json({ message: 'Error updating template' });
  }
};

const deleteTemplate = async (req, res) => {
  const { id } = req.params;
  try {
    await templateService.deleteTemplate(id);
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting template' });
  }
};

module.exports = {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
