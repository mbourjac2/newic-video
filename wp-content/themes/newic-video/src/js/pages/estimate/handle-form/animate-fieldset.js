export const animateFieldset = ({
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

  const tl = gsap.timeline();

  // Set the initial state for all elements
  gsap.set(questionPopups, initialState);
  gsap.set(fieldControls, initialState);
  if (submitFieldButton) gsap.set(submitFieldButton, initialState);

  // Add animations to the timeline
  tl.fromTo(questionPopups, initialState, {
    ...animatedState,
    stagger: 0.2,
  });

  tl.fromTo(fieldControls, initialState, animatedState);

  if (submitFieldButton) {
    tl.fromTo(submitFieldButton, initialState, animatedState);
  }
};
