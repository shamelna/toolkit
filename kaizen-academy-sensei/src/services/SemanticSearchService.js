import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import { OpenAI } from 'openai';

class SemanticSearchService {
  constructor() {
    this.client = new ChromaClient();
    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
    });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
    });
    this.collection = null;
  }

  async initialize() {
    try {
      this.collection = await this.client.getCollection({ 
        name: 'kaizen-knowledge', 
        embeddingFunction 
      });
      console.log('✅ Connected to vector database');
    } catch (error) {
      console.error('❌ Failed to connect to vector database:', error);
      throw error;
    }
  }

  async expandQuery(query) {
    try {
      const prompt = `Expand this question into 2-3 alternative phrasings to improve semantic search. Return only the alternative phrasings, one per line.

Original question: "${query}"

Alternative phrasings:`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.3
      });

      const expanded = response.choices[0].message.content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.toLowerCase().includes('alternative phrasings:'));
      
      return [query, ...expanded].slice(0, 3);
    } catch (error) {
      console.error('Query expansion failed:', error);
      return [query];
    }
  }

  async search(query, topK = 5) {
    if (!this.collection) {
      await this.initialize();
    }

    try {
      // Expand query for better retrieval
      const expandedQueries = await this.expandQuery(query);
      console.log('🔍 Expanded queries:', expandedQueries);

      const allResults = [];
      
      // Search with each query variation
      for (const expandedQuery of expandedQueries) {
        const results = await this.collection.query({
          queryTexts: [expandedQuery],
          nResults: topK
        });
        
        results.documents[0].forEach((doc, index) => {
          allResults.push({
            text: doc,
            metadata: results.metadatas[0][index],
            distance: results.distances[0][index],
            query: expandedQuery
          });
        });
      }

      // Remove duplicates and sort by distance
      const uniqueResults = this.deduplicateResults(allResults);
      const sortedResults = uniqueResults
        .sort((a, b) => a.distance - b.distance)
        .slice(0, topK);

      console.log(`📊 Found ${sortedResults.length} unique results`);
      return sortedResults;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  deduplicateResults(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = result.text.substring(0, 100); // First 100 chars as key
      if (seen.has(key)) {
        return false;
      }
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

export default SemanticSearchService;
