"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HelpCircle, Link as LinkIcon, Settings, CheckCircle, Share2, Copy as CopyIcon, Zap, BarChart3, Globe, Shield, UserCheck, QrCode as QrCodeIcon, ArrowUpRightSquare, X } from 'lucide-react';
import Link from 'next/link';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signIn, signOut } from 'next-auth/react';
import {useTranslations} from 'next-intl';


export default function Home() {
  const t = useTranslations('HomePage');
  const tToast = useTranslations('Toasts');
  const tPopup = useTranslations('Popups');
  const tError = useTranslations('Errors');

  const { data: session } = useSession();
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [domain, setDomain] = useState('tinyurlai.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if cookie consent has been given
    if (!document.cookie.includes('cookie_consent=true')) {
      setShowCookieConsent(true);
    }
  }, []);

  const handleAcceptCookie = () => {
    // Set cookie for 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie_consent=true; expires=${expiryDate.toUTCString()}; path=/`;
    setShowCookieConsent(false);
  };

  const handleCopy = () => {
    if (!result?.shortUrl) return;
    navigator.clipboard.writeText(result.shortUrl).then(() => {
      setShowCopySuccess(true);
      setTimeout(() => {
        setShowCopySuccess(false);
      }, 3000); // Hide after 3 seconds
    });
  };

  const handleShortenAnother = () => {
    setResult(null);
    setLongUrl('');
    setCustomAlias('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    if (customAlias && customAlias.length < 5) {
      setError(tError('alias_min_length'));
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalUrl: longUrl,
          customAlias: customAlias || undefined,
          domain,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        // Save to local storage
        const storedUrls = JSON.parse(localStorage.getItem('tinyurls') || '[]');
        storedUrls.unshift(data.data); // Add to the beginning of the array
        if (storedUrls.length > 20) { // Keep only the latest 20
          storedUrls.pop();
        }
        localStorage.setItem('tinyurls', JSON.stringify(storedUrls));
      } else {
        setError(data.error || tError('creation_failed'));
      }
    } catch (err) {
      setError(tError('network_error'));
    } finally {
      setLoading(false);
    }
  };
  
  const downloadQRCode = () => {
    if (!result || !qrCodeRef.current) return;
    
    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `${result.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/2">
              <Card className="bg-white/90 backdrop-blur-sm border-0 rounded-xl shadow-lg">
                <CardContent className="p-8">
                  {!result ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <label className="flex items-center font-medium text-gray-800 text-lg">
                          <LinkIcon className="w-6 h-6 mr-3 text-blue-500" />
                          {t('form_title')}
                        </label>
                        <Input
                          placeholder={t('form_placeholder')}
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          className="bg-gray-100 border-gray-300 rounded-lg py-3 px-4 text-gray-800 placeholder:text-gray-400"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center font-medium text-gray-800 text-lg">
                          <Settings className="w-6 h-6 mr-3 text-blue-500" />
                          {t('form_customize')}
                        </label>
                        <div className="flex gap-3">
                          <Select value={domain} onValueChange={setDomain} disabled={loading}>
                            <SelectTrigger className="w-48 bg-gray-100 border-gray-300 rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tinyurlai.com">tinyurlai.com</SelectItem>
                              <SelectItem value="custom.link">custom.link</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder={t('form_alias_placeholder')}
                            value={customAlias}
                            onChange={(e) => setCustomAlias(e.target.value)}
                            className="flex-1 bg-gray-100 border-gray-300 rounded-lg"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      )}

                      <div className="flex items-start space-x-3 pt-2">
                        <input
                          id="terms"
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          {t('form_terms_agree')}{' '}
                          <Link href="/tos" className="underline hover:text-blue-800 text-blue-600">{t('form_terms_terms')}</Link>,{' '}
                          <Link href="/privacy" className="underline hover:text-blue-800 text-blue-600">{t('form_terms_privacy')}</Link>,{' '}
                          {t('form_terms_and')}{' '}
                          <Link href="/cookies" className="underline hover:text-blue-800 text-blue-600">{t('form_terms_cookies')}</Link>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-lg transition-all"
                        disabled={!longUrl.trim() || loading || !agreedToTerms}
                      >
                        {loading ? t('form_button_loading') : t('form_button')}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="flex items-center font-medium text-gray-700 text-sm">
                           <LinkIcon className="w-4 h-4 mr-2" />
                           {t('result_original_url')}
                         </label>
                         <Input
                           value={result.originalUrl}
                           className="bg-gray-100 border-gray-300 rounded-md py-2 text-gray-800"
                           readOnly
                         />
                       </div>
                       <div className="space-y-2">
                          <label className="flex items-center font-medium text-gray-700 text-sm">
                           <Zap className="w-4 h-4 mr-2" />
                           {t('result_short_url')}
                         </label>
                         <Input
                           value={result.shortUrl}
                           className="bg-gray-100 border-gray-300 rounded-md py-2 text-gray-800 font-semibold"
                           readOnly
                         />
                       </div>
                       
                       <div className="grid grid-cols-4 gap-2 pt-2">
                          <Button variant="outline" className="flex-col h-auto text-white" onClick={() => window.open(result.shortUrl, '_blank')}>
                            <ArrowUpRightSquare className="w-5 h-5 mb-1" />
                            <span className="text-xs">{t('result_visit')}</span>
                          </Button>
                          <Button variant="outline" className="flex-col h-auto text-white" onClick={() => setShowQrCode(true)}>
                            <QrCodeIcon className="w-5 h-5 mb-1" />
                            <span className="text-xs">{t('result_qrcode')}</span>
                          </Button>
                          <Button variant="outline" className="flex-col h-auto relative text-white" onClick={() => setShowShare(!showShare)}>
                            <Share2 className="w-5 h-5 mb-1" />
                            <span className="text-xs">{t('result_share')}</span>
                          </Button>
                          <Button variant="outline" className="flex-col h-auto text-white" onClick={handleCopy}>
                            <CopyIcon className="w-5 h-5 mb-1" />
                            <span className="text-xs">{t('result_copy')}</span>
                          </Button>
                       </div>
 
                       {result.aiInsights && (
                         <div className="pt-2">
                           <h4 className="font-medium text-green-800 mb-2 text-sm">{t('result_ai_insights')}</h4>
                           <ul className="space-y-1 bg-green-50 p-3 rounded-lg">
                             {result.aiInsights.map((insight: string, index: number) => (
                               <li key={index} className="text-xs text-green-700">{insight}</li>
                             ))}
                           </ul>
                         </div>
                       )}
 
                       <div className="flex items-center space-x-2 pt-2">
                         <Button variant="outline" className="flex-1 text-white" onClick={() => alert('Coming soon!')}>
                           <BarChart3 className="w-4 h-4 mr-2" />
                           {t('result_get_analytics')}
                         </Button>
                         <Link href="/link-management" passHref className="flex-1">
                           <Button variant="outline" className="w-full text-white">{t('result_my_urls')}</Button>
                         </Link>
                         <Button onClick={handleShortenAnother} variant="outline" className="flex-1 text-white">{t('result_shorten_another')}</Button>
                       </div>
                     </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Marketing */}
            <div className="w-full lg:w-1/2 text-white">
              <div className="lg:pl-8">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">
                  {t('title')}
                </h1>
                <p className="text-lg mb-6 text-gray-200 leading-relaxed">
                  {t('subtitle')}
                </p>
                <p className="mb-8 text-gray-200">
                  {t('marketing_promo_text')}
                </p>

                <div className="flex flex-col md:flex-row gap-4 mb-10">
                  <Button className="flex-1 bg-white hover:bg-gray-100 text-blue-700 font-bold py-3">
                    {t('marketing_create_account')}
                  </Button>
                </div>

                <div className="space-y-5">
                  <h3 className="font-semibold">{t('marketing_features_title')}</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_1')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_2')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_3')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_4')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_5')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="w-5 h-5 text-sky-300" />
                      <span className="text-gray-100">{t('marketing_feature_6')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copy Success Notification */}
      {showCopySuccess && (
        <div className="fixed top-24 right-4 bg-green-600 text-white p-3 rounded-md shadow-lg z-50 flex items-center transition-opacity duration-300">
          <CheckCircle className="w-5 h-5 mr-2" />
          <div>
            <p className="font-semibold text-sm">{tToast('copy_success_title')}</p>
            <p className="text-xs">{tToast('copy_success_message')}</p>
          </div>
          <button onClick={() => setShowCopySuccess(false)} className="ml-4 text-white/80 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {showCookieConsent && (
        <div className="fixed bottom-12 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50">
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900">{tPopup('cookie_title')}</h3>
            <p className="text-sm text-gray-600">
              {tPopup('cookie_message')}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                {tPopup('cookie_learn_more')}
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleAcceptCookie}>
                {tPopup('cookie_accept')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showQrCode && result && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQrCode(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">{tPopup('qrcode_title', {url: result.shortUrl})}</h3>
            <div className="flex justify-center" ref={qrCodeRef}>
              <QRCode
                value={result.shortUrl}
                size={256}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={downloadQRCode}>{tPopup('download_png')}</Button>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowQrCode(false)}>{tPopup('close')}</Button>
          </div>
        </div>
      )}

      {showShare && result && (
         <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowShare(false)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setShowShare(false)}><X className="w-4 h-4" /></Button>
            <h3 className="text-lg font-bold mb-4 text-center">{tPopup('share_title')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(result.shortUrl)}&text=Check%20this%20out!`} target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-4 rounded-lg flex items-center justify-center hover:bg-gray-300">Twitter</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(result.shortUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-4 rounded-lg flex items-center justify-center hover:bg-gray-300">Facebook</a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(result.shortUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-4 rounded-lg flex items-center justify-center hover:bg-gray-300">LinkedIn</a>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(result.shortUrl)}`} target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-4 rounded-lg flex items-center justify-center hover:bg-gray-300">WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 