import { validateInput } from './validate-input';
import { submitForm } from './submit-form';

export const handleSubmit = (form) => {
  const inputs = form.querySelectorAll('input, textarea');
  const hasFormBeenSubmitted = form.classList.contains('submitted');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    let isFormValid = true;

    for (const input of inputs) {
      const errorMessage = validateInput(input);

      if (errorMessage) {
        isFormValid = false;
        input.nextElementSibling.textContent = errorMessage;
      }
    }

    if (isFormValid && !hasFormBeenSubmitted) {
      const isSubmitSuccess = await submitForm(form);

      // If submission is successful, mark the form as submitted to prevent resubmission while the page hasn't been reloaded
      if (isSubmitSuccess) {
        form.classList.add('submitted');
      }
    }
  });
};
