import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);

/**
 * Generate a unique short code.
 * If a custom alias is provided, it will be sanitized and used.
 * Otherwise, a random 8-character code will be generated.
 */
export function generateShortCode(customAlias?: string): string {
  if (customAlias) {
    // Sanitize custom alias: lowercase, remove special chars except hyphen and underscore
    return customAlias.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  }
  // Generate a random 8-character code
  return nanoid();
}

/**
 * Generate AI insights for URL performance
 */
export function generateAIInsights(analytics: any): string[] {
  const insights: string[] = [];

  // Click patterns
  if (analytics.totalClicks > 1000) {
    insights.push("🚀 您的链接表现出色！点击量已超过1000次");
  }

  // Geographic patterns
  if (analytics.topCountries?.length > 10) {
    insights.push("🌍 您的链接在全球范围内都有很好的覆盖");
  }

  // Device insights
  const mobileRatio = analytics.devices?.mobile / analytics.totalClicks;
  if (mobileRatio > 0.7) {
    insights.push("📱 大部分访问来自移动设备，确保目标页面移动端友好");
  }

  // Time patterns
  const hourlyCounts = analytics.clicksByHour?.map((h: any) => h.clicks);
  const peakHour = hourlyCounts?.indexOf(Math.max(...hourlyCounts));
  if (peakHour) {
    insights.push(`📈 流量高峰出现在 ${peakHour}:00-${peakHour+1}:00`);
  }

  // Referer insights
  if (analytics.topReferers?.[0]?.referer === 'Direct') {
    insights.push("🎯 很多流量来自直接访问，说明您的品牌知名度很高");
  }

  // New vs Returning Users
  const returningUserRatio = analytics.returningUsers / analytics.totalClicks;
  if (returningUserRatio > 0.3) {
    insights.push("👥 您的链接吸引了大量回头客");
  }

  if (insights.length === 0) {
    insights.push("📊 数据量不足，暂无足够信息生成洞察");
  }

  return insights;
}

/**
 * Parse UTM parameters from a URL
 */
export function parseUTMParams(url: string) {
  try {
    const urlObj = new URL(url);
    const utmParams = urlObj.searchParams;
    return {
      source: utmParams.get('utm_source') || '',
      medium: utmParams.get('utm_medium') || '',
      campaign: utmParams.get('utm_campaign') || '',
      term: utmParams.get('utm_term') || '',
      content: utmParams.get('utm_content') || '',
    };
  } catch (error) {
    console.error('Invalid URL for UTM parsing:', error);
    return {
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    };
  }
}
