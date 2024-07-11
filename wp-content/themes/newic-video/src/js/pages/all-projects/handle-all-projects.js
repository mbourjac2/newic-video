import { loadProjects } from './load-projects.js';
import { filterProjects } from './filter-projects.js';

export const handleAllProjects = () => {
  const allProjectsPage = document.querySelector('.all-projects');

  if (!allProjectsPage) return;

  loadProjects();
  filterProjects();
};
