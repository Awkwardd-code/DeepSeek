import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Mutation to add a conversation
export const addConversation = mutation({
    args: {
        name: v.string(),
        userId: v.string(),
        messages: v.array(
            v.object({
                role: v.string(),
                content: v.string(),
                timestamp: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const id = await ctx.db.insert('conversations', {
            name: args.name,
            userId: args.userId,
            messages: args.messages,
        });

        return {
            _id: id,
            ...args, // Returning name, userId, and messages back
        };
    },
});

// Query to retrieve conversation by conversationId
export const getConversation = query({
    args: { conversationId: v.id('conversations') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.conversationId);
    },
});

// Mutation to update a conversation
export const updateConversation = mutation({
    args: {
      conversationId: v.id('conversations'), // conversation ID to identify the conversation
      messages: v.array( // an array of new messages to be added to the conversation
        v.object({
          role: v.string(),
          content: v.string(),
          timestamp: v.number(),
        })
      ),
    },
    handler: async (ctx, args) => {
      // Ensure the conversation exists
      const conversation = await ctx.db.get(args.conversationId);

      if (!conversation) {
        throw new Error(`Conversation not found for ID: ${args.conversationId}`);
      }

      // Update the conversation's messages with the new messages
      const updatedMessages = [...conversation.messages, ...args.messages];

      // Use patch to update the conversation document in the database
      await ctx.db.patch(args.conversationId, {
        messages: updatedMessages, // Append the new messages
      });

      return updatedMessages; // Return the updated messages as confirmation
    },
});

// Mutation to delete a conversation
export const deleteConversation = mutation({
    args: {
        conversationId: v.id('conversations'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.conversationId);
    },
});
