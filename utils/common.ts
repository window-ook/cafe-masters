export const handleCopyClick = async (param: string) => {
  try {
    await navigator.clipboard.writeText(param);
    alert('클립보드에 복사되었습니다!');
  } catch (error) {
    console.error(error);
    alert('다시 시도해주세요.');
  }
};

export const checkEmailValid = (email: string): boolean => {
  const pattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return pattern.test(email);
};
