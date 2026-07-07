import { validateEmail, validatePassword, validateName, validatePhone } from './clientValidation';

export const runFormValidation = (formData) => {
  const errors = {};
  if ('name' in formData) {
    const err = validateName(formData.name);
    if (err) errors.name = err;
  }
  if ('email' in formData) {
    const err = validateEmail(formData.email);
    if (err) errors.email = err;
  }
  if ('password' in formData) {
    const err = validatePassword(formData.password);
    if (err) errors.password = err;
  }
  if ('phone' in formData) {
    const err = validatePhone(formData.phone);
    if (err) errors.phone = err;
  }
  return errors;
};
