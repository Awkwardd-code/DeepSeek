"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { assets } from '@/assets/assets';
import Image from 'next/image';
import React from 'react';

const Message = ({ role, content, conversationId }) => {
  const addMessage = useMutation(api.conversations.insertConversation);

  const handleAddMessage = async () => {
    try {
      await addMessage({
        conversationId,   // Pass as prop from parent
        role,
        content,
        timestamp: Date.now(),
      });
      console.log("Message saved to Convex");
    } catch (err) {
      console.error("Failed to add message:", err);
    }
  };

  return (
    <div className='flex flex-col items-center w-full max-w-3xl text-sm'>
      <div className={`flex flex-col w-full mb-8 ${role === 'user' ? 'items-end' : ''}`}>
        <div
          className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user'
            ? 'bg-[#414158] px-5'
            : 'gap-3 bg-[#404045] px-4'
            }`}
        >
          <div
            className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-16 top-2.5' : 'left-9 -bottom-6'
              } transition-all duration-200 z-10`}
          >
            <div className='flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity'>
              {role === 'user' ? (
                <>
                  <Image
                    src={assets.copy_icon}
                    alt="Copy"
                    width={16}
                    height={16}
                    className='w-4 cursor-pointer'
                    onClick={handleAddMessage} // Save message to Convex
                  />
                  <Image
                    src={assets.pencil_icon}
                    alt="Pencil"
                    width={16}
                    height={16}
                    className='w-4.5 cursor-pointer'
                  />
                </>
              ) : (
                <>
                  <Image
                    src={assets.copy_icon}
                    alt="Copy"
                    width={16}
                    height={16}
                    className='w-4.5 cursor-pointer'
                    onClick={handleAddMessage} // Save message to Convex
                  />
                  <Image
                    src={assets.regenerate_icon}
                    alt="Regenerate"
                    width={16}
                    height={16}
                    className='w-4 cursor-pointer'
                  />
                  <Image
                    src={assets.like_icon}
                    alt="Like"
                    width={16}
                    height={16}
                    className='w-4 cursor-pointer'
                  />
                  <Image
                    src={assets.dislike_icon}
                    alt="Dislike"
                    width={16}
                    height={16}
                    className='w-4 cursor-pointer'
                  />
                </>
              )}
            </div>
          </div>

          {role === "user" ? (
            <span className='text-white/90'>{content}</span>
          ) : (
            <>
              <Image src={assets.logo_icon} className='h-9 w-9 p-1 border border-white/15 rounded-full' />
              <div className='space-y-4 w-full overflow-scroll'>{content}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
