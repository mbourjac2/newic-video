import { toggleSuggestions } from './toggle-suggestions.js';

export const handleSingleProject = () => {
  const singleProjectPage = document.querySelector('.single-project');

  if (!singleProjectPage) return;

  toggleSuggestions();
};
