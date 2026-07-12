"use client";

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ClientOnlyImageProps extends ImageProps {
    fallback?: React.ReactNode;
}

export function ClientOnlyImage({ fallback, ...props }: ClientOnlyImageProps) {
    const [mounted, setMounted] = useState(false);

    const [error, setError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{fallback || null}</>;
    }

    if (error) {
        return <>{fallback || <div className="absolute inset-0 bg-theme-surface-strong/50 animate-pulse" />}</>;
    }

    const { alt, ...rest } = props;
    return <Image alt={alt || ''} {...rest} onError={() => setError(true)} />;
}
