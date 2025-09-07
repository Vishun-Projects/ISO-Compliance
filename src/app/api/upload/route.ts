import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/upload';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const documentId = formData.get('documentId') as string;
    const files = formData.getAll('files') as File[];

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Validate document exists and user has access
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { creator: true }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check permissions (creator or admin can upload)
    if (document.creatorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Max size is ${MAX_FILE_SIZE} bytes` },
          { status: 400 }
        );
      }

      try {
        const uploadedFile = await uploadFile(file, session.user.id, documentId);
        uploadedFiles.push(uploadedFile);

        // Update document with file information
        await prisma.document.update({
          where: { id: documentId },
          data: {
            fileUrl: uploadedFile.url,
            fileName: uploadedFile.originalName,
            fileSize: uploadedFile.size,
            mimeType: uploadedFile.mimeType,
          }
        });

        // Create audit log
        await prisma.auditLog.create({
          data: {
            action: 'FILE_UPLOAD',
            entityType: 'Document',
            entityId: documentId,
            userId: session.user.id,
            details: {
              fileName: uploadedFile.originalName,
              fileSize: uploadedFile.size,
              fileType: uploadedFile.mimeType,
            }
          }
        });

      } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
          { error: `Failed to upload ${file.name}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const filename = searchParams.get('filename');

    if (!documentId || !filename) {
      return NextResponse.json({ error: 'Document ID and filename are required' }, { status: 400 });
    }

    // Check permissions
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.creatorId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Remove file from document
    await prisma.document.update({
      where: { id: documentId },
      data: {
        fileUrl: null,
        fileName: null,
        fileSize: null,
        mimeType: null,
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'FILE_DELETE',
        entityType: 'Document',
        entityId: documentId,
        userId: session.user.id,
        details: {
          fileName: filename,
        }
      }
    });

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('File delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
