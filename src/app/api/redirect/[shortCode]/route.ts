import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { parseAnalyticsData, AnalyticsData } from '@/lib/analytics.server';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    const url = await db.url.findUnique({
      where: {
        shortCode,
        isActive: true
      }
    });

    if (!url) {
      return NextResponse.json(
        { error: '短链不存在或已失效' },
        { status: 404 }
      );
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      return NextResponse.json(
        { error: '短链已过期' },
        { status: 410 }
      );
    }

    if (url.maxClicks) {
      const clickCount = await db.click.count({
        where: { urlId: url.id }
      });

      if (clickCount >= url.maxClicks) {
        return NextResponse.json(
          { error: '短链已达到最大点击次数' },
          { status: 410 }
        );
      }
    }

    const password = request.nextUrl.searchParams.get('password');
    if (url.password && password !== url.password) {
      return NextResponse.json(
        { error: '需要密码', requiresPassword: true },
        { status: 401 }
      );
    }

    const referer = request.headers.get('referer') || undefined;

    const utmParams = {
      source: request.nextUrl.searchParams.get('utm_source') || undefined,
      medium: request.nextUrl.searchParams.get('utm_medium') || undefined,
      campaign: request.nextUrl.search_params.get('utm_campaign') || undefined,
      term: request.nextUrl.searchParams.get('utm_term') || undefined,
      content: request.nextUrl.searchParams.get('utm_content') || undefined,
    };

    const analyticsData: AnalyticsData = {
      request,
      utmParams
    };

    const parsedAnalytics = parseAnalyticsData(analyticsData);
    
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const DEBOUNCE_SECONDS = 10;
    const existingClick = await db.click.findFirst({
      where: {
        urlId: url.id,
        ipAddress,
        userAgent,
        timestamp: {
          gte: new Date(Date.now() - DEBOUNCE_SECONDS * 1000),
        },
      },
    });

    const isUnique = !existingClick;

    if(isUnique) {
      await db.click.create({
        data: {
          urlId: url.id,
          ipAddress,
          userAgent,
          referrer: referer,
          browser: parsedAnalytics.browser,
          browserVersion: parsedAnalytics.browserVersion,
          os: parsedAnalytics.os,
          osVersion: parsedAnalytics.osVersion,
          device: parsedAnalytics.device,
          country: parsedAnalytics.country,
          city: parsedAnalytics.city,
          region: parsedAnalytics.region,
          latitude: parsedAnalytics.latitude,
          longitude: parsedAnalytics.longitude,
          utmSource: parsedAnalytics.utmSource,
          utmMedium: parsedAnalytics.utmMedium,
          utmCampaign: parsedAnalytics.utmCampaign,
          utmTerm: parsedAnalytics.utmTerm,
          utmContent: parsedAnalytics.utmContent,
          isBot: parsedAnalytics.isBot,
        }
      });
    }

    const targetUrl = url.originalUrl;
    
    return NextResponse.redirect(targetUrl, 302);

  } catch (error) {
    console.error('Error in redirect:', error);
    return NextResponse.json(
      { error: '重定向时发生错误' },
      { status: 500 }
    );
  }
}
