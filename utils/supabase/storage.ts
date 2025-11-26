import { createServerSupabaseClient } from '@/utils/supabase/server';

export function getImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/${path}`;
}

/** Supabase Storage 이미지 업로드
 * @param file - 업로드할 파일 (Buffer 형태)
 * @param fileName - 저장할 파일명 (UUID 등 고유값 권장)
 * @returns 업로드된 이미지의 Public URL */
export async function uploadImageToStorage(
  file: Buffer,
  fileName: string
): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  if (!bucket) throw new Error('스토리지 버킷이 설정되지 않았습니다.');

  const filePath = `collection/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  return getImageUrl(filePath);
}

/** Supabase Storage에서 이미지 삭제
 * @param filePath - 삭제할 파일 경로 (예: collection/abc-123.webp)
 */
export async function deleteImageFromStorage(filePath: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  if (!bucket) throw new Error('스토리지 버킷이 설정되지 않았습니다.');

  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) throw new Error(`이미지 삭제 실패: ${error.message}`);
}
