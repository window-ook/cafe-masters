import { z } from 'zod';

export const profileSetupSchema = z.object({
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

export type ProfileSetupData = z.infer<typeof profileSetupSchema>;