import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToStorage } from '@/utils/supabase/storage';
import { CONSOLE_ERROR } from '@/constants/messages';
import sharp from 'sharp';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_WIDTH = 800;
const WEBP_QUALITY = 75;
const MAX_OUTPUT_SIZE = 500 * 1024; // 500KB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 });

    console.log('📤 업로드 정보:', {
      name: file.name,
      type: file.type,
      originalSize: `${(file.size / 1024).toFixed(2)} KB`
    });

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: '이미지 크기는 2MB 이하여야 합니다' }, { status: 400 });

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 });

    // File을 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sharp를 사용하여 이미지 최적화
    let optimizedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toBuffer();

    console.log(`✅ 1차 압축 완료: ${(optimizedBuffer.length / 1024).toFixed(2)} KB (품질: ${WEBP_QUALITY})`);

    // 파일 크기가 목표보다 크면 품질을 낮춰가며 재압축
    let quality = WEBP_QUALITY;
    while (optimizedBuffer.length > MAX_OUTPUT_SIZE && quality > 40) {
      quality -= 5;
      optimizedBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, null, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 6 })
        .toBuffer();
      console.log(`🔄 재압축: ${(optimizedBuffer.length / 1024).toFixed(2)} KB (품질: ${quality})`);
    }

    console.log(`✨ 최종 압축 완료: ${(optimizedBuffer.length / 1024).toFixed(2)} KB`);

    // 고유 파일명 생성: timestamp + random
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}.webp`;

    const imageUrl = await uploadImageToStorage(optimizedBuffer, fileName);

    return NextResponse.json({ url: imageUrl }, { status: 200 });
  } catch (error) {
    console.error(CONSOLE_ERROR.UPLOAD_IMAGE, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '이미지 업로드에 실패했습니다' },
      { status: 500 }
    );
  }
}
