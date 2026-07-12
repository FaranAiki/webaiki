"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function LazyClientBoundary({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: "200px" });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref}>
            {isVisible ? children : fallback}
        </div>
    );
}
