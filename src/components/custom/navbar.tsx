'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isHome = pathname === '/';
    const isRoadmap = pathname === '/roadmap';

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav id="navbar" className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-3 md:py-4 flex justify-between items-center w-full">

                {/* Logo */}
                <Link href="/" prefetch={true} className="flex items-center gap-2 cursor-pointer group z-50 pointer-events-auto" onClick={handleLinkClick}>
                    <Image
                        src="/assets/logo.png"
                        alt="Dentara Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300"
                    />
                    <span className="text-2xl font-bold tracking-tight text-brand-navy group-hover:text-brand-teal transition-colors">DENTARA</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        prefetch={true}
                        className={`text-sm ${isHome ? 'font-bold text-brand-teal' : 'font-medium text-gray-500 hover:text-brand-navy'} transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] transition-all duration-300 ${isHome ? 'after:w-full after:bg-brand-teal' : 'after:w-0 after:bg-brand-navy hover:after:w-full'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/roadmap"
                        prefetch={true}
                        className={`text-sm ${isRoadmap ? 'font-bold text-brand-teal' : 'font-medium text-gray-500 hover:text-brand-navy'} transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] transition-all duration-300 ${isRoadmap ? 'after:w-full after:bg-brand-teal' : 'after:w-0 after:bg-brand-navy hover:after:w-full'}`}
                    >
                        Roadmap
                    </Link>
                    <button
                        onClick={() => alert('Waitlist joined successfully!')}
                        className="bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md h-11 min-w-[44px]"
                    >
                        Get Access
                    </button>
                    <Link
                        href="/login"
                        prefetch={true}
                        className="bg-brand-teal hover:bg-brand-navy flex items-center justify-center text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg h-11"
                    >
                        Visit App
                    </Link>
                </div>

                {/* Mobile Menu Toggle (44px min target) */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden flex items-center justify-center w-11 h-11 text-brand-navy hover:text-brand-teal transition-colors z-50 pointer-events-auto bg-gray-50/50 rounded-lg border border-gray-100/50"
                    aria-label="Toggle Mobile Menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 h-[100dvh] w-full bg-white/98 backdrop-blur-lg z-40 md:hidden flex flex-col pt-[100px] px-6 pb-12 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-3 w-full">
                            <Link
                                href="/"
                                onClick={handleLinkClick}
                                className={`flex items-center w-full min-h-[60px] px-5 rounded-2xl text-xl transition-colors ${isHome
                                    ? 'bg-brand-teal/10 text-brand-teal font-bold border border-brand-teal/20'
                                    : 'text-gray-700 font-semibold hover:bg-white/50 border border-transparent'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/roadmap"
                                onClick={handleLinkClick}
                                className={`flex items-center w-full min-h-[60px] px-5 rounded-2xl text-xl transition-colors ${isRoadmap
                                    ? 'bg-brand-teal/10 text-brand-teal font-bold border border-brand-teal/20'
                                    : 'text-gray-700 font-semibold hover:bg-white/50 border border-transparent'
                                    }`}
                            >
                                Roadmap
                            </Link>

                            <div className="w-full h-px bg-gray-200/50 my-6"></div>

                            <button
                                onClick={() => {
                                    handleLinkClick();
                                    alert('Waitlist joined successfully!');
                                }}
                                className="flex items-center justify-center w-full min-h-[60px] rounded-2xl text-xl font-bold bg-brand-blue text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                            >
                                Get Early Access
                            </button>
                            <Link
                                href="/login"
                                onClick={handleLinkClick}
                                className="flex items-center justify-center w-full min-h-[60px] rounded-2xl text-xl font-bold bg-brand-teal hover:bg-brand-navy text-white shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all mt-2"
                            >
                                Visit App
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
