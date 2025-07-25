export const handleEmailValid = (email: string): boolean => {
  const pattern = /^\s*[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}\s*$/i;
  return pattern.test(email);
};