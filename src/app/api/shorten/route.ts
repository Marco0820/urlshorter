import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateShortCode, parseUTMParams } from '@/lib/analytics';
import validator from 'validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, customAlias, domain = 'urltiny.cc', password, maxClicks, expiresAt } = body;

    // Validate URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return NextResponse.json(
        { error: '请提供有效的URL' },
        { status: 400 }
      );
    }

    if (customAlias && customAlias.length < 5) {
      return NextResponse.json(
        { error: 'The Alias must be at least 5 characters.' },
        { status: 400 }
      );
    }

    // Generate a short code
    let shortCode = generateShortCode(customAlias);
    let attempts = 0;
    const maxAttempts = 5;

    // Check for collision and retry if necessary
    while (await db.url.findUnique({ where: { shortCode } })) {
      if (customAlias) {
        return NextResponse.json(
          { error: 'This custom alias is already in use.' },
          { status: 409 } // 409 Conflict is more appropriate here
        );
      }
      
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'Failed to generate a unique short code. Please try again.' },
          { status: 500 }
        );
      }
      
      shortCode = generateShortCode(); // Generate a new random code
      attempts++;
    }

    // The metadata fetching is moved to a background job to improve performance
    // let title: string | undefined;
    // let description: string | undefined;
    // try {
    //   const response = await fetch(originalUrl, {
    //     method: 'HEAD',
    //     headers: { 'User-Agent': 'AI-TinyURL-Bot/1.0' }
    //   });
    //   // In a real app, you'd parse the HTML to extract title and description
    //   title = new URL(originalUrl).hostname;
    // } catch (error) {
    //   console.log('Failed to fetch metadata:', error);
    // }

    // Parse UTM parameters
    const utmParams = parseUTMParams(originalUrl);

    // Create URL in database
    const shortUrl = await db.url.create({
      data: {
        shortCode,
        originalUrl,
        // title,
        // description,
        customAlias,
        domain,
        password,
        maxClicks,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        utmSource: utmParams.source,
        utmMedium: utmParams.medium,
        utmCampaign: utmParams.campaign,
      }
    });

    // AI-powered initial analysis
    const aiInsights = [
      "🎯 短链已创建，AI系统将开始实时分析点击数据",
      "📊 建议启用A/B测试来优化转化率",
      "🔒 考虑设置密码保护重要链接"
    ];

    return NextResponse.json({
      success: true,
      data: {
        id: shortUrl.id,
        shortCode: shortUrl.shortCode,
        shortUrl: `https://${domain}/${shortUrl.shortCode}`,
        originalUrl: shortUrl.originalUrl,
        title: shortUrl.title,
        createdAt: shortUrl.createdAt,
        aiInsights
      }
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: '创建短链时发生错误' },
      { status: 500 }
    );
  }
}
