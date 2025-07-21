import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateAIInsights } from '@/lib/analytics';
import { Click } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    // Find the URL
    const url = await db.url.findUnique({
      where: { shortCode },
      include: {
        clicks: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!url) {
      return NextResponse.json(
        { error: '短链不存在' },
        { status: 404 }
      );
    }

    // Calculate basic metrics
    const totalClicks = url.clicks.length;
    const uniqueClicks = url.clicks.filter((click: Click) => click.isUnique).length;
    const botClicks = url.clicks.filter((click: Click) => click.isBot).length;
    const humanClicks = totalClicks - botClicks;

    // Geographic analysis
    const countryStats = url.clicks.reduce((acc: Record<string, number>, click: Click) => {
      if (click.country) {
        acc[click.country] = (acc[click.country] || 0) + 1;
      }
      return acc;
    }, {});

    const topCountries = Object.entries(countryStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Device analysis
    const deviceStats = url.clicks.reduce((acc: Record<string, number>, click: Click) => {
      if (click.device) {
        acc[click.device] = (acc[click.device] || 0) + 1;
      }
      return acc;
    }, {});

    // Browser analysis
    const browserStats = url.clicks.reduce((acc: Record<string, number>, click: Click) => {
      if (click.browser) {
        acc[click.browser] = (acc[click.browser] || 0) + 1;
      }
      return acc;
    }, {});

    // UTM source analysis
    const utmSourceStats = url.clicks.reduce((acc: Record<string, number>, click: Click) => {
      const source = click.utmSource || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    // Time series data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClicks = url.clicks.filter((click: Click) =>
      click.timestamp >= thirtyDaysAgo
    );

    const timeSeriesData = recentClicks.reduce((acc: Record<string, number>, click: Click) => {
      const date = click.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const timeSeries = Object.entries(timeSeriesData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, clicks: count }));

    // Real-time data (last 24 hours by hour)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const realtimeClicks = url.clicks.filter((click: Click) =>
      click.timestamp >= twentyFourHoursAgo
    );

    const hourlyData = realtimeClicks.reduce((acc: Record<string, number>, click: Click) => {
      const hour = click.timestamp.getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const realtimeStats = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      clicks: hourlyData[i] || 0
    }));

    // Conversion tracking (simplified)
    const conversions = url.clicks.filter((click: Click) => click.converted).length;
    const conversionRate = totalClicks > 0 ? (conversions / totalClicks) * 100 : 0;

    // Prepare analytics object for AI insights
    const analyticsDataForAI = {
      totalClicks,
      uniqueClicks,
      topCountries,
      devices: deviceStats,
      conversionRate: conversionRate / 100,
      url,
      clicksByHour: realtimeStats,
      topReferers: [], // simplified for now
      returningUsers: totalClicks - uniqueClicks,
    };

    // Generate AI insights
    const aiInsights = generateAIInsights(analyticsDataForAI);
    
    const analytics = {
      url: {
        id: url.id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        title: url.title,
        createdAt: url.createdAt,
        domain: url.domain
      },
      metrics: {
        totalClicks,
        uniqueClicks,
        humanClicks,
        botClicks,
        conversions,
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      geographic: {
        topCountries,
        totalCountries: Object.keys(countryStats).length
      },
      devices: deviceStats,
      browsers: browserStats,
      sources: utmSourceStats,
      timeSeries,
      realtime: realtimeStats,
      aiInsights
    };

    return NextResponse.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: '获取分析数据时发生错误' },
      { status: 500 }
    );
  }
}
