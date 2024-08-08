import { handleContactForm } from './handle-contact-form/handle-contact-form';
import { handleMap } from './handle-map/handle-map';

export const handleContact = () => {
  const contactPage = document.querySelector('.contact');

  if (!contactPage) return;

  handleContactForm();
  handleMap();
};
