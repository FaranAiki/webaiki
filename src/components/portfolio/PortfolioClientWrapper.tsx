"use client";

import React from 'react';
import { useSettings } from '../providers/SettingsContext';

interface PortfolioClientWrapperProps {
  children: React.ReactNode;
}

export default function PortfolioClientWrapper({ children }: PortfolioClientWrapperProps) {
  const { isAtsMode } = useSettings();
  
  // We can use isAtsMode here if needed for complex conditional logic,
  // but for now it primarily provides the context for sub-components
  // and allows us to potentially add client-only logic.
  
  return (
    <div className={isAtsMode ? 'is-ats-active' : ''}>
      {children}
    </div>
  );
}
