import { z } from 'zod';

/** 로그인 폼 스키마
 * @description 이메일 형식과 비밀번호 최소 길이 검증
 */
export const signInFormSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('유효하지 않은 이메일 형식입니다'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다'),
});

/** 회원가입 폼 스키마
 * @description 이메일 형식과 비밀번호 최소 길이 및 포함 문자 검증
 */
export const signUpFormSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('유효하지 않은 이메일 형식입니다'),
  password: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(10, '닉네임은 최대 10자까지 입력 가능합니다')
    .regex(
      /^[가-힣a-zA-Z0-9]+$/,
      '닉네임은 한글, 영문, 숫자만 입력 가능합니다'
    ),
  gender: z.enum(['male', 'female'], {
    required_error: '성별을 선택해주세요',
  }),
});

/** OTP 인증 폼 스키마
 * @description 6자리 인증 코드 검증
 */
export const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, '인증 코드는 6자리여야 합니다')
    .max(6, '인증 코드는 6자리여야 합니다')
    .regex(/^\d{6}$/, '인증 코드는 숫자만 입력 가능합니다'),
});

/** 비밀번호 재설정 요청 폼 스키마
 * @description 이메일 형식 검증
 */
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
});

/** 비밀번호 재설정 폼 스키마
 * @description 새 비밀번호와 확인 비밀번호 일치 검증
*/
export const resetPasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다')
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d).*$/,
      '비밀번호는 영문과 숫자를 포함해야 합니다'
    ),
  newPasswordConfirm: z
    .string()
    .min(6, '비밀번호는 최소 6자 이상 입력해야 합니다'),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['newPasswordConfirm'],
});

// 타입 추출
export type SignInFormData = z.infer<typeof signInFormSchema>;
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type OtpFormData = z.infer<typeof otpFormSchema>;
export type ResetPasswordRequestData = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;