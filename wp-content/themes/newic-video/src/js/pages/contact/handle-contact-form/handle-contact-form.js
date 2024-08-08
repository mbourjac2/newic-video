import { validateOnInput } from './validate-on-input';
import { validateOnBlur } from './validate-on-blur';
import { handleSubmit } from './handle-submit';

export const handleContactForm = () => {
  const form = document.querySelector('.form');

  if (!form) return;

  validateOnInput(form);
  validateOnBlur(form);
  handleSubmit(form);
};
