import { validateInput } from './validate-input';

export const validateOnInput = (form) => {
  const inputs = form.querySelectorAll('input, textarea');

  for (const input of inputs) {
    let delayedValidation;

    input.addEventListener('input', function () {
      clearTimeout(delayedValidation);

      const errorMessage = validateInput(input);

      if (errorMessage) {
        delayedValidation = setTimeout(() => {
          input.nextElementSibling.textContent = errorMessage;
        }, 300);
      } else {
        input.nextElementSibling.textContent = '';
      }
    });
  }
};
