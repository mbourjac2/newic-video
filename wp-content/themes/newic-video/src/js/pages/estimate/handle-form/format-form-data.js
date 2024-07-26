export const formatFormData = (formData) => {
  let formattedFormData = {};

  for (const [key, value] of formData.entries()) {
    const input = document.querySelector(`input[value=${CSS.escape(value)}]`);
    const fieldset = document.querySelector(
      `fieldset[data-id=${CSS.escape(key)}]`,
    );
    const legend = fieldset.querySelectorAll('legend .popup');

    formattedFormData = {
      ...formattedFormData,
      [key]: {
        question:
          legend.length > 0
            ? Array.from(legend).map((span) => span.textContent.trim())
            : Array.from(fieldset.querySelectorAll('label .popup')).map(
                (span) => span.textContent.trim(),
              ),
        answer:
          input?.type === 'checkbox'
            ? key in formattedFormData
              ? [
                  ...formattedFormData[key].answer,
                  input.nextElementSibling.innerText,
                ]
              : [input.nextElementSibling.innerText]
            : input?.type === 'radio'
              ? input.nextElementSibling.innerText
              : value,
      },
    };
  }

  return formattedFormData;
};
