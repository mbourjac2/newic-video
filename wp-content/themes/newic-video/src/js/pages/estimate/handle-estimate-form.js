export const handleEstimateForm = () => {
  const form = document.querySelector('.form');

  if (!form) return;

  const fieldsets = form.querySelectorAll('.fieldset');
  let currentIndex = 0;

  const handleCurrentFieldset = () => {
    const fieldset = fieldsets[currentIndex];
    const inputType = fieldset.dataset.input;

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
      const { values, errorMessage } = getValidatedFieldValues(
        inputType,
        fieldControls,
      );

      handleErrorMessage({ fieldset, errorMessage });

      if (values.length > 0) {
        fieldControls.classList.add('hidden');
        submitFieldButton?.classList.add('hidden');

        displayFieldsetValues(values);

        if (currentIndex < fieldsets.length - 1) {
          showNextFieldset();
          handleCurrentFieldset();
        } else {
          handleSubmitForm();
        }

        scrollToBottom();
      }
    };

    const handleInput = () => {
      const { errorMessage } = getValidatedFieldValues(
        inputType,
        fieldControls,
      );

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

  const getValidatedFieldValues = (inputType, fieldControls) => {
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

  const animateFieldset = ({
    questionPopups,
    fieldControls,
    submitFieldButton,
  }) => {
    const initialState = { opacity: 0, x: -20 };
    const animatedState = {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
    };

    gsap.set(questionPopups, initialState);
    gsap.set(fieldControls, initialState);

    if (submitFieldButton) gsap.set(submitFieldButton, initialState);

    gsap.fromTo(questionPopups, initialState, {
      ...animatedState,
      stagger: 0.2,
      onComplete: () => {
        gsap.fromTo(fieldControls, initialState, animatedState);

        if (submitFieldButton) {
          gsap.fromTo(submitFieldButton, initialState, animatedState);
        }
      },
    });
  };

  const scrollToBottom = () => {
    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSubmitForm = () => {
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) console.log(key, value);
  };

  handleCurrentFieldset();
};
