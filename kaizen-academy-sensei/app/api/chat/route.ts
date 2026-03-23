import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchDocuments } from '@/lib/search';
import { SENSEI_SYSTEM_PROMPT } from '@/lib/sensei-prompt';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
    }

    // Get the latest user message for context retrieval
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    const query = lastUserMessage?.content || '';

    // Search knowledge base
    const relevantChunks = await searchDocuments(query, 5);
    
    // Build context from retrieved chunks
    let contextBlock = '';
    if (relevantChunks.length > 0) {
      contextBlock = `\n\n## Relevant Knowledge Base Content\nThe following excerpts from uploaded documents may be relevant to this question:\n\n`;
      relevantChunks.forEach((chunk, i) => {
        contextBlock += `### From: ${chunk.docName}\n${chunk.content}\n\n`;
      });
    }

    // Build system prompt with context
    const systemWithContext = SENSEI_SYSTEM_PROMPT + contextBlock;

    // Stream the response
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: systemWithContext,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    // Return as streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
  }
}
