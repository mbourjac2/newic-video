export const validateInput = (input) => {
  const isValidPhone = (input) => {
    // Regular expression for validating french phone numbers:
    //   - The number must start with the international dialing code for France, either '+33' or '0033', or a leading '0' for domestic numbers.
    //   - After the dialing code, there can be optional spaces, followed by a digit from 1 to 9 (excluding 0 as the first digit).
    //   - The digit is then followed by four blocks of two digits each, which can be separated by spaces, dots, or hyphens.
    //   - The 'gi' flags enable global and case-insensitive matching.
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gi;
    return phoneRegex.test(input.value.trim());
  };

  switch (true) {
    case input.validity.valueMissing:
      return 'Ce champ est requis.';
    case input.type === 'email' && input.validity.typeMismatch:
      return 'Veuillez saisir une adresse e-mail valide.';
    case input.type === 'tel' && !isValidPhone(input):
      return 'Veuillez saisir un numéro de téléphone valide.';
    default:
      return '';
  }
};
