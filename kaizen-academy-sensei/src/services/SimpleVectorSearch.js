import { OpenAI } from 'openai';

class SimpleVectorSearch {
  constructor() {
    // For browser environment, we'll need to pass the API key differently
    this.openai = new OpenAI({
      apiKey: window.OPENAI_API_KEY || 'your-openai-api-key-here',
      dangerouslyAllowBrowser: true
    });
    this.vectors = [];
  }

  async loadChunks() {
    try {
      const chunksPath = './src/data/extracted-chunks.json';
      const response = await fetch(chunksPath);
      const chunks = await response.json();
      
      console.log(`📚 Loading ${chunks.length} text chunks...`);
      return chunks;
    } catch (error) {
      console.error('Failed to load chunks:', error);
      return [];
    }
  }

  async getEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding failed:', error);
      return null;
    }
  }

  async cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async expandQuery(query) {
    try {
      const prompt = `Expand this question into 2-3 alternative phrasings. Return only the alternative phrasings, one per line.

Original: "${query}"

Alternatives:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3
      });

      return response.choices[0].message.content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.toLowerCase().includes('alternatives:'));
    } catch (error) {
      console.error('Query expansion failed:', error);
      return [query];
    }
  }

  async search(query, topK = 5) {
    const chunks = await this.loadChunks();
    if (chunks.length === 0) return [];

    // If vectors not loaded, build them
    if (this.vectors.length === 0) {
      console.log('🔧 Building vector embeddings...');
      for (const chunk of chunks) {
        const embedding = await this.getEmbedding(chunk.text);
        if (embedding) {
          this.vectors.push({
            id: chunk.id,
            text: chunk.text,
            embedding,
            metadata: {
              source: chunk.source,
              chunkIndex: chunk.chunkIndex,
              totalChunks: chunk.totalChunks
            }
          });
        }
        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      console.log(`✅ Built ${this.vectors.length} vector embeddings`);
    }

    // Expand query for better retrieval
    const expandedQueries = await this.expandQuery(query);
    console.log('🔍 Expanded queries:', expandedQueries);

    const allResults = [];
    
    // Get query embedding
    const queryEmbedding = await this.getEmbedding(query);
    if (!queryEmbedding) return [];

    // Calculate similarities
    for (const vector of this.vectors) {
      const similarity = await this.cosineSimilarity(queryEmbedding, vector.embedding);
      allResults.push({
        ...vector,
        distance: 1 - similarity, // Convert to distance for sorting
        query: query
      });
    }

    // Remove duplicates and sort by similarity
    const uniqueResults = this.deduplicateResults(allResults);
    const sortedResults = uniqueResults
      .sort((a, b) => a.distance - b.distance)
      .slice(0, topK);

    console.log(`📊 Found ${sortedResults.length} relevant results`);
    return sortedResults;
  }

  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = result.text.substring(0, 100);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async generateAnswer(query, context) {
    try {
      const contextText = context
        .map((result, index) => `[Source ${index + 1}: ${result.metadata.source}]\n${result.text}`)
        .join('\n\n');

      const prompt = `You are a traditional lean manufacturing sensei, wise and formal, teaching from Toyota Production System principles.

CONTEXT FROM LEAN LITERATURE:
${contextText}

STUDENT'S QUESTION: ${query}

INSTRUCTIONS:
- Answer using ONLY the provided context
- Even if the student uses different words than the source material, infer the meaning
- Synthesize information from multiple sources when helpful
- Be authoritative but humble
- Include specific Toyota principles or lean concepts when relevant
- If the context doesn't contain the answer, say "I cannot find information about that in the provided materials"

ANSWER:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      });

      return {
        answer: response.choices[0].message.content,
        sources: [...new Set(context.map(c => c.metadata.source))],
        contextUsed: context.length
      };
    } catch (error) {
      console.error('Answer generation failed:', error);
      return {
        answer: "I apologize, but I'm having trouble generating a response right now. Please try again.",
        sources: [],
        contextUsed: 0
      };
    }
  }
}

export default SimpleVectorSearch;
