"use client";

import React from 'react';

export interface LayoutOption<T extends string> {
    id: T;
    icon: React.ReactNode;
    label: string;
}

interface LayoutSwitcherProps<T extends string> {
    currentLayout: T;
    setCurrentLayout: (layout: T) => void;
    canChange: boolean;
    options: LayoutOption<T>[];
}

export function LayoutSwitcher<T extends string>({ 
    currentLayout, 
    setCurrentLayout, 
    canChange, 
    options 
}: LayoutSwitcherProps<T>) {
    if (!canChange || options.length <= 1) return null;
    
    return (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-colors duration-300 bg-theme-surface/90 border-theme-border`}>
            <div className="flex gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setCurrentLayout(opt.id)}
                        title={opt.label}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            currentLayout === opt.id
                                ? 'bg-theme-500 text-white shadow-sm'
                                : 'text-theme-muted hover:text-foreground hover:bg-theme-surface-strong'
                        }`}
                    >
                        {opt.icon}
                    </button>
                ))}
            </div>
        </div>
    );
}
