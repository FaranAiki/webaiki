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
    isDark: boolean;
    canChange: boolean;
    options: LayoutOption<T>[];
}

export function LayoutSwitcher<T extends string>({ 
    currentLayout, 
    setCurrentLayout, 
    isDark, 
    canChange, 
    options 
}: LayoutSwitcherProps<T>) {
    if (!canChange || options.length <= 1) return null;
    
    return (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center p-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-colors duration-300 ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
            <div className="flex gap-1">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => setCurrentLayout(opt.id)}
                        title={opt.label}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                            currentLayout === opt.id
                                ? 'bg-cyan-500 text-white shadow-sm'
                                : isDark
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {opt.icon}
                    </button>
                ))}
            </div>
        </div>
    );
}
