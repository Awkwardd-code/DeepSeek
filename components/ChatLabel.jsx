import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

function ChatLabel({ id, openMenu, setOpenMenu }) {
    const isOpen = openMenu.id === id && openMenu.open;
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu({ id: 0, open: false });
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpenMenu]);

    return (
        <div
            ref={menuRef}
            className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 
            rounded-lg text-sm cursor-pointer transition-colors duration-200 group"
        >
            {/* Chat title */}
            <p className="max-w-[calc(100%-32px)] truncate">Chat Name Here</p>

            {/* Three dots menu */}
            <div
                className={`relative flex items-center justify-center h-6 w-6 aspect-square 
                transition-opacity duration-200 
                ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
                <button
                    aria-label="Open menu"
                    onClick={(e) => {
                        e.stopPropagation(); // prevents toggle from being immediately closed
                        setOpenMenu(isOpen ? { id: 0, open: false } : { id, open: true });
                    }}
                    className="flex items-center justify-center w-full h-full hover:bg-black/80 
                        rounded-lg transition-opacity duration-200"
                >
                    <Image
                        src={assets.three_dots}
                        alt="Menu"
                        width={16}
                        height={16}
                        className="w-4 h-auto opacity-70 hover:opacity-100"
                    />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <div
                        className="absolute right-0 top-full mt-1 bg-[#2d2e32] p-1 rounded-lg shadow-lg 
                        z-10 min-w-[120px] transition-opacity duration-200"
                    >
                        <div className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                            <Image
                                src={assets.pencil_icon}
                                alt="Rename"
                                width={16}
                                height={16}
                                className="w-4 h-auto"
                            />
                            <p className="text-sm">Rename</p>
                        </div>

                        <div className="flex items-center gap-2 p-2 hover:bg-white/10 rounded">
                            <Image
                                src={assets.delete_icon}
                                alt="Delete"
                                width={16}
                                height={16}
                                className="w-4 h-auto"
                            />
                            <p className="text-sm">Delete</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatLabel;
