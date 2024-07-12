export const toggleSuggestions = () => {
  const suggestionsFilters = document.querySelectorAll('input[name="filter"]');
  const suggestionsPanels = document.querySelectorAll('[data-type]');

  if (!suggestionsFilters.length || !suggestionsPanels.length) return;

  suggestionsFilters[0].checked = true;
  suggestionsPanels[0].classList.remove('hidden');

  for (const suggestionsFilter of suggestionsFilters) {
    suggestionsFilter.addEventListener('click', () => {
      const suggestionsType = suggestionsFilter.value;

      for (const suggestionsPanel of suggestionsPanels) {
        suggestionsPanel.classList.toggle(
          'hidden',
          suggestionsPanel.dataset.type !== suggestionsType,
        );
      }
    });
  }
};
