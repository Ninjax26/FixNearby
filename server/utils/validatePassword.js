const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
const MIN_LENGTH = 6;

export const validatePassword = (password) => {
  if (!password || password.length < MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_LENGTH} characters`,
    };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: "Password must contain uppercase, lowercase and a number",
    };
  }

  return { valid: true, message: null };
};
