import { adminDb } from './firebase-admin';

export interface DocumentChunk {
  id: string;
  docId: string;
  docName: string;
  content: string;
  chunkIndex: number;
  createdAt: Date;
}

// Simple keyword-based search across indexed chunks
export async function searchDocuments(query: string, maxResults = 6): Promise<DocumentChunk[]> {
  try {
    const chunksRef = adminDb.collection('document_chunks');
    const snapshot = await chunksRef.orderBy('createdAt', 'desc').limit(500).get();

    if (snapshot.empty) return [];

    const queryWords = query.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
      .filter(w => !['what', 'when', 'where', 'which', 'that', 'this', 'with', 'from', 'have', 'will', 'your', 'about'].includes(w));

    const scored: Array<{ chunk: DocumentChunk; score: number }> = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const content = (data.content || '').toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        const regex = new RegExp(word, 'gi');
        const matches = content.match(regex);
        if (matches) score += matches.length;
      }
      if (score > 0) {
        scored.push({
          chunk: {
            id: doc.id,
            docId: data.docId,
            docName: data.docName,
            content: data.content,
            chunkIndex: data.chunkIndex,
            createdAt: data.createdAt?.toDate(),
          },
          score,
        });
      }
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(s => s.chunk);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Split text into overlapping chunks for better retrieval
export function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start += chunkSize - overlap;
  }
  return chunks.filter(c => c.length > 50);
}
