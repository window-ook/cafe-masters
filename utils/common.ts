export const handleCopyClick = async (param: any) => {
  try {
    await navigator.clipboard.writeText(param);
    alert('클립보드에 복사되었습니다!');
  } catch (error) {
    alert('다시 시도해주세요.');
  }
};
