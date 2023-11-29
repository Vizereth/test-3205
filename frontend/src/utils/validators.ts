export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateNumber = (number: string) => {
  const regex = /^\d{6}$/;
  return regex.test(number) || number.trim() === "";
};
