import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, events, userId, secret } = body;

    // Validate input
    if (!name || !url || !events || !userId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: '无效的Webhook URL' },
        { status: 400 }
      );
    }

    // Generate secret if not provided
    const webhookSecret = secret || crypto.randomBytes(32).toString('hex');

    // Create webhook
    const webhook = await db.webhook.create({
      data: {
        name,
        url,
        events: JSON.stringify(events),
        userId,
        secret: webhookSecret,
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events,
        secret: webhookSecret,
        isActive: webhook.isActive,
        createdAt: webhook.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: '创建Webhook失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '缺少用户ID' },
        { status: 400 }
      );
    }

    const webhooks = await db.webhook.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const webhooksData = webhooks.map(webhook => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: JSON.parse(webhook.events as string),
      isActive: webhook.isActive,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: webhooksData
    });

  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      { error: '获取Webhook列表失败' },
      { status: 500 }
    );
  }
}

// Helper function to send webhook notifications
export async function sendWebhookNotification(
  webhook: any,
  eventType: string,
  payload: any
) {
  try {
    const events = JSON.parse(webhook.events);

    // Check if this webhook listens for this event type
    if (!events.includes(eventType)) {
      return;
    }

    const webhookPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: payload
    };

    // Create signature if secret is provided
    let signature = '';
    if (webhook.secret) {
      const hmac = crypto.createHmac('sha256', webhook.secret);
      hmac.update(JSON.stringify(webhookPayload));
      signature = `sha256=${hmac.digest('hex')}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'AI-TinyURL-Webhook/1.0',
    };

    if (signature) {
      headers['X-TinyURL-Signature'] = signature;
    }

    // Send webhook
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(webhookPayload),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      console.error(`Webhook delivery failed: ${response.status} ${response.statusText}`);
    }

    return response.ok;

  } catch (error) {
    console.error('Error sending webhook:', error);
    return false;
  }
}
