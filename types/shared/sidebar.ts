/** 마스터즈 월드 티어 */
export type Tier = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'MASTER';

/** 뱃지 */
export interface BadgeProps {
    tier: Tier;
    range: string;
    color: string;
}
