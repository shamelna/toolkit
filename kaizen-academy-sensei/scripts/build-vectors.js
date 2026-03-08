import fs from 'fs';
import path from 'path';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import { OpenAI } from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

// Initialize ChromaDB
const client = new ChromaClient();
const embeddingFunction = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
});

async function buildVectorDatabase() {
  try {
    console.log('🚀 Building vector database...');
    
    // Load extracted chunks
    const chunksPath = path.join(process.cwd(), 'src', 'data', 'extracted-chunks.json');
    if (!fs.existsSync(chunksPath)) {
      console.error('❌ No extracted chunks found. Run "npm run extract" first.');
      return;
    }
    
    const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
    console.log(`📚 Processing ${chunks.length} text chunks...`);
    
    // Get or create collection
    let collection;
    try {
      collection = await client.getCollection({ name: 'kaizen-knowledge', embeddingFunction });
      console.log('📖 Using existing collection');
    } catch (error) {
      collection = await client.createCollection({
        name: 'kaizen-knowledge',
        embeddingFunction
      });
      console.log('🆕 Created new collection');
    }
    
    // Process chunks in batches to avoid rate limits
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      batches.push(chunks.slice(i, i + batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches...`);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`  Processing batch ${i + 1}/${batches.length} (${batch.length} chunks)`);
      
      const ids = batch.map(chunk => chunk.id);
      const documents = batch.map(chunk => chunk.text);
      const metadatas = batch.map(chunk => ({
        source: chunk.source,
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks
      }));
      
      try {
        await collection.add({
          ids,
          documents,
          metadatas
        });
        
        // Add delay to avoid rate limits
        if (i < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Error in batch ${i + 1}:`, error.message);
      }
    }
    
    console.log('✅ Vector database built successfully!');
    console.log(`📊 Collection contains ${chunks.length} embedded chunks`);
    
    // Test the database
    console.log('\n🧪 Testing vector search...');
    const testQuery = "What is lean manufacturing?";
    const results = await collection.query({
      queryTexts: [testQuery],
      nResults: 3
    });
    
    console.log('🔍 Test results for:', testQuery);
    results.documents[0].forEach((doc, index) => {
      console.log(`  ${index + 1}. ${doc.substring(0, 100)}...`);
      console.log(`     Source: ${results.metadatas[0][index].source}`);
    });
    
  } catch (error) {
    console.error('❌ Error building vector database:', error);
  }
}

// Run the script
buildVectorDatabase();
