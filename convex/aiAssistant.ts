import { action } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';
import OpenAI from 'openai';

// Export the action
export const getAIResponse = action({
  args: {
    conversationId: v.id('conversations'),
    userMessage: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    // --- Environment Variable Check ---
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY environment variable is missing');
    }
    

    // --- Initialize OpenAI Client ---
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
      timeout: 30_000, // 30-second timeout
    });

    // --- Conversation Validation ---
    const conversation = await ctx.runQuery(api.conversations.getConversation, {
      conversationId: args.conversationId,
    });

    if (!conversation) {
      throw new Error(`Conversation ${args.conversationId} not found`);
    }

    // --- Message Construction ---
    const validatedMessages = conversation.messages.map(msg => {
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        throw new Error(`Invalid message role: ${msg.role}`);
      }
      return {
        role: msg.role as 'user' | 'assistant' | 'system',
        content: String(msg.content).slice(0, 5000), // Limit message length
      };
    });

    const messages = [
      { role: 'system' as const, content: 'You are a helpful assistant.' },
      ...validatedMessages,
      { role: 'user' as const, content: args.userMessage.slice(0, 5000) },
    ];

    // --- AI API Call ---
    try {
      const startTime = Date.now();
      const completion = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 1000, // Limit response length
      });

      console.log(`AI call took ${Date.now() - startTime}ms`);

      if (!completion.choices?.[0]?.message?.content) {
        throw new Error('Empty response from AI');
      }

      const assistantReply = completion.choices[0].message.content;

      // --- Conversation Update ---
      await ctx.runMutation(api.conversations.updateConversation, {
        conversationId: args.conversationId,
        messages: [
          { 
            role: 'user', 
            content: args.userMessage, 
            timestamp: Date.now() 
          },
          { 
            role: 'assistant', 
            content: assistantReply,
            timestamp: Date.now() 
          },
        ],
      });

      return assistantReply;

    } catch (error) {
      console.error('AI request failed:', error);
      throw new Error(
        error instanceof Error 
          ? `AI service error: ${error.message}` 
          : 'Unknown error during AI processing'
      );
    }
  },
});
