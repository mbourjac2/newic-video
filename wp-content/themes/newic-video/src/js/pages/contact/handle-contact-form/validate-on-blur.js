import { validateInput } from './validate-input';

export const validateOnBlur = (form) => {
  const inputs = form.querySelectorAll('input, textarea');

  for (const input of inputs) {
    let delayedValidation;

    // Debounce: delay validation to avoid frequent checks during user input
    input.addEventListener('blur', function () {
      clearTimeout(delayedValidation);

      delayedValidation = setTimeout(() => {
        const errorMessage = validateInput(input);

        if (errorMessage) {
          input.nextElementSibling.textContent = errorMessage;
        }
      }, 300);
    });
  }
};
