import { handleEstimateForm } from './form/handle-form.js';

export const handleEstimate = () => {
  const estimatePage = document.querySelector('.estimate');

  if (!estimatePage) return;

  handleEstimateForm();
};
