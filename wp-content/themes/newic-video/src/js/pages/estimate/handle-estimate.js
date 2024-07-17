import { handleEstimateForm } from './handle-estimate-form.js';

export const handleEstimate = () => {
  const estimatePage = document.querySelector('.estimate');

  if (!estimatePage) return;

  handleEstimateForm();
};
