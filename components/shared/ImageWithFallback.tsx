'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { CONSOLE_LOG } from '@/utils/constants/messages';

interface IImageWithFallback extends Omit<ImageProps, 'src'> {
    src: string;
    fallbackSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
}

export default function ImageWithFallback(props: IImageWithFallback) {
    const {
        src,
        fallbackSrc,
        alt,
        width,
        height,
        className,
        priority = false,
        quality = 75,
        placeholder = 'blur',
        ...rest
    } = props;

    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            className={className}
            onError={() => {
                console.log(CONSOLE_LOG.IMAGE_SRC_ERROR);
                setImgSrc(fallbackSrc);
            }}
            width={width}
            height={height}
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
            crossOrigin=""
            decoding={priority ? 'sync' : 'async'}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={
                placeholder === 'blur'
                    ? 'data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
                    : undefined
            }
            unoptimized={false}
        />
    );
}