import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

const CHUNK_SIZE = 500; // tokens
const CHUNK_OVERLAP = 50; // tokens

async function extractPDFs() {
  const docsDir = path.join(process.cwd(), 'docs');
  const outputDir = path.join(process.cwd(), 'src', 'data');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfFiles = fs.readdirSync(docsDir).filter(file => file.endsWith('.pdf'));
  const allChunks = [];

  console.log(`Found ${pdfFiles.length} PDF files to process...`);

  for (const pdfFile of pdfFiles) {
    console.log(`Processing: ${pdfFile}`);
    const filePath = path.join(docsDir, pdfFile);
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
      const data = await pdf(dataBuffer);
      const text = data.text;
      
      // Split into chunks with overlap
      const chunks = createChunks(text, CHUNK_SIZE, CHUNK_OVERLAP);
      
      chunks.forEach((chunk, index) => {
        allChunks.push({
          id: `${pdfFile.replace('.pdf', '')}_chunk_${index}`,
          text: chunk,
          source: pdfFile,
          chunkIndex: index,
          totalChunks: chunks.length
        });
      });
      
      console.log(`  Extracted ${chunks.length} chunks from ${pdfFile}`);
    } catch (error) {
      console.error(`Error processing ${pdfFile}:`, error);
    }
  }

  // Save chunks to JSON
  const outputPath = path.join(outputDir, 'extracted-chunks.json');
  fs.writeFileSync(outputPath, JSON.stringify(allChunks, null, 2));
  
  console.log(`\n✅ Extracted ${allChunks.length} total chunks`);
  console.log(`📁 Saved to: ${outputPath}`);
  
  return allChunks;
}

function createChunks(text, chunkSize, overlap) {
  const words = text.split(/\s+/);
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim()) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

// Run extraction
extractPDFs().catch(console.error);
