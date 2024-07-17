export const handleEstimateForm = () => {
  const form = document.querySelector('.form');

  if (!form) return;

  const formFields = form.querySelectorAll('.form-field');
  const submitButton = form.querySelector('#submit-button');
  let currentIndex = 0;

  function showNextField() {
    if (currentIndex < formFields.length - 1) {
      const currentFormField = formFields[currentIndex];
      const inputType = currentFormField.dataset.input;
      const validateButton = currentFormField.querySelector('button');
      const questionPopups = currentFormField.querySelectorAll('.popup');
      const inputsGroup = currentFormField.querySelector('.inputs');
      const input = currentFormField.querySelector('input');

      currentFormField.classList.remove('hidden');

      // Initial state setup with GSAP
      gsap.set(questionPopups, { opacity: 0, x: -20 });
      gsap.set(inputsGroup ?? input, { opacity: 0, x: -20 });

      if (validateButton) gsap.set(validateButton, { opacity: 0, x: -20 });

      // Animation for spans
      gsap.fromTo(
        questionPopups,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.2,
          onComplete: () => {
            // Animation for the "inputs" div or the single input
            gsap.fromTo(
              inputsGroup ?? input,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
            );

            // Animation for the validate button if it exists
            if (validateButton) {
              gsap.fromTo(
                validateButton,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
              );
            }
          },
        },
      );

      if (inputType === 'radio') {
        currentFormField
          .querySelectorAll('input')
          .forEach(function (radioButton) {
            radioButton.addEventListener('change', () =>
              validateField('radio', currentFormField),
            );
          });
      } else {
        validateButton?.addEventListener('click', () =>
          validateField(inputType, currentFormField),
        );

        if (inputType === 'text' || inputType === 'email') {
          input?.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
              event.preventDefault(); // Prevent the default form submission
              validateButton.click();
            }
          });
        }
      }
    } else {
      showSubmitButton();
    }
  }

  const validateField = (inputType, formField) => {
    const button = formField.querySelector('button');

    let isValid = false;
    let answerElements = [];

    switch (inputType) {
      case 'text':
      case 'email': {
        const input = formField.querySelector('input');

        if (input.checkValidity()) {
          const answerElement = document.createElement('span');

          answerElement.classList.add('inline-block');
          answerElement.append(input.value);

          isValid = true;
          answerElements = [answerElement];
          input.classList.add('hidden');
        }

        break;
      }
      case 'checkbox': {
        const checkboxes = formField.querySelectorAll('input[type="checkbox"]');
        const checkedCheckboxes = Array.from(checkboxes).filter(
          (checkbox) => checkbox.checked,
        );

        if (checkedCheckboxes.length > 0) {
          isValid = true;
          answerElements = checkedCheckboxes.map((checkbox) => {
            const answerElement = document.createElement('span');

            answerElement.classList.add('inline-block');
            answerElement.append(checkbox.nextElementSibling.innerText);

            return answerElement;
          });
          formField.querySelector('.inputs').classList.add('hidden');
        }

        break;
      }
      case 'radio': {
        const selectedRadio = formField.querySelector(
          'input[type="radio"]:checked',
        );

        if (selectedRadio) {
          const answerElement = document.createElement('span');

          answerElement.classList.add('inline-block');
          answerElement.append(selectedRadio.nextElementSibling.innerText);

          isValid = true;
          answerElements = [answerElement];
          formField.querySelector('.inputs').classList.add('hidden');
        }

        break;
      }
    }

    if (isValid) {
      const answersContainer = document.createElement('div');

      answersContainer.classList.add('flex', 'justify-end', 'gap-4');

      // Append each element individually to the answersContainer
      answerElements.forEach((element) => {
        answersContainer.appendChild(element);
      });

      formField.classList.remove('invalid');
      formFields[currentIndex].firstElementChild.append(answersContainer);

      if (button) {
        button.classList.add('hidden');
        button.removeEventListener('click', () =>
          validateField(inputType, formField),
        );
      }

      currentIndex++;

      if (currentIndex < formFields.length) {
        formFields[currentIndex].classList.remove('hidden');
        showNextField();
      } else {
        showSubmitButton();
      }

      scrollToBottom();
    } else {
      formField.classList.add('invalid');
    }
  };

  const showSubmitButton = () => {
    submitButton.classList.remove('hidden');
  };

  const scrollToBottom = () => {
    form.scrollTo({
      top: form.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Initially show the first field
  showNextField();
};
