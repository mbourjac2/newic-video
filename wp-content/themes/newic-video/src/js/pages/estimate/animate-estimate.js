export const animateEstimate = () => {
  const form = document.querySelector('.form');

  if (!form) return;

  const tl = gsap.timeline();
  const initialState = { opacity: 0, x: -20 };
  const animatedState = {
    opacity: 1,
    x: 0,
    duration: 0.5,
    ease: 'power2.out',
  };

  const animateIntro = () => {
    const introPopups = document.querySelectorAll('.intro span');

    gsap.set(introPopups, initialState);

    tl.fromTo(introPopups, initialState, {
      ...animatedState,
      stagger: 0.2,
    });
  };

  const animateFieldset = ({
    questionPopups,
    fieldControls,
    submitFieldButton,
  }) => {
    gsap.set(questionPopups, initialState);
    gsap.set(fieldControls, initialState);
    if (submitFieldButton) gsap.set(submitFieldButton, initialState);

    tl.fromTo(questionPopups, initialState, {
      ...animatedState,
      stagger: 0.2,
    });

    tl.fromTo(fieldControls, initialState, animatedState);

    if (submitFieldButton) {
      tl.fromTo(submitFieldButton, initialState, animatedState);
    }
  };

  animateIntro();

  return { animateFieldset };
};
