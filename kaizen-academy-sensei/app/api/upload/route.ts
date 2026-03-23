import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { chunkText } from '@/lib/search';

// Simple admin auth check
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return authHeader === `Bearer ${adminPassword}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name;
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : 'markdown';
    const docId = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Upload file to Firebase Storage
    const bucket = adminStorage.bucket();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storageRef = bucket.file(`documents/${docId}/${fileName}`);
    await storageRef.save(fileBuffer, {
      metadata: { contentType: file.type || 'application/octet-stream' },
    });
    const [downloadURL] = await storageRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    // Extract text content
    let textContent = '';
    if (fileType === 'pdf') {
      // Dynamic import to avoid SSR issues
      const pdfParse = (await import('pdf-parse')).default;
      const parsed = await pdfParse(fileBuffer);
      textContent = parsed.text;
    } else {
      textContent = fileBuffer.toString('utf-8');
    }

    // Store document metadata
    const docName = title || fileName.replace(/\.[^/.]+$/, '');
    await adminDb.collection('documents').doc(docId).set({
      id: docId,
      name: docName,
      fileName,
      fileType,
      downloadURL,
      charCount: textContent.length,
      createdAt: new Date(),
      status: 'indexed',
    });

    // Chunk and index the text
    const chunks = chunkText(textContent, 800, 100);
    const batch = adminDb.batch();

    chunks.forEach((chunk, index) => {
      const chunkRef = adminDb.collection('document_chunks').doc(
        `${docId}_chunk_${index}`
      );
      batch.set(chunkRef, {
        docId,
        docName,
        content: chunk,
        chunkIndex: index,
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      docId,
      name: docName,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
