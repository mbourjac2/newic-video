import { normalizeString, isSimilarByLevenshtein } from '../../utils/text.js';

export const filterProjects = () => {
  const projects = document.querySelectorAll('.project-card');

  if (!projects.length) return;

  let selectedField = null;
  let selectedCategory = null;

  const fieldTags = document.querySelector('.field-tags');
  const categoryTags = document.querySelector('.category-tags');

  const fieldTagInputs = fieldTags.querySelectorAll('input');
  const categoryTagInputs = categoryTags.querySelectorAll('input');
  const allProjectsTagInput = document.querySelector('#all');

  const searchProjectsForm = document.querySelector('.search-projects');

  const getSearchData = (form) => {
    const formData = new FormData(form);
    const normalizedSearch = normalizeString(formData.get('search'));
    const normalizedSearchArray = normalizedSearch.split(' ');
    const isSearchEmpty = normalizedSearch === '';

    return { normalizedSearchArray, isSearchEmpty };
  };

  const updateProjectsCount = (tagInputs, tagsType) => {
    for (const tagInput of tagInputs) {
      const { id } = tagInput;
      const tagCountElement = tagInput.parentNode.querySelector('.tag-count');

      let projectsCount = 0;

      for (const project of projects) {
        const tags = JSON.parse(project.dataset[tagsType]).map(
          ({ slug }) => slug,
        );
        const isProjectSelected = !project.classList.contains('hidden');

        if (isProjectSelected && tags.findIndex((tag) => tag === id) !== -1) {
          projectsCount = projectsCount + 1;
        }
      }

      tagInput.setAttribute('data-projects-count', projectsCount);
      tagInput.toggleAttribute('disabled', projectsCount === 0);
      tagCountElement.textContent = projectsCount;
    }
  };

  const updateProjectsList = () => {
    const { isSearchEmpty } = getSearchData(searchProjectsForm);
    const displayedProjects = isSearchEmpty
      ? projects
      : document.querySelectorAll('.project-card[data-search="true"]');

    for (const project of displayedProjects) {
      const fieldTags = JSON.parse(project.dataset.fields).map(
        ({ slug }) => slug,
      );

      const categoryTags = JSON.parse(project.dataset.categories).map(
        ({ slug }) => slug,
      );

      const hasSelectedField =
        fieldTags.findIndex((fieldTag) => fieldTag === selectedField) !== -1;
      const hasSelectedCategory =
        categoryTags.findIndex(
          (categoryTag) => categoryTag === selectedCategory,
        ) !== -1;

      if (selectedCategory && !selectedField) {
        project.classList.toggle('hidden', !hasSelectedCategory);
      }

      if (selectedField && !selectedCategory) {
        project.classList.toggle('hidden', !hasSelectedField);
      }

      if (selectedCategory && selectedField) {
        project.classList.toggle(
          'hidden',
          !hasSelectedCategory || !hasSelectedField,
        );
      }
    }
  };

  const updateAllProjectsCount = () => {
    updateProjectsCount(fieldTagInputs, 'fields');
    updateProjectsCount(categoryTagInputs, 'categories');
  };

  const clearSelectedTags = () => {
    const allTagInputs = document.querySelectorAll(
      'input[type=radio]:not(#all)',
    );

    for (const tagInput of allTagInputs) {
      tagInput.checked = false;
    }

    selectedCategory = null;
    selectedField = null;

    updateAllProjectsCount();
  };

  const clearSearchedProject = (project) => {
    project.classList.remove('hidden');
    project.setAttribute('data-search', false);
  };

  fieldTags.addEventListener('change', (event) => {
    selectedField = event.target.id;
    selectedCategory = null;
    allProjectsTagInput.checked = false;

    updateProjectsList();
    updateProjectsCount(categoryTagInputs, 'categories');
  });

  categoryTags.addEventListener('change', (event) => {
    selectedCategory = event.target.id;
    allProjectsTagInput.checked = false;

    updateProjectsList();
    updateProjectsCount(fieldTagInputs, 'fields');
  });

  allProjectsTagInput.addEventListener('click', () => {
    for (const project of projects) {
      clearSearchedProject(project);
    }

    allProjectsTagInput.checked = true;
    searchProjectsForm.reset();

    clearSelectedTags();
  });

  const handleNoResult = (project) => {
    allProjectsTagInput.checked = true;

    clearSearchedProject(project);
    clearSelectedTags();
  };

  searchProjectsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const { normalizedSearchArray, isSearchEmpty } =
      getSearchData(searchProjectsForm);

    for (const project of projects) {
      if (isSearchEmpty) {
        handleNoResult(project);
        continue;
      }

      const projectTitle =
        project.querySelector('.project-title')?.textContent ?? '';
      const projectClients =
        project.querySelector('.project-clients')?.textContent ?? '';
      const projectTagsArray = [
        ...project.querySelectorAll('.project-tag'),
      ].map((projectTagElement) => projectTagElement?.textContent ?? '');

      const stopWordsList = [
        'alors',
        'au',
        'aucuns',
        'aussi',
        'autre',
        'avant',
        'avec',
        'avoir',
        'bon',
        'car',
        'ce',
        'cela',
        'ces',
        'ceux',
        'chaque',
        'ci',
        'comme',
        'comment',
        'dans',
        'des',
        'du',
        'de',
        'dedans',
        'dehors',
        'depuis',
        'devrait',
        'doit',
        'donc',
        'dos',
        'début',
        'elle',
        'elles',
        'en',
        'encore',
        'essai',
        'est',
        'et',
        'eu',
        'fait',
        'faites',
        'fois',
        'font',
        'hors',
        'ici',
        'il',
        'ils',
        'je',
        'juste',
        'la',
        'le',
        'les',
        'leur',
        'là',
        'ma',
        'maintenant',
        'mais',
        'mes',
        'mine',
        'moins',
        'mon',
        'mot',
        'même',
        'ni',
        'nommés',
        'notre',
        'nous',
        'nouveaux',
        'ou',
        'où',
        'par',
        'parce',
        'parole',
        'pas',
        'personnes',
        'peut',
        'peu',
        'pièce',
        'plupart',
        'pour',
        'pourquoi',
        'quand',
        'que',
        'quel',
        'quelle',
        'quelles',
        'quels',
        'qui',
        'sa',
        'sans',
        'ses',
        'seulement',
        'si',
        'sien',
        'son',
        'sont',
        'sous',
        'soyez',
        'sujet',
        'sur',
        'ta',
        'tandis',
        'tellement',
        'tels',
        'tes',
        'ton',
        'tous',
        'tout',
        'trop',
        'très',
        'tu',
        'valeur',
        'voie',
        'voient',
        'vont',
        'votre',
        'vous',
        'vu',
        'ça',
        'étaient',
        'état',
        'étions',
        'été',
        'être',
      ];

      const projectTerms = [projectTitle, projectClients, ...projectTagsArray]
        .flatMap((projectTerm) =>
          projectTerm.split(/,| |’/).map(normalizeString),
        )
        .filter(
          (projectTerm) =>
            projectTerm.length > 1 && !stopWordsList.includes(projectTerm),
        );

      let isMatch = false;

      for (const searchTerm of normalizedSearchArray) {
        isMatch = projectTerms.some(
          (projectTerm) =>
            isSimilarByLevenshtein(projectTerm, searchTerm) ||
            (searchTerm.length > 3 && projectTerm.includes(searchTerm)),
        );

        if (isMatch) break;
      }

      project.classList.toggle('hidden', !isMatch);
      project.setAttribute('data-search', isMatch);
      allProjectsTagInput.checked = false;

      clearSelectedTags();
    }
  });

  updateAllProjectsCount();
};
