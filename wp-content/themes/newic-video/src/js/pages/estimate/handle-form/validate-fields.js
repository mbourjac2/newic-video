export const validateFields = (inputType, fieldControls) => {
  let values = [];
  let errorMessage = null;

  switch (inputType) {
    case 'text':
    case 'email':
    case 'tel': {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gi;

      if (inputType === 'tel' && !phoneRegex.test(fieldControls.value)) {
        errorMessage = 'Veuillez saisir un numéro de téléphone valide.';
      }

      if (inputType === 'email' && fieldControls.validity.typeMismatch) {
        errorMessage = 'Veuillez saisir une adresse e-mail valide.';
      }

      if (fieldControls.validity.valueMissing) {
        errorMessage = 'Ce champ est requis.';
      }

      if (!errorMessage) {
        values = [fieldControls.value];
      }

      break;
    }

    case 'checkbox': {
      const checkboxes = Array.from(fieldControls.querySelectorAll('input'));
      const selectedCheckboxes = checkboxes.filter(
        (checkbox) => checkbox.checked,
      );

      if (selectedCheckboxes.length > 0) {
        values = selectedCheckboxes.map(
          (selectedCheckbox) => selectedCheckbox.nextElementSibling.innerText,
        );
      } else {
        errorMessage = 'Please select at least one option.';
      }

      break;
    }

    case 'radio': {
      const selectedRadio = Array.from(
        fieldControls.querySelectorAll('input'),
      ).find((radio) => radio.checked);

      if (selectedRadio) {
        values = [selectedRadio.nextElementSibling.innerText];
      }

      break;
    }
  }

  return { values, errorMessage };
};
