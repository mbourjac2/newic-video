import { formatFormData } from './format-form-data.js';
import { postData } from '../../../helpers/post-data.js';

export const submitForm = async (form, action) => {
  const formData = new FormData(form);
  const formattedFormData = new FormData();

  for (const [key, value] of Object.entries(formatFormData(formData))) {
    formattedFormData.append(
      key,
      typeof value === 'object' ? JSON.stringify(value) : value, // Serialize the value if it is an object
    );
  }

  // Add the nonce to the form data
  formattedFormData.append('security', ajax_object.estimate_form_nonce);

  return postData(formattedFormData, action);
};
