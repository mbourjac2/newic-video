import { animateFieldset } from './animate-fieldset.js';
import { validateFields } from './validate-fields.js';
import { submitForm } from './submit-form.js';

export const handleEstimateForm = () => {
  const form = document.querySelector('.form');

  if (!form) return;

  const fieldsets = form.querySelectorAll('.fieldset');
  let currentIndex = 0;

  const handleCurrentFieldset = () => {
    const fieldset = fieldsets[currentIndex];
    const inputType = fieldset.dataset.type;

    const submitFieldButton = fieldset.querySelector('button');
    const questionPopups = fieldset.querySelectorAll('.popup');

    const inputs = fieldset.querySelectorAll(
      'input[type="radio"], input[type="checkbox"]',
    );
    const input = fieldset.querySelector(
      'input[type="text"], input[type="email"]',
    );
    const fieldControls =
      inputs.length > 0 ? inputs[0].closest('.inputs-group') : input;

    const handleSubmittedFieldValues = () => {
      const { values, errorMessage } = validateFields(inputType, fieldControls);

      handleErrorMessage({ fieldset, errorMessage });

      if (values.length > 0) {
        fieldControls.classList.add('hidden');
        submitFieldButton?.classList.add('hidden');

        displayFieldsetValues(values);

        if (currentIndex < fieldsets.length - 1) {
          showNextFieldset();
          handleCurrentFieldset();
        } else {
          void handleSubmit(form);
        }

        scrollToBottom();
      }
    };

    const handleInput = () => {
      const { errorMessage } = validateFields(inputType, fieldControls);

      handleErrorMessage({ fieldset, errorMessage });
    };

    if (inputType === 'radio') {
      inputs.forEach((radioButton) => {
        radioButton.addEventListener('change', handleSubmittedFieldValues);
      });
    } else {
      submitFieldButton?.addEventListener('click', handleSubmittedFieldValues);

      if (inputType === 'text' || inputType === 'email') {
        input?.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            submitFieldButton.click();
          }
        });
        input?.addEventListener('input', handleInput);
      } else if (inputType === 'checkbox') {
        fieldControls
          .querySelectorAll('input[type="checkbox"]')
          .forEach((checkbox) => {
            checkbox.addEventListener('change', handleInput);
          });
      }
    }

    animateFieldset({
      questionPopups,
      fieldControls,
      submitFieldButton,
    });
  };

  const displayFieldsetValues = (values) => {
    const valuesContainer = document.createElement('div');

    for (const value of values) {
      const valueElement = document.createElement('span');

      valueElement.classList.add(
        'inline-block',
        'border',
        'px-6',
        'py-2',
        'rounded-xl',
        'w-fit',
      );
      valueElement.append(value);
      valuesContainer.appendChild(valueElement);
    }

    valuesContainer.classList.add('flex', 'justify-end', 'gap-4');
    fieldsets[currentIndex].firstElementChild.append(valuesContainer);
  };

  const handleErrorMessage = ({ fieldset, errorMessage }) => {
    const errorMessageElement = fieldset.querySelector('.error-message');

    if (errorMessage) {
      errorMessageElement.textContent = errorMessage;
      errorMessageElement?.classList.remove('hidden');
    } else {
      errorMessageElement?.classList.add('hidden');
    }
  };

  const showNextFieldset = () => {
    currentIndex++;
    fieldsets[currentIndex].classList.remove('hidden');
  };

  const scrollToBottom = () => {
    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (form) => {
    const action = 'handle_estimate_form';

    const submitMessage = document.querySelector('.submit-message');
    const submitLoader = document.querySelector('.submit-loader');

    submitLoader.classList.remove('hidden');

    const response = await submitForm(form, action);

    submitLoader.classList.add('hidden');
    submitMessage.textContent = response.data.message;
    submitMessage.classList.remove('hidden');
  };

  handleCurrentFieldset();
};
