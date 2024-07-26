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
