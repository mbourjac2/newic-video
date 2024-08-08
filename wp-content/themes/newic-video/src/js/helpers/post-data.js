export const postData = async (formData, action) => {
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
