import { formatFormData } from './format-form-data.js';

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

  const data = await postData(formattedFormData, action);

  console.log(data);
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
