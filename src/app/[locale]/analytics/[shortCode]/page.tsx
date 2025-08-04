// src/app/[locale]/analytics/[shortCode]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3, Home } from 'lucide-react';

type Props = {
  params: { shortCode: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Analytics for ${params.shortCode}`,
    robots: {
      index: false, // Tell search engines not to index this page
      follow: false,
    },
  };
}

export default async function Page({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics Feature Coming Soon!</h1>
        <p className="text-gray-600 mb-6">
          We are working hard to bring you detailed analytics for your short link{' '}
          <span className="font-semibold text-blue-700">{params.shortCode}</span>.
          Please check back later!
        </p>
        <Link href="/" passHref>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
