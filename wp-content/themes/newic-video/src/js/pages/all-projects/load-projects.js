export const loadProjects = () => {
  let page = 1;
  let canBeLoaded = true; // Allow AJAX requests initially

  const container = document.querySelector('.projects-container');
  const loader = document.querySelector('.loader');
  const sentinel = document.querySelector('.sentinel');

  const totalPages = parseInt(container.dataset.totalPages, 10);

  const loadMoreProjects = async () => {
    if (!canBeLoaded) return; // Already loading

    canBeLoaded = false; // Prevent further AJAX requests until the current one completes
    loader.classList.remove('hidden'); // Show the loader

    try {
      const response = await fetch(
        ajax_object.ajax_url, // Use the localized AJAX URL
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            action: 'load_more_projects', // The AJAX action
            page: page,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`);
      }

      const data = await response.text();

      if (data) {
        container.insertAdjacentHTML('beforeend', data); // Append the new posts
        page++; // Increment the page number
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      canBeLoaded = true; // Allow further AJAX requests
      loader.classList.add('hidden'); // Hide the loader

      if (page >= totalPages) {
        observer.disconnect(); // Disconnect the observer if no more pages to load
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMoreProjects();
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    },
  );

  observer.observe(sentinel);
};
