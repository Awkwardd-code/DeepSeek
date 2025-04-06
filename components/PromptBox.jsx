import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Assuming you're using Clerk
import { useAction, useMutation } from 'convex/react'; // Correct import for useMutation and useAction
import { api } from '@/convex/_generated/api';

function PromptBox({ isLoading, setIsLoading }) {
  const { user, isLoaded } = useUser(); // Fetch the user from Clerk
  const [prompt, setPrompt] = useState('');
  const addConversation = useMutation(api.conversations.addConversation); // Use useMutation for database operations
  const getAIResponse = useAction(api.aiAssistant.getAIResponse); // Use useAction for server-side actions like AI responses

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the prompt is empty
    if (!prompt.trim()) return;

    // Make sure the user is authenticated before proceeding
    if (!isLoaded || !user) {
      console.error('User is not authenticated');
      return; // Prevent submitting if the user is not authenticated
    }

    setIsLoading(true);

    try {
      // Step 1: Save user message to the database first (conversation creation if needed)
      const messages = [
        {
          role: 'user', // Role of the user
          content: prompt, // The content of the user's prompt
          timestamp: Date.now(),
        },
      ];

      // Call the mutation to add the conversation (first time user submits a message)
      const conversation = await addConversation({
        name: 'User Chat',
        userId: user.id,
        messages,
      });
      console.log('Created conversation:', conversation);
      // Step 2: Ensure conversationId is passed properly
      if (!conversation || !conversation._id) {
        throw new Error('Conversation ID is missing.');
      }

      // Step 3: Get the AI response by calling the AI response action
      const aiResponse = await getAIResponse({
        conversationId: conversation._id, // Pass the conversation ID here
        userMessage: prompt, // Pass the user's message
      });

      // Step 4: Update the conversation with the assistant's reply
      await addConversation({
        name: conversation.name,
        userId: conversation.userId,
        messages: [
          ...conversation.messages,
          { role: 'user', content: prompt, timestamp: Date.now() },
          { role: 'assistant', content: aiResponse, timestamp: Date.now() },
        ],
      });

      // Handle success
      console.log('Conversation saved and AI replied:', aiResponse);

      // Reset the prompt input after submitting
      setPrompt('');
    } catch (error) {
      console.error('Error handling conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    // Optional: Handle loading state if the user data isn't loaded yet
    return <div>Loading...</div>;
  }

  return (
    <form
      className={`w-full ${false ? 'max-w-3xl' : 'max-w-2xl'} bg-[#404045] p-4 rounded-3xl mt-4 transition-all duration-200`}
      onSubmit={handleSubmit} // Handle the form submission
    >
      <textarea
        className="outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white placeholder-gray-400"
        rows={2}
        placeholder="Message DeepSeek"
        required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)} // Update the prompt state on input change
      />
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-wrap gap-2">
          {/* DeepThink Pill */}
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-colors duration-200">
            <Image
              src={assets.deepthink_icon}
              alt="DeepThink"
              width={20}
              height={20}
              className="h-5 w-auto"
            />
            <span>DeepThink (R1)</span>
          </p>

          {/* Search Pill */}
          <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition-colors duration-200">
            <Image
              src={assets.search_icon}
              alt="Search"
              width={20}
              height={20}
              className="h-5 w-auto"
            />
            <span>Search</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Standalone Pinned Icon */}
          <Image
            src={assets.pin_icon}
            alt="Pinned"
            width={16}
            height={16}
            className="w-4 h-auto cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          />

          {/* Pinned Button */}
          <button
            aria-label="Pin item"
            className={`${prompt ? 'bg-blue-600' : 'bg-[#71717a]'} rounded-full p-2 cursor-pointer`}
          >
            <Image
              className="w-3.5 aspect-square"
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt={prompt ? 'Active arrow' : 'Inactive arrow'}
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>
    </form>
  );
}

export default PromptBox;
