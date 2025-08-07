/** 
 * XSS 방어를 위한 문자열 이스케이프 처리
 * @param text 이스케이프할 텍스트
 * @returns 안전하게 처리된 텍스트
 */
export const escapeForXSS = (text: string): string => {
    if (!text) return text;
    
    // HTML 특수문자 이스케이프
    return text
        .replace(/&/g, '&amp;')     // & 먼저 처리 (다른 엔티티와 충돌 방지)
        .replace(/</g, '&lt;')      // < 태그 방지
        .replace(/>/g, '&gt;')      // > 태그 방지
        .replace(/"/g, '&quot;')    // " 속성값 방지
        .replace(/'/g, '&#x27;')    // ' 속성값 방지
        .replace(/\//g, '&#x2F;')   // / 경로 방지
        .replace(/`/g, '&#x60;');   // ` 템플릿 리터럴 방지
};

/**
 * input onChange 핸들러와 함께 사용하는 안전한 값 설정 함수
 * @param value 입력값
 * @param setValue 상태 설정 함수
 */
export const handleSafeInput = (
    value: string, 
    setValue: (value: string) => void
): void => {
    setValue(escapeForXSS(value));
};

/**
 * React Hook Form용 XSS 방어 transform 함수
 * @param value 폼 입력값
 * @returns 안전하게 처리된 값
 */
export const transformSafeInput = (value: string): string => {
    return escapeForXSS(value);
};