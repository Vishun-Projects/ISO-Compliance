import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, hasPermission } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/audit - Get audit logs with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    if (!hasPermission(session.user.role, 'AUDIT_VIEW')) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');
    const summary = searchParams.get('summary');

    // If summary is requested, return summary statistics
    if (summary === 'true') {
      const [
        totalLogs,
        todayLogs,
        thisWeekLogs,
        thisMonthLogs,
        actionBreakdown,
        userBreakdown,
        entityTypeBreakdown,
      ] = await Promise.all([
        // Total logs
        prisma.auditLog.count(),
        
        // Today's logs
        prisma.auditLog.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        
        // This week's logs
        prisma.auditLog.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 7)),
            },
          },
        }),
        
        // This month's logs
        prisma.auditLog.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
        
        // Action breakdown
        prisma.auditLog.groupBy({
          by: ['action'],
          _count: {
            action: true,
          },
          orderBy: {
            _count: {
              action: 'desc',
            },
          },
          take: 10,
        }),
        
        // User breakdown
        prisma.auditLog.groupBy({
          by: ['userId'],
          _count: {
            userId: true,
          },
          orderBy: {
            _count: {
              userId: 'desc',
            },
          },
          take: 10,
        }),
        
        // Entity type breakdown
        prisma.auditLog.groupBy({
          by: ['entityType'],
          _count: {
            entityType: true,
          },
          orderBy: {
            _count: {
              entityType: 'desc',
            },
          },
          take: 10,
        }),
      ]);

      return NextResponse.json({
        summary: {
          totalLogs,
          todayLogs,
          thisWeekLogs,
          thisMonthLogs,
          actionBreakdown,
          userBreakdown,
          entityTypeBreakdown,
        },
      });
    }

    const where: any = {};

    if (action) {
      where.action = action;
    }

    if (entityType) {
      where.entityType = entityType;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.auditLog.count({ where });

    // Get audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      auditLogs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

// POST /api/audit - Create new audit log
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, entityType, entityId, details, ipAddress, userAgent } = await request.json();

    if (!action || !entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, entityType, entityId' },
        { status: 400 }
      );
    }

    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        userId: session.user.id,
        details: details ? JSON.stringify(details) : null,
        ipAddress: ipAddress || request.ip || 'unknown',
        userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(auditLog, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
