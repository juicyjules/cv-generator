document.addEventListener('DOMContentLoaded', async () => {
    const cvId = document.getElementById('cvId').value;

    // Quill Editor
    const editorOptions = {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link'],
                ['clean']
            ]
        }
    };

    const biographyEditor = new Quill('#quill-editor', editorOptions);
    const projectEditor = new Quill('#project-quill-editor', editorOptions);
    const educationEditor = new Quill('#education-quill-editor', editorOptions);
    const experienceEditor = new Quill('#experience-quill-editor', editorOptions);

    // General
    const titleInput = document.getElementById('title');
    const cvTitle = document.getElementById('cv-title');

    // Skills
    const skillsList = document.getElementById('skills-list');
    const skillModal = document.getElementById('skill-modal');
    const skillModalTitle = document.getElementById('skill-modal-title');
    const skillForm = document.getElementById('skill-form');
    const skillIdInput = document.getElementById('skill-id');
    const skillNameInput = document.getElementById('skill-name');
    const skillLevelInput = document.getElementById('skill-level');
    const closeSkillModal = document.getElementsByClassName("close-skill")[0];

    // Projects
    const projectsList = document.getElementById('projects-list');
    const projectModal = document.getElementById('project-modal');
    const projectModalTitle = document.getElementById('project-modal-title');
    const projectForm = document.getElementById('project-form');
    const projectIdInput = document.getElementById('project-id');
    const projectNameInput = document.getElementById('project-name');
    const projectDescriptionInput = document.getElementById('project-description');
    const projectUrlInput = document.getElementById('project-url');
    const closeProjectModal = document.getElementsByClassName("close-project")[0];

    // Education
    const educationList = document.getElementById('education-list');
    const educationModal = document.getElementById('education-modal');
    const educationModalTitle = document.getElementById('education-modal-title');
    const educationForm = document.getElementById('education-form');
    const educationIdInput = document.getElementById('education-id');
    const educationInstitutionInput = document.getElementById('education-institution');
    const educationDegreeInput = document.getElementById('education-degree');
    const educationStartDateInput = document.getElementById('education-startDate');
    const educationEndDateInput = document.getElementById('education-endDate');
    const educationDescriptionInput = document.getElementById('education-description');
    const closeEducationModal = document.getElementsByClassName("close-education")[0];

    // Experience
    const experienceList = document.getElementById('experience-list');
    const experienceModal = document.getElementById('experience-modal');
    const experienceModalTitle = document.getElementById('experience-modal-title');
    const experienceForm = document.getElementById('experience-form');
    const experienceIdInput = document.getElementById('experience-id');
    const experienceCompanyInput = document.getElementById('experience-company');
    const experiencePositionInput = document.getElementById('experience-position');
    const experienceStartDateInput = document.getElementById('experience-startDate');
    const experienceEndDateInput = document.getElementById('experience-endDate');
    const experienceDescriptionInput = document.getElementById('experience-description');
    const closeExperienceModal = document.getElementsByClassName("close-experience")[0];

    let cvData;

    async function fetchData() {
        try {
            const response = await fetch(`/api/cvs/${cvId}`);
            if (response.ok) {
                cvData = await response.json();
                renderAll();
            } else {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            toastr.error('Error fetching CV details.');
        }
    }

    function renderAll() {
        titleInput.value = cvData.title;
        cvTitle.textContent = `Edit CV: ${cvData.title}`;
        if (cvData.biography) {
            biographyEditor.root.innerHTML = cvData.biography.content;
        }
        // The other editors are populated in the edit event listeners
        renderSkills();
        renderProjects();
        renderEducation();
        renderExperience();
    }

    function renderSkills() {
        skillsList.innerHTML = '';
        cvData.skills.forEach(skill => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${skill.name} - ${skill.level}</span>
                <div>
                    <button class="edit-skill-button" data-id="${skill.id}">Edit</button>
                    <button class="delete-skill-button" data-id="${skill.id}">Delete</button>
                </div>
            `;
            skillsList.appendChild(listItem);
        });
    }

    function renderProjects() {
        projectsList.innerHTML = '';
        cvData.projects.forEach(project => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${project.name}</span>
                <div>
                    <button class="edit-project-button" data-id="${project.id}">Edit</button>
                    <button class="delete-project-button" data-id="${project.id}">Delete</button>
                </div>
            `;
            projectsList.appendChild(listItem);
        });
    }

    function renderEducation() {
        educationList.innerHTML = '';
        cvData.educations.forEach(edu => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${edu.degree} at ${edu.institution}</span>
                <div>
                    <button class="edit-education-button" data-id="${edu.id}">Edit</button>
                    <button class="delete-education-button" data-id="${edu.id}">Delete</button>
                </div>
            `;
            educationList.appendChild(listItem);
        });
    }

    function renderExperience() {
        experienceList.innerHTML = '';
        cvData.experiences.forEach(exp => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${exp.position} at ${exp.company}</span>
                <div>
                    <button class="edit-experience-button" data-id="${exp.id}">Edit</button>
                    <button class="delete-experience-button" data-id="${exp.id}">Delete</button>
                </div>
            `;
            experienceList.appendChild(listItem);
        });
    }

    await fetchData();

    // --- Event Listeners ---

    // Modals
    document.getElementById('add-skill-button').addEventListener('click', () => {
        skillModalTitle.textContent = 'Add Skill';
        skillForm.reset();
        skillIdInput.value = '';
        skillModal.style.display = "block";
    });
    closeSkillModal.onclick = () => { skillModal.style.display = "none"; }

    document.getElementById('add-project-button').addEventListener('click', () => {
        projectModalTitle.textContent = 'Add Project';
        projectForm.reset();
        projectIdInput.value = '';
        projectModal.style.display = "block";
    });
    closeProjectModal.onclick = () => { projectModal.style.display = "none"; }

    document.getElementById('add-education-button').addEventListener('click', () => {
        educationModalTitle.textContent = 'Add Education';
        educationForm.reset();
        educationIdInput.value = '';
        educationModal.style.display = "block";
    });
    closeEducationModal.onclick = () => { educationModal.style.display = "none"; }

    document.getElementById('add-experience-button').addEventListener('click', () => {
        experienceModalTitle.textContent = 'Add Experience';
        experienceForm.reset();
        experienceIdInput.value = '';
        experienceModal.style.display = "block";
    });
    closeExperienceModal.onclick = () => { experienceModal.style.display = "none"; }

    window.addEventListener('click', (event) => {
        if (event.target == skillModal) skillModal.style.display = "none";
        if (event.target == projectModal) projectModal.style.display = "none";
        if (event.target == educationModal) educationModal.style.display = "none";
        if (event.target == experienceModal) experienceModal.style.display = "none";
    });

    // Forms
    document.getElementById('edit-cv-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = titleInput.value;
        try {
            const response = await fetch(`/api/cvs/${cvId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });
            if (response.ok) {
                toastr.success('CV title updated successfully.');
                cvTitle.textContent = `Edit CV: ${title}`;
            } else {
                toastr.error('Error updating CV title.');
            }
        } catch (error) {
            toastr.error('An error occurred while updating the CV title.');
        }
    });

    document.getElementById('biography-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const content = biographyEditor.root.innerHTML;
        try {
            const response = await fetch(`/api/biography/${cvId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (response.ok) {
                toastr.success('Biography saved successfully!');
            } else {
                toastr.error('Error saving biography.');
            }
        } catch (error) {
            toastr.error('An error occurred while saving the biography.');
        }
    });

    skillForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const skillId = skillIdInput.value;
        const name = skillNameInput.value;
        const level = skillLevelInput.value;
        const url = skillId ? `/api/skills/${skillId}` : `/api/cvs/${cvId}/skills`;
        const method = skillId ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, level }),
            });
            if (response.ok) {
                toastr.success(`Skill ${skillId ? 'updated' : 'added'} successfully.`);
                skillModal.style.display = "none";
                await fetchData();
            } else {
                toastr.error(`Error ${skillId ? 'updating' : 'adding'} skill.`);
            }
        } catch (error) {
            toastr.error(`An error occurred while ${skillId ? 'updating' : 'adding'} the skill.`);
        }
    });

    projectForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const projectId = projectIdInput.value;
        const name = projectNameInput.value;
        const description = projectEditor.root.innerHTML;
        const url = projectUrlInput.value;
        const apiUrl = projectId ? `/api/projects/${projectId}` : `/api/cvs/${cvId}/projects`;
        const method = projectId ? 'PUT' : 'POST';
        try {
            const response = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, url }),
            });
            if (response.ok) {
                toastr.success(`Project ${projectId ? 'updated' : 'added'} successfully.`);
                projectModal.style.display = "none";
                await fetchData();
            } else {
                toastr.error(`Error ${projectId ? 'updating' : 'adding'} project.`);
            }
        } catch (error) {
            toastr.error(`An error occurred while ${projectId ? 'updating' : 'adding'} the project.`);
        }
    });

    educationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const educationId = educationIdInput.value;
        const institution = educationInstitutionInput.value;
        const degree = educationDegreeInput.value;
        const startDate = educationStartDateInput.value;
        const endDate = educationEndDateInput.value;
        const description = educationEditor.root.innerHTML;
        const apiUrl = educationId ? `/api/educations/${educationId}` : `/api/cvs/${cvId}/educations`;
        const method = educationId ? 'PUT' : 'POST';
        try {
            const response = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ institution, degree, startDate, endDate: endDate || null, description }),
            });
            if (response.ok) {
                toastr.success(`Education ${educationId ? 'updated' : 'added'} successfully.`);
                educationModal.style.display = "none";
                await fetchData();
            } else {
                toastr.error(`Error ${educationId ? 'updating' : 'adding'} education.`);
            }
        } catch (error) {
            toastr.error(`An error occurred while ${educationId ? 'updating' : 'adding'} the education.`);
        }
    });

    experienceForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const experienceId = experienceIdInput.value;
        const company = experienceCompanyInput.value;
        const position = experiencePositionInput.value;
        const startDate = experienceStartDateInput.value;
        const endDate = experienceEndDateInput.value;
        const description = experienceEditor.root.innerHTML;
        const apiUrl = experienceId ? `/api/experiences/${experienceId}` : `/api/cvs/${cvId}/experiences`;
        const method = experienceId ? 'PUT' : 'POST';
        try {
            const response = await fetch(apiUrl, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company, position, startDate, endDate: endDate || null, description }),
            });
            if (response.ok) {
                toastr.success(`Experience ${experienceId ? 'updated' : 'added'} successfully.`);
                experienceModal.style.display = "none";
                await fetchData();
            } else {
                toastr.error(`Error ${experienceId ? 'updating' : 'adding'} experience.`);
            }
        } catch (error) {
            toastr.error(`An error occurred while ${experienceId ? 'updating' : 'adding'} the experience.`);
        }
    });

    // Delete Buttons
    document.getElementById('delete-cv-button').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this CV?')) {
            try {
                const response = await fetch(`/api/cvs/${cvId}`, { method: 'DELETE' });
                if (response.ok) {
                    toastr.success('CV deleted successfully. Redirecting to dashboard...');
                    setTimeout(() => window.location.href = '/dashboard', 2000);
                } else {
                    toastr.error('Error deleting CV.');
                }
            } catch (error) {
                toastr.error('An error occurred while deleting the CV.');
            }
        }
    });

    skillsList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-skill-button')) {
            const skillId = event.target.dataset.id;
            const skill = cvData.skills.find(s => s.id === skillId);
            skillModalTitle.textContent = 'Edit Skill';
            skillIdInput.value = skill.id;
            skillNameInput.value = skill.name;
            skillLevelInput.value = skill.level;
            skillModal.style.display = "block";
        }
        if (event.target.classList.contains('delete-skill-button')) {
            if (confirm('Are you sure you want to delete this skill?')) {
                try {
                    const response = await fetch(`/api/skills/${event.target.dataset.id}`, { method: 'DELETE' });
                    if (response.ok) {
                        toastr.success('Skill deleted successfully.');
                        await fetchData();
                    } else {
                        toastr.error('Error deleting skill.');
                    }
                } catch (error) {
                    toastr.error('An error occurred while deleting the skill.');
                }
            }
        }
    });

    projectsList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-project-button')) {
            const projectId = event.target.dataset.id;
            const project = cvData.projects.find(p => p.id === projectId);
            projectModalTitle.textContent = 'Edit Project';
            projectIdInput.value = project.id;
            projectNameInput.value = project.name;
            projectEditor.root.innerHTML = project.description;
            projectUrlInput.value = project.url;
            projectModal.style.display = "block";
        }
        if (event.target.classList.contains('delete-project-button')) {
            if (confirm('Are you sure you want to delete this project?')) {
                try {
                    const response = await fetch(`/api/projects/${event.target.dataset.id}`, { method: 'DELETE' });
                    if (response.ok) {
                        toastr.success('Project deleted successfully.');
                        await fetchData();
                    } else {
                        toastr.error('Error deleting project.');
                    }
                } catch (error) {
                    toastr.error('An error occurred while deleting the project.');
                }
            }
        }
    });

    educationList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-education-button')) {
            const educationId = event.target.dataset.id;
            const education = cvData.educations.find(e => e.id === educationId);
            educationModalTitle.textContent = 'Edit Education';
            educationIdInput.value = education.id;
            educationInstitutionInput.value = education.institution;
            educationDegreeInput.value = education.degree;
            educationStartDateInput.value = new Date(education.startDate).toISOString().split('T')[0];
            educationEndDateInput.value = education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : '';
                educationEditor.root.innerHTML = education.description;
            educationModal.style.display = "block";
        }
        if (event.target.classList.contains('delete-education-button')) {
            if (confirm('Are you sure you want to delete this education entry?')) {
                try {
                    const response = await fetch(`/api/educations/${event.target.dataset.id}`, { method: 'DELETE' });
                    if (response.ok) {
                        toastr.success('Education entry deleted successfully.');
                        await fetchData();
                    } else {
                        toastr.error('Error deleting education entry.');
                    }
                } catch (error) {
                    toastr.error('An error occurred while deleting the education entry.');
                }
            }
        }
    });

    experienceList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-experience-button')) {
            const experienceId = event.target.dataset.id;
            const experience = cvData.experiences.find(e => e.id === experienceId);
            experienceModalTitle.textContent = 'Edit Experience';
            experienceIdInput.value = experience.id;
            experienceCompanyInput.value = experience.company;
            experiencePositionInput.value = experience.position;
            experienceStartDateInput.value = new Date(experience.startDate).toISOString().split('T')[0];
            experienceEndDateInput.value = experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '';
            experienceEditor.root.innerHTML = experience.description;
            experienceModal.style.display = "block";
        }
        if (event.target.classList.contains('delete-experience-button')) {
            if (confirm('Are you sure you want to delete this experience entry?')) {
                try {
                    const response = await fetch(`/api/experiences/${event.target.dataset.id}`, { method: 'DELETE' });
                    if (response.ok) {
                        toastr.success('Experience entry deleted successfully.');
                        await fetchData();
                    } else {
                        toastr.error('Error deleting experience entry.');
                    }
                } catch (error) {
                    toastr.error('An error occurred while deleting the experience entry.');
                }
            }
        }
    });
});
