import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/user/preferences - Get user preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, return default preferences since we don't have a preferences table yet
    // In the future, this would fetch from a UserPreferences table
    const preferences = {
      emailNotifications: true,
      pushNotifications: false,
      theme: 'light',
      language: 'en',
      documentUpdates: true,
      auditReminders: true,
      complianceAlerts: true,
      weeklyReports: false
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user preferences' },
      { status: 500 }
    );
  }
}

// PUT /api/user/preferences - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await request.json();

    // Log the preferences update
    await prisma.auditLog.create({
      data: {
        action: 'PREFERENCES_UPDATE',
        entityType: 'USER',
        entityId: session.user.id,
        userId: session.user.id,
        details: JSON.stringify(preferences),
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // In the future, this would save to a UserPreferences table
    // For now, just return success
    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      preferences 
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update user preferences' },
      { status: 500 }
    );
  }
}
