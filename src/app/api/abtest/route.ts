import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

type ABTestWithClicks = Prisma.ABTestGetPayload<{
  include: { clicks: true }
}>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlId, name, description, variants, trafficSplit } = body;

    // Validate input
    if (!urlId || !name || !variants || !trafficSplit) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // Validate that traffic split adds up to 1.0
    const totalSplit = Object.values(trafficSplit as Record<string, number>).reduce((sum, split) => sum + split, 0);
    if (Math.abs(totalSplit - 1.0) > 0.01) {
      return NextResponse.json(
        { error: '流量分配必须总计为100%' },
        { status: 400 }
      );
    }

    // Check if URL exists
    const url = await db.url.findUnique({
      where: { id: urlId }
    });

    if (!url) {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }

    // Create A/B test
    const abTest = await db.aBTest.create({
      data: {
        name,
        description,
        urlId,
        variants: JSON.stringify(variants),
        trafficSplit: JSON.stringify(trafficSplit),
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: abTest.id,
        name: abTest.name,
        description: abTest.description,
        variants,
        trafficSplit,
        createdAt: abTest.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating A/B test:', error);
    return NextResponse.json(
      { error: '创建A/B测试失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urlId = searchParams.get('urlId');

    if (!urlId) {
      return NextResponse.json(
        { error: '缺少URL ID' },
        { status: 400 }
      );
    }

    // Get all A/B tests for this URL
    const abTests = await db.aBTest.findMany({
      where: { urlId },
      include: {
        clicks: {
          select: {
            variant: true,
            converted: true,
            timestamp: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const testsWithStats = abTests.map((test: { id: string, name: string, description: string | null, isActive: boolean, winnerVariant: string | null, startDate: Date, endDate: Date | null, variants: string, trafficSplit: string, createdAt: Date, clicks: { variant: string | null, converted: boolean }[] }) => {
      const variants = JSON.parse(test.variants);
      const trafficSplit = JSON.parse(test.trafficSplit);

      // Calculate stats for each variant
      const variantStats = variants.map((variant: { name: string; url: string }) => {
        const variantClicks = test.clicks.filter(click => click.variant === variant.name);
        const conversions = variantClicks.filter(click => click.converted);

        return {
          name: variant.name,
          url: variant.url,
          clicks: variantClicks.length,
          conversions: conversions.length,
          conversionRate: variantClicks.length > 0 ?
            (conversions.length / variantClicks.length) * 100 : 0,
          trafficAllocation: trafficSplit[variant.name] * 100
        };
      });

      return {
        id: test.id,
        name: test.name,
        description: test.description,
        isActive: test.isActive,
        winnerVariant: test.winnerVariant,
        startDate: test.startDate,
        endDate: test.endDate,
        variants: variantStats,
        totalClicks: test.clicks.length,
        createdAt: test.createdAt
      };
    });

    return NextResponse.json({
      success: true,
      data: testsWithStats
    });

  } catch (error) {
    console.error('Error fetching A/B tests:', error);
    return NextResponse.json(
      { error: '获取A/B测试数据失败' },
      { status: 500 }
    );
  }
}
