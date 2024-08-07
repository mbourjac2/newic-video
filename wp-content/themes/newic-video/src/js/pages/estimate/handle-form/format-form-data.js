export const formatFormData = (formData) => {
  let formattedFormData = {};

  for (const [key, value] of formData.entries()) {
    const choiceInput = document.querySelector(
      `input[name=${key}][value=${CSS.escape(value)}]`,
    );
    const input = choiceInput ?? document.querySelector(`input[name=${key}]`);

    formattedFormData = {
      ...formattedFormData,
      [key]: {
        label: input.dataset.label,
        answer:
          choiceInput?.type === 'checkbox'
            ? key in formattedFormData
              ? [
                  ...formattedFormData[key].answer,
                  choiceInput.nextElementSibling.innerText,
                ]
              : [choiceInput.nextElementSibling.innerText]
            : choiceInput?.type === 'radio'
              ? choiceInput.nextElementSibling.innerText
              : value,
      },
    };
  }

  return formattedFormData;
};
