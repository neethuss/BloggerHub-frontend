const validateEmail = (email: string) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  if (!passwordPattern.test(password)) {
    return "Password must contain both letters and numbers";
  }
  return "";
};

export const validateLoginForm = (
  email: string,
  password: string
) => {
  const isAnyFieldEmpty = !email || !password;

  if (isAnyFieldEmpty) {
    return {
      errors: { email: "", password: "" }, 
      isValid: false,
      isAnyFieldEmpty,
    };
  }

  const errors = {
    email: validateEmail(email) ? "" : "Invalid email format",
    password: validatePassword(password),
  };

  const isValid = !errors.email && !errors.password;
  return { errors, isValid, isAnyFieldEmpty };
};


