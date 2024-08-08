import { postData } from '../../../helpers/post-data';

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
