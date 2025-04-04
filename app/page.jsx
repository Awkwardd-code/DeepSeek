'use client';
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = (role, content) => {
        setMessages(prevMessages => [...prevMessages, { role, content }]);
    };

    return (
        <div className="flex h-screen">
            {/* -- sidebar -- */}
            <Sidebar expand={expand} setExpand={setExpand} />
            <div className={`${expand ? 'w-64' : 'w-20'} flex-1 flex flex-col items-center justify-center px-4 py-8 bg-[#292a2d] text-white relative transition-all duration-300`}>
                <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
                    <Image
                        onClick={() => setExpand(!expand)}
                        className={`cursor-pointer ${expand ? 'rotate-0' : 'rotate-180'}`}
                        src={assets.menu_icon}
                        alt="Menu"
                        width={24}
                        height={24}
                    />
                    <Image
                        className="opacity-70 cursor-pointer"
                        src={assets.chat_icon}
                        alt="Chat"
                        width={24}
                        height={24}
                    />
                </div>

                {messages.length === 0 ? (
                    <>
                        <div className="flex items-center gap-3">
                            <Image
                                src={assets.logo_icon}
                                alt="DeepSeek Logo"
                                width={64}
                                height={64}
                                className="h-16 w-auto"
                            />
                            <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
                        </div>
                        <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                            How can I help you today?
                        </p>
                    </>
                ) : (
                    <div>
                        <Message role="user" content="What is next js?" />
                    </div>
                )}

                <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
                <p className="text-xs absolute bottom-1 right-2 text-gray-400 dark:text-gray-500 italic">
                    AI-generated content, for reference only
                </p>
            </div>
        </div>
    );
}
