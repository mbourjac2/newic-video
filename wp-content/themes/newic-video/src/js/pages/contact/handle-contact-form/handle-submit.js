import { validateInput } from './validate-input';

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

      // If submission is successful, mark the form as submitted to prevent resubmission while the panel hasn't been toggled or the page reloaded
      if (isSubmitSuccess) {
        form.classList.add('submitted');
      }
    }
  });
};

export const submitForm = async (form) => {
  const submitButton = form.querySelector('.submit');
  const resultMessage = form.querySelector('.result-message');

  const action = 'handle_contact_form';
  const formData = new FormData(form);

  formData.append(action, true);
  formData.append('security', ajax_object.contact_form_nonce);

  // Reset previous error message if present
  resultMessage.classList.add('hidden');
  resultMessage.textContent = '';

  // Style the submit button as disabled
  submitButton.classList.add('disabled');
  submitButton.parentNode.style.cursor = 'not-allowed';

  const data = await postData(formData, action);

  const dataMessage = data.data.message;
  const dataSuccess = data.success;
  const dataErrors = data.data.errors;

  // Display feedback message
  resultMessage.textContent = dataMessage;
  resultMessage.classList.remove('hidden');

  // If the submission fails, style the message as an error and remove the disabled style from the submit button
  if (dataSuccess === false) {
    submitButton.classList.remove('disabled');
    submitButton.parentNode.style.cursor = '';
  } else {
    submitButton.classList.add('hidden');
  }

  // Display server validation errors
  if (dataErrors) {
    for (const [elementId, errorMessage] of Object.entries(dataErrors)) {
      form.querySelector(`#${elementId}`).nextElementSibling.textContent =
        errorMessage;
    }
  }

  return dataSuccess;
};

const postData = async (formData, action) => {
  const url = new URL(ajax_object.ajax_url);

  url.searchParams.append('action', action);

  const response = await fetch(url.href, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error submitting formData to admin-ajax.php');
  }

  return response.json();
};
