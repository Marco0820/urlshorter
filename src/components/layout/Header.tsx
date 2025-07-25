"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();
  const t = useTranslations('Header');

  const handleLocaleChange = (newLocale: string) => {
    // Manually construct the new path
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/');
    pathSegments[1] = newLocale;
    window.location.pathname = pathSegments.join('/');
  };

  return (
    <header className="px-4 lg:px-20 py-6 relative z-10 bg-blue-800">
      <nav className="grid grid-cols-3 items-center">
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="font-title text-white text-4xl tracking-wide cursor-pointer">
              URL Shortener
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center bg-tinyurl-teal rounded-lg col-start-2 justify-self-center">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded">
              {t('home')}
            </Button>
          </Link>
          <Link href="/my-urls" passHref>
            <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded">
              {t('myUrls')}
            </Button>
          </Link>
          <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded" disabled>
            {t('plans')}
          </Button>
          <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded" disabled>
            {t('blog')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded">
                {t('features')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/features/custom-links">{t('customLinks')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/features/branded-domains">{t('brandedDomains')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/features/link-analytics">{t('linkAnalytics')}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/features/how-it-works">{t('howItWorks')}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {session ? (
            <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded" onClick={() => signOut()}>
              {t('signOut')}
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded" onClick={() => signIn('google')}>
                {t('signUp')}
              </Button>
              <Button variant="ghost" className="text-white hover:bg-sky-500 hover:text-white px-4 py-2 rounded" onClick={() => signIn('google')}>
                {t('logIn')}
              </Button>
            </>
          )}

          <div className="ml-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLocaleChange('zh')}>
                    中文
                  </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="justify-self-end flex items-center">
          {/* Placeholder for the third grid column */}
        </div>
      </nav>
    </header>
  );
} 