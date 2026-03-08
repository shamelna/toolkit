# Guide for Adding New Resources to Kaizen Academy Sensei

This guide explains how to add new ebook formats to expand the Sensei's knowledge base.

## Supported Formats

### Currently Supported
- **PDF** (Recommended) - Full text extraction with page numbers
- **TXT** - Plain text files
- **MD** - Markdown files

### Planned Support
- **EPUB** - Standard ebook format
- **MOBI** - Kindle format
- **AZW3** - Amazon Kindle format
- **DOCX** - Microsoft Word documents

## How to Add Resources

### Method 1: Manual Addition (Current)
1. **Place files** in `/docs` folder
2. **Update knowledge base** manually in `src/components/KaizenSensei.tsx`
3. **Restart** the application

### Method 2: Automated Addition (Coming Soon)
1. **Place files** in `/docs` folder
2. **Run extraction script**: `npm run extract-content`
3. **Automatic knowledge base update**

## Manual Knowledge Base Addition

In `src/components/KaizenSensei.tsx`, find the `knowledgeBase` object and add new entries:

```typescript
const knowledgeBase: KnowledgeBase = {
  // Existing entries...
  
  new_topic: {
    content: "Your extracted content here...",
    principle: "Associated Principle",
    source: "Book Title - Author",
    page: "Page Number",
    category: 'tps' | 'tools' | 'kaizen'
  }
};
```

## Content Extraction Guidelines

### Best Practices
- **Extract key concepts** not entire chapters
- **Include page numbers** for citation
- **Associate with principles** (Elimination of Waste, Flow, etc.)
- **Categorize properly**: 
  - `tps`: Toyota Production System fundamentals
  - `tools`: Implementation tools and methods
  - `kaizen`: Continuous improvement approaches

### Quality Standards
- **Accuracy**: Content must match source exactly
- **Attribution**: Always cite source and page
- **Relevance**: Focus on actionable lean concepts
- **Clarity**: Use simple, direct language

## File Organization

```
kaizen-academy-sensei/
├── docs/                    # Add new PDFs here
│   ├── new-book.pdf
│   ├── another-book.epub (future)
│   └── notes.md
├── src/
│   ├── components/
│   │   └── KaizenSensei.tsx    # Update knowledge base here
│   └── data/
│       └── extracted-content.json  # Future auto-extraction
└── scripts/
    └── extract-content.js          # Future automation
```

## Future Automation Features

### Planned Enhancements
- **PDF text extraction** with page detection
- **EPUB/MOBI parsing** for ebook support
- **Semantic search** beyond keyword matching
- **Dynamic knowledge base** updates without code changes
- **Content validation** and quality checking
- **Duplicate detection** across sources

### Extraction Script Commands
```bash
npm run extract:pdf     # Extract PDF content
npm run extract:epub    # Extract EPUB content (future)
npm run extract:all      # Extract all supported formats
npm run validate:content # Validate extracted content
```

## Contributing Guidelines

When adding new resources:
1. **Verify quality** of source material
2. **Extract systematically** using the guidelines
3. **Test thoroughly** with sample questions
4. **Update documentation** with new topics
5. **Commit changes** with descriptive messages

## Example Addition

Adding content from "Lean Thinking" by James Womack:

```typescript
lean_thinking: {
  content: "Lean thinking is about creating more value with fewer resources. It focuses on eliminating waste, improving flow, and respecting people. The five principles of lean thinking: Specify value, identify value stream, make value flow, pull from customer, and pursue perfection.",
  principle: "Value Creation",
  source: "Lean Thinking - James Womack",
  page: "Page 15",
  category: 'tps'
}
```

---

*Remember: The Sensei's wisdom comes from the quality and accuracy of the provided knowledge base. Always maintain high standards when adding new resources.*
