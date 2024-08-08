import { handleAllProjects } from './pages/all-projects/handle-all-projects.js';
import { handleSingleProject } from './pages/single-project/handle-single-project.js';
import { handleEstimate } from './pages/estimate/handle-estimate.js';
import { handleContact } from './pages/contact/handle-contact.js';

document.addEventListener('DOMContentLoaded', () => {
  handleAllProjects();
  handleSingleProject();
  handleEstimate();
  handleContact();
});
