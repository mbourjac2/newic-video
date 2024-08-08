import { handleContactForm } from './handle-contact-form/handle-contact-form';

export const handleContact = () => {
  const contactPage = document.querySelector('.contact');

  if (!contactPage) return;

  handleContactForm();
};
