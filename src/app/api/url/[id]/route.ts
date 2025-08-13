import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const url = await db.url.findUnique({
      where: { id },
      include: {
        clicks: {
          select: {
            id: true,
            timestamp: true,
            country: true,
            device: true,
            browser: true,
            isBot: true,
            converted: true
          },
          orderBy: { timestamp: 'desc' },
          take: 100
        },
        abTests: {
          include: {
            clicks: true
          }
        }
      }
    });

    if (!url) {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }

    // Don't expose password in response
    const { password, ...urlData } = url;

    return NextResponse.json({
      success: true,
      data: {
        ...urlData,
        hasPassword: !!password,
        clickCount: url.clicks.length,
        recentClicks: url.clicks.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Error fetching URL:', error);
    return NextResponse.json(
      { error: '获取链接信息失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const {
      originalUrl,
      title,
      description,
      password,
      maxClicks,
      expiresAt,
      geoRules,
      deviceRules,
      timeRules,
      metaTitle,
      metaDesc,
      isActive
    } = body;

    // Find existing URL
    const existingUrl = await db.url.findUnique({
      where: { id }
    });

    if (!existingUrl) {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    if (originalUrl !== undefined) updateData.originalUrl = originalUrl;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (maxClicks !== undefined) updateData.maxClicks = maxClicks;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle password
    if (password !== undefined) {
      if (password === '') {
        updateData.password = null; // Remove password
      } else {
        updateData.password = await bcrypt.hash(password, 10);
      }
    }

    // Handle expiration
    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    // Handle smart redirect rules
    if (geoRules !== undefined) {
      updateData.geoRules = geoRules ? JSON.stringify(geoRules) : null;
    }
    if (deviceRules !== undefined) {
      updateData.deviceRules = deviceRules ? JSON.stringify(deviceRules) : null;
    }
    if (timeRules !== undefined) {
      updateData.timeRules = timeRules ? JSON.stringify(timeRules) : null;
    }

    // Update URL
    const updatedUrl = await db.url.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    // Don't expose password in response
    const { password: _, ...responseData } = updatedUrl;

    return NextResponse.json({
      success: true,
      data: {
        ...responseData,
        hasPassword: !!updatedUrl.password
      }
    });

  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json(
      { error: '更新链接失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Find URL
    const url = await db.url.findUnique({
      where: { id }
    });

    if (!url) {
      return NextResponse.json(
        { error: '链接不存在' },
        { status: 404 }
      );
    }

    // Soft delete - mark as archived instead of actual deletion
    // This preserves analytics data
    await db.url.update({
      where: { id },
      data: {
        isArchived: true,
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: '链接已归档'
    });

  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: '删除链接失败' },
      { status: 500 }
    );
  }
}

// Helper function to validate password
export async function validatePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    return false;
  }
}
