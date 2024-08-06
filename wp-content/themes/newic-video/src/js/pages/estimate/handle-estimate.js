import { handleEstimateForm } from './handle-form/handle-form.js';
import { animateEstimate } from './animate-estimate.js';

export const handleEstimate = () => {
  const estimatePage = document.querySelector('.estimate');

  if (!estimatePage) return;

  const { animateFieldset } = animateEstimate();
  handleEstimateForm(animateFieldset);
};
