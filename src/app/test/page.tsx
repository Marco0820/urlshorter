"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const [longUrl, setLongUrl] = useState('https://www.example.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testShorten = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: longUrl })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Test failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>API测试页面</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">测试URL:</label>
            <Input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="输入要缩短的URL"
            />
          </div>

          <Button onClick={testShorten} disabled={loading}>
            {loading ? '测试中...' : '测试缩短API'}
          </Button>

          {result && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">API响应:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
