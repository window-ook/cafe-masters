import Image from 'next/image';

interface LogoImageProps {
  size: number;
}

export default function LogoImage({ size }: LogoImageProps) {
  return (
    <Image
      alt="로고 텍스트 이미지"
      src="https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/logo_text.webp"
      width={size}
      height={size}
      priority={true}
      style={{
        width: 'auto',
        height: 'auto',
      }}
    />
  );
}
