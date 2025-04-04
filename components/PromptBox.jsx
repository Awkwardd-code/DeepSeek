import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'

function PromptBox({isLoading,setIsLoading}) {
  const [prompt, setPrompt] = useState('')
  return (
    <form
      className={`w-full ${false ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all duration-200`}
    >
      <textarea
        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white placeholder-gray-400'
        rows={2}
        placeholder='Message DeepSeek'
        required
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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
        <div className='flex items-center gap-2'>
          {/* Standalone Pinned Icon */}
          <Image
            src={assets.pin_icon}
            alt="Pinned"
            width={16}
            height={16}
            className='w-4 h-auto cursor-pointer opacity-70 hover:opacity-100 transition-opacity'
          />

          {/* Pinned Button */}
          <button
            aria-label="Pin item"
            className={`${prompt ? "bg-blue-600" : "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}
          >
            <Image
              className='w-3.5 aspect-square'
              src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
              alt={prompt ? "Active arrow" : "Inactive arrow"}
              width={14}
              height={14}
            />
          </button>
        </div>
      </div>
    </form>
  )
}

export default PromptBox

