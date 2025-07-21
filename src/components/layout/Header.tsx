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

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="px-4 lg:px-20 py-6 relative z-10 bg-blue-800">
      <nav className="grid grid-cols-3 items-center">
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="font-title text-white text-4xl tracking-wide cursor-pointer">
              TINYURL-AI
            </h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center bg-tinyurl-teal rounded-lg col-start-2 justify-self-center">
          <div className="flex items-center">
            <div className="flex items-center bg-tinyurl-teal rounded">
              <Link href="/" passHref>
                <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded">
                  首页
                </Button>
              </Link>
              <Link href="/my-urls" passHref>
                <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded">
                  我的链接
                </Button>
              </Link>
              <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded hidden" disabled>
                套餐
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded" disabled>
                博客
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded">
                    功能
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/features/custom-links">Custom Links</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/features/branded-domains">Branded Domains</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/features/link-analytics">Link Analytics</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/features/how-it-works">How It Works</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {session ? (
                <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded" onClick={() => signOut()}>
                  登出
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded" onClick={() => signIn('google')}>
                    注册
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 px-4 py-2 rounded" onClick={() => signIn('google')}>
                    登录
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 