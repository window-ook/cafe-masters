interface IAuthError {
  message?: string;
  error_description?: string;
  code?: string;
}

/** 에러 메시지에서 남은 시간(초)을 추출
 * @param message - 에러 메시지
 * @returns 추출된 초 수 또는 null
 */
function extractSecondsFromMessage(message: string): number | null {
  const patterns = [
    /(\d+)\s*seconds?\s*left/i,
    /(\d+)초?\s*후/i,
    /(\d+)\s*sec/i,
    /wait\s*(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return null;
}

/** Supabase 인증 에러를 사용자 친화적인 한국어 메시지로 변환
 * @param error - Supabase 에러 객체 또는 에러 메시지
 * @returns 변환된 한국어 에러 메시지
 */
export function getAuthErrorMessage(error: IAuthError | Error | string | unknown): string {
  let errorMessage = '';
  let errorCode = '';

  if (typeof error === 'string') errorMessage = error;
  else if (error && typeof error === 'object') {
    const errorObj = error as IAuthError;
    errorMessage = errorObj.message || errorObj.error_description || '';
    errorCode = errorObj.code || '';
  }

  // Supabase 에러 코드 및 메시지에 따른 분기 처리
  switch (errorCode) {
    case 'invalid_credentials':
      return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.';

    case 'email_not_confirmed':
      return '이메일 인증이 완료되지 않았습니다. 인증 메일을 확인해주세요.';

    case 'signup_disabled':
      return '현재 회원가입이 비활성화되어 있습니다.';

    case 'invalid_request':
      return '잘못된 요청입니다. 입력 정보를 확인해주세요.';

    case 'weak_password':
      return '비밀번호가 너무 약합니다. 더 강한 비밀번호를 설정해주세요.';

    case 'user_already_registered':
      return '이미 가입된 이메일입니다. 로그인을 시도해주세요.';

    case 'over_email_send_rate_limit':
      const seconds = extractSecondsFromMessage(errorMessage);
      return seconds
        ? `60초마다 가능합니다. 잠시 후 다시 시도해주세요. (${seconds}초 후)`
        : '60초마다 가능합니다. 잠시 후 다시 시도해주세요. (약 60초 후)';

    default:
      const lowerErrorMessage = errorMessage.toLowerCase();
      if (lowerErrorMessage.includes('invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
      if (lowerErrorMessage.includes('email not confirmed')) return '이메일 인증이 완료되지 않았습니다. 인증 메일을 확인해주세요.';
      if (lowerErrorMessage.includes('invalid email')) return '올바르지 않은 이메일 형식입니다. 다시 확인해주세요.';
      if (lowerErrorMessage.includes('password')) return '비밀번호가 올바르지 않습니다. 확인해주세요.';
      if (lowerErrorMessage.includes('user not found')) return '존재하지 않는 이메일입니다. 확인해주세요.';
      if (lowerErrorMessage.includes('network')) return '네트워크 연결에 문제가 있습니다. 다시 시도해주세요.';
      if (lowerErrorMessage.includes('rate limit') || lowerErrorMessage.includes('email rate limit exceeded')) {
        const seconds = extractSecondsFromMessage(errorMessage);
        return seconds
          ? `이메일 발송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요. (${seconds}초 후)`
          : '이메일 발송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요. (약 60초 후)';
      }
      if (lowerErrorMessage.includes('too many requests')) return '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
      return '요청 처리 중 에러가 발생했습니다. 다시 시도해주세요.';
  }
}