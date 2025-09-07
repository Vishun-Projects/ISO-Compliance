import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iso-compliance.com' },
    update: {},
    create: {
      email: 'admin@iso-compliance.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      department: 'IT',
      isActive: true
    }
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@iso-compliance.com' },
    update: {},
    create: {
      email: 'manager@iso-compliance.com',
      name: 'Compliance Manager',
      password: managerPassword,
      role: 'MANAGER',
      department: 'Compliance',
      isActive: true
    }
  });

  // Create employee user
  const employeePassword = await bcrypt.hash('employee123', 12);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@iso-compliance.com' },
    update: {},
    create: {
      email: 'employee@iso-compliance.com',
      name: 'John Employee',
      password: employeePassword,
      role: 'EMPLOYEE',
      department: 'Operations',
      isActive: true
    }
  });

  // Create auditor user
  const auditorPassword = await bcrypt.hash('auditor123', 12);
  const auditor = await prisma.user.upsert({
    where: { email: 'auditor@iso-compliance.com' },
    update: {},
    create: {
      email: 'auditor@iso-compliance.com',
      name: 'Internal Auditor',
      password: auditorPassword,
      role: 'AUDITOR',
      department: 'Audit',
      isActive: true
    }
  });

  // Create sample documents
  const document1 = await prisma.document.upsert({
    where: { id: 'doc-1' },
    update: {},
    create: {
      id: 'doc-1',
      title: 'Information Security Policy',
      description: 'Comprehensive information security policy for the organization',
      content: 'This document outlines the information security policies and procedures...',
      category: 'Policies',
      tags: JSON.stringify(['security', 'policy', 'ISO27001']),
      status: 'PUBLISHED',
      creatorId: admin.id,
      isPublic: true,
      publishedAt: new Date()
    }
  });

  const document2 = await prisma.document.upsert({
    where: { id: 'doc-2' },
    update: {},
    create: {
      id: 'doc-2',
      title: 'Risk Assessment Procedure',
      description: 'Standard procedure for conducting risk assessments',
      content: 'This procedure defines the methodology for identifying and assessing risks...',
      category: 'Procedures',
      tags: JSON.stringify(['risk', 'assessment', 'procedure']),
      status: 'REVIEW',
      creatorId: manager.id,
      assigneeId: employee.id,
      isPublic: false
    }
  });

  // Create sample document approvals
  await prisma.documentApproval.upsert({
    where: { id: 'approval-1' },
    update: {},
    create: {
      id: 'approval-1',
      documentId: document2.id,
      approverId: admin.id,
      status: 'PENDING',
      comments: 'Please review the risk assessment procedure'
    }
  });

  // Create sample audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: admin.id,
        userId: admin.id,
        details: JSON.stringify({ action: 'User account created' }),
        ipAddress: '127.0.0.1'
      },
      {
        action: 'DOCUMENT_CREATED',
        entityType: 'Document',
        entityId: document1.id,
        userId: admin.id,
        details: JSON.stringify({ action: 'Document created', title: document1.title }),
        ipAddress: '127.0.0.1'
      }
    ]
  });

  console.log('✅ Database seeding completed!');
  console.log('📋 Created users:');
  console.log(`   Admin: admin@iso-compliance.com / admin123`);
  console.log(`   Manager: manager@iso-compliance.com / manager123`);
  console.log(`   Employee: employee@iso-compliance.com / employee123`);
  console.log(`   Auditor: auditor@iso-compliance.com / auditor123`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
