'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AdSenseContextType {
  showAdsense: boolean;
  setShowAdsense: (show: boolean) => void;
}

const AdSenseContext = createContext<AdSenseContextType | undefined>(undefined);

export function AdSenseProvider({ children }: { children: ReactNode }) {
  const [showAdsense, setShowAdsense] = useState(false);

  return (
    <AdSenseContext.Provider value={{ showAdsense, setShowAdsense }}>
      {children}
    </AdSenseContext.Provider>
  );
}

export function useAdSense() {
  const context = useContext(AdSenseContext);
  if (context === undefined) {
    throw new Error('useAdSense must be used within an AdSenseProvider');
  }
  return context;
}
