'use client';

import Image from 'next/image';

export default function AuthBackgroundCards() {
  const imageSrc = '/image/logo.avif';

  return (
    <section className="circles">
      <Image
        src={imageSrc}
        alt="background card"
        width={104}
        height={104}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={80}
        height={80}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={128}
        height={128}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={144}
        height={144}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={24}
        height={24}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={96}
        height={96}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={56}
        height={56}
        priority
      />
      <Image
        src={imageSrc}
        alt="background card"
        width={104}
        height={104}
        priority
      />
    </section>
  );
}
