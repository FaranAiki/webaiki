"use client";

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientOnlyImageProps extends ImageProps {
    fallback?: React.ReactNode;
}

export function ClientOnlyImage({ fallback, ...props }: ClientOnlyImageProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{fallback || null}</>;
    }

    const { alt, ...rest } = props;
    return <Image alt={alt || ''} {...rest} />;
}
