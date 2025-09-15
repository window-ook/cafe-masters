/**
 * input onChange 핸들러와 함께 사용하는 안전한 값 설정 함수
 * @description 입력은 자유롭게 허용하고, 위험한 문자는 제거
 * @param value 입력값
 * @param setValue 상태 설정 함수
 */
export const handleSafeInput = (
    value: string,
    setValue: (value: string) => void
): void => {
    // 위험한 스크립트 패턴만 제거, 일반 특수문자는 허용
    const cleanValue = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');

    setValue(cleanValue);
};