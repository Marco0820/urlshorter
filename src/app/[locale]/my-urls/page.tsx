"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, QrCode as QrCodeIcon } from 'lucide-react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import Link from 'next/link';

interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}

export default function MyUrlsPage() {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortUrl | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('tinyurls') || '[]');
    setUrls(storedUrls);
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('tinyurls');
    setUrls([]);
  };

  const downloadQRCode = (format: 'svg' | 'png') => {
    if (!selectedUrl || !qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${selectedUrl.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My URLs</h1>
          <Link href="/" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Home</Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recently Generated Links</CardTitle>
            {urls.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleClearHistory} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {urls.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead className="hidden md:table-cell">Original URL</TableHead>
                    <TableHead className="hidden sm:table-cell">Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow key={url.shortCode}>
                      <TableCell>
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-medium px-3 py-1 rounded-md hover:bg-blue-700">
                          {url.shortUrl}
                        </a>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">{url.originalUrl}</TableCell>
                      <TableCell className="hidden sm:table-cell">{new Date(url.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUrl(url)} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <QrCodeIcon className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-8">You haven't created any TinyURLs yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedUrl(null)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">QR Code for {selectedUrl.shortUrl}</h3>
            <div className="flex justify-center" ref={qrCodeRef}>
              <QRCode
                value={selectedUrl.shortUrl}
                size={256}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <Button size="sm" onClick={() => downloadQRCode('png')} className="bg-blue-600 hover:bg-blue-700 text-white">Download PNG</Button>
            </div>
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSelectedUrl(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
} 