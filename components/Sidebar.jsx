import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import { UserButton, useUser, SignIn, useClerk } from '@clerk/nextjs';

import ChatLabel from './ChatLabel';

const Sidebar = ({ expand, setExpand }) => {
    const { openSignIn } = useClerk();
    const { user, isLoaded } = useUser();
    const [openMenu, setOpenMenu] = useState({ id: 0, open: false })
    return (
        <div className={`flex flex-col justify-between bg-[#212327] pt-7 transition-all z-50 max-md:absolute max-md:h-screen 
            ${expand ? 'p-4 w-64' : 'md:w-20 w-0 max-md:overflow-hidden'}`}>

            <div>
                <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
                    <Image
                        className={expand ? "w-36" : "w-10"}
                        src={expand ? assets.logo_text : assets.logo_icon}
                        alt="Company Logo"
                        width={expand ? 144 : 40}
                        height={40}
                    />

                    <div onClick={() => expand ? setExpand(false) : setExpand(true)}

                        className='group relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 aspect-square rounded-lg cursor-pointer'>
                        <Image
                            src={assets.menu_icon}
                            alt="Mobile Menu"
                            className='md:hidden'
                            width={20}
                            height={20}
                        />
                        <Image
                            src={expand ? assets.sidebar_close_icon : assets.sidebar_icon}
                            alt={expand ? "Close Sidebar" : "Open Sidebar"}
                            className='hidden md:block w-7'
                            width={28}
                            height={28}
                            onClick={() => setExpand(!expand)}
                        />
                        <div className={`absolute w-max ${expand ? "left-1/2 -translate-x-1/2 top-12" : "-top-12 left-0"}
                         opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black dark:bg-gray-700
                          text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none z-50`}>
                            {expand ? 'Close sidebar' : 'Open sidebar'}
                            <div
                                className={`w-3 h-3 absolute bg-black dark:bg-white rotate-45 transition-all duration-200
                                ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}
                            />
                        </div>
                    </div>
                </div>
                <button className={`mt-8 flex items-center justify-center cursor-pointer transition-all duration-200 
                    ${expand ? "bg-blue-600 mt-8 hover:opacity-90 rounded-2xl gap-2 p-3 px-5 w-max  text-blue-600  hover:bg-blue-200" : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"}`}
                >
                    <Image
                        className={`transition-all ${expand ? 'w-6' : 'w-7'}`}
                        src={expand ? assets.chat_icon : assets.chat_icon_dull}
                        alt="New chat"
                        width={expand ? 24 : 28}
                        height={expand ? 24 : 28}
                    />
                    <div
                        className="absolute w-max -top-12 -right-12 opacity-0 
                        group-hover:opacity-100 transition-all duration-200 
                        bg-black dark:bg-gray-700 text-white text-sm 
                        px-3 py-2 rounded-lg shadow-lg pointer-events-none
                        z-50"
                    >
                        New chat
                        <div className="w-3 h-3 absolute bg-black dark:bg-gray-700 rotate-45 left-4 -bottom-1.5">

                        </div>

                    </div>
                    {expand && (
                        <p className='text-white font-medium transition-opacity duration-200'>
                            New chat
                        </p>
                    )}
                </button>
                <div className={`mt-8 text-white/25 text-sm ${expand ? "block" : "hidden"}`}>
                    <p className="my-1">Recents</p>
                    <ChatLabel openMenu={openMenu} setOpenMenu={setOpenMenu} />
                </div>
            </div>
            <div>
                <div className={`flex items-center cursor-pointer group relative transition-all duration-200 ${expand
                    ? 'gap-2 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10'
                    : 'h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg'
                    }`}>
                    {/* Phone Icon */}
                    <Image
                        className={expand ? "w-5" : "w-6 mx-auto"}
                        src={expand ? assets.phone_icon : assets.phone_icon_dull}
                        alt="Phone icon"
                        width={expand ? 20 : 24}
                        height={expand ? 20 : 24}
                    />
                    <div className={`absolute -top-60 pb-8 ${!expand && "-right-40"} 
                        opacity-0 group-hover:opacity-100 hidden  group-hover:block transition-opacity duration-200 z-50`}>
                        <div className="relative w-max bg-black dark:bg-gray-800 text-white text-sm p-3 rounded-lg shadow-lg transition-all duration-200 z-50">
                            <Image
                                src={assets.qrcode}
                                alt="DeepSeek QR Code"
                                width={176}
                                height={176}
                                className='w-44'
                            />
                            <p>Scan to get DeepSeek App</p>
                            <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "right-1/2" : "left-1"} -bottom-1.5`}></div>
                        </div>
                    </div>

                    {/* Expanded Text */}
                    {expand && (
                        <>
                            <span className="text-sm">Get App</span>
                            <Image
                                src={assets.new_icon}
                                alt="New"
                                width={16}
                                height={16}
                            />
                        </>
                    )}
                </div>

                <div
                    onClick={user ? null : openSignIn}
                    className={`flex items-center ${expand ? 'hover:bg-white/10 rounded-lg' : 'justify-center w-full'} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer transition-colors duration-200`}
                >
                    {user ? (
                        <UserButton />
                    ) : (
                        <Image
                            src={assets.profile_icon}
                            alt="Profile"
                            className="w-7"
                            width={28}
                            height={28}
                        />
                    )}

                    {expand && <span className="truncate">My Profile</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar
