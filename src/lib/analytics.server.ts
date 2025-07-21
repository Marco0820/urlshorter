import { NextRequest } from 'next/server';
import { userAgent } from 'next/server';

export interface AnalyticsData {
  request: NextRequest;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface ParsedAnalytics {
  // Geographic
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;

  // Device & Browser
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  device?: string;
  isBot: boolean;

  // UTM
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

/**
 * AI-powered analytics parsing using Next.js built-ins
 */
export function parseAnalyticsData(data: AnalyticsData): ParsedAnalytics {
  const { request, utmParams } = data;
  
  const ua = userAgent(request);
  const geo = request.geo || {};

  return {
    // Geographic
    country: geo.country,
    city: geo.city,
    region: geo.region,
    latitude: geo.latitude,
    longitude: geo.longitude,

    // Device & Browser
    browser: ua.browser.name,
    browserVersion: ua.browser.version,
    os: ua.os.name,
    osVersion: ua.os.version,
    device: ua.device.type === 'mobile' ? 'mobile' : ua.device.type === 'tablet' ? 'tablet' : 'desktop',
    isBot: ua.isBot,

    // UTM Parameters
    utmSource: utmParams?.source,
    utmMedium: utmParams?.medium,
    utmCampaign: utmParams?.campaign,
    utmTerm: utmParams?.term,
    utmContent: utmParams?.content,
  };
} 