'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const isHome = pathname === '/';
    const isRoadmap = pathname === '/roadmap';

    return (
        <nav id="navbar" className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex justify-between items-center w-full">
                <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                    <Image
                        src="/logo.png"
                        alt="Dentara Logo"
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300"
                    />
                    <span className="text-2xl font-bold tracking-tight text-brand-dark group-hover:text-brand-teal transition-colors">DENTARA</span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className={`text-sm font-bold relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] transition-all duration-300 ${isHome
                                ? 'text-brand-teal after:w-full after:bg-brand-teal'
                                : 'text-gray-500 hover:text-brand-dark after:w-0 after:bg-brand-dark hover:after:w-full'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/roadmap"
                        className={`text-sm font-bold relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] transition-all duration-300 ${isRoadmap
                                ? 'text-brand-teal after:w-full after:bg-brand-teal'
                                : 'text-gray-500 hover:text-brand-dark after:w-0 after:bg-brand-dark hover:after:w-full'
                            }`}
                    >
                        Roadmap
                    </Link>
                    <button
                        onClick={() => alert('Waitlist joined successfully!')}
                        className="bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        Get Access
                    </button>
                </div>
            </div>
        </nav>
    );
}
