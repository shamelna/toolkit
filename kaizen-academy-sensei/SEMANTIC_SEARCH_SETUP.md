# Kaizen Academy Sensei - Semantic Search Setup

## 🚀 Quick Start Guide

### 1. Setup OpenAI API Key
1. Get your free API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your API key to `.env` file:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 2. Extract PDF Content
```bash
npm run extract
```
This processes all PDFs in `/docs` folder and creates text chunks with overlap.

### 3. Build Vector Database
```bash
npm run build-vectors
```
Creates semantic embeddings and stores them in ChromaDB for fast retrieval.

### 4. Start Development Server
```bash
npm run dev
```
Opens at http://localhost:3001

## 🧠 How Semantic Search Works

### Vector Embeddings
- Text chunks converted to 1536-dimensional vectors
- Captures semantic meaning, not just keywords
- Enables "What is lean?" to find "lean manufacturing"

### Query Expansion
- Automatically rephrases your question 2-3 ways
- Improves retrieval chances
- Handles synonyms and different phrasings

### Context-Aware Answers
- Retrieves top 5 most relevant chunks
- Passes to GPT-3.5-turbo with instruction
- Generates answers even if you use different words

## 📁 File Structure
```
kaizen-academy-sensei/
├── docs/                    # Your PDF files
├── src/
│   ├── components/
│   │   ├── KaizenSenseiNew.tsx    # Main component with semantic search
│   │   ├── KaizenHeader.tsx
│   │   └── KaizenFooter.tsx
│   ├── services/
│   │   └── SemanticSearchService.js  # Vector search logic
│   └── data/
│       └── extracted-chunks.json     # Processed PDF content
├── scripts/
│   ├── extract-pdf.js         # PDF processing
│   └── build-vectors.js       # Vector database creation
└── .env                     # Your API keys (not in git)
```

## 🎯 Example Questions to Test

Try these to see semantic search in action:

- "What is lean manufacturing?" 
- "Tell me about Toyota production system"
- "How do I eliminate waste?"
- "What's the difference between JIT and continuous flow?"
- "Explain kaizen events"

Each will find relevant content even if the exact words aren't in the PDFs!

## 🔧 Troubleshooting

### API Key Issues
- Ensure `.env` file is in project root
- Check API key has sufficient credits
- Verify no extra spaces in key

### Vector Database Issues
- Run `npm run extract` first
- Ensure ChromaDB can create collection
- Check console for error messages

### Search Not Working
- Verify vector database built successfully
- Check browser console for errors
- Ensure API key is valid

## 📊 Performance

- **Chunk Size**: 500 tokens with 50 token overlap
- **Retrieval**: Top 5 semantic matches
- **Response Time**: ~2-3 seconds per question
- **Accuracy**: Handles synonyms and context

## 🆕 Future Enhancements

- [ ] Local embedding models (no API needed)
- [ ] Multiple vector databases support
- [ ] Advanced RAG with citation tracking
- [ ] Conversation context memory
