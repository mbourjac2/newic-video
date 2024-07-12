import { handleAllProjects } from './pages/all-projects/handle-all-projects.js';
import { handleSingleProject } from './pages/single-project/handle-single-project.js';

document.addEventListener('DOMContentLoaded', () => {
  handleAllProjects();
  handleSingleProject();
});
