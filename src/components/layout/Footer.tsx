// src/components/layout/Footer.tsx
import Link from 'next/link';
import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-300 mb-4 md:mb-0">
            Copyright © {currentYear} urltiny.cc LLC. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/tos" className="text-sm text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-gray-300 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
