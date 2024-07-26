export const validateFields = (inputType, fieldControls) => {
  let values = [];
  let errorMessage = null;

  switch (inputType) {
    case 'text':
    case 'email': {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gi;

      if (
        fieldControls.name === 'phone' &&
        !phoneRegex.test(fieldControls.value)
      ) {
        errorMessage = 'Please provide a valid phone.';
      }

      if (inputType === 'email' && fieldControls.validity.typeMismatch) {
        errorMessage = 'Please provide a valid email.';
      }

      if (fieldControls.validity.valueMissing) {
        errorMessage = 'This field is required.';
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
