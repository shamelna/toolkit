import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return authHeader === `Bearer ${adminPassword}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb
      .collection('documents')
      .orderBy('createdAt', 'desc')
      .get();

    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString(),
    }));

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('List documents error:', error);
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { docId } = await req.json();
    if (!docId) return NextResponse.json({ error: 'No docId' }, { status: 400 });

    // Delete document metadata
    await adminDb.collection('documents').doc(docId).delete();

    // Delete all chunks
    const chunksSnapshot = await adminDb
      .collection('document_chunks')
      .where('docId', '==', docId)
      .get();
    const batch = adminDb.batch();
    chunksSnapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    // Delete from storage
    try {
      const bucket = adminStorage.bucket();
      await bucket.deleteFiles({ prefix: `documents/${docId}/` });
    } catch (storageError) {
      console.warn('Storage deletion failed (non-critical):', storageError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
