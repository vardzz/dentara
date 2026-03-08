'use client';

import Image from 'next/image';

export default function Footer() {
    return (
        <div className="px-4 md:px-12 lg:px-24 pb-12 bg-white pt-12">
            <footer className="bg-[#1e293b] relative overflow-hidden text-white rounded-2xl w-full">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="network-footer" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                <circle cx="50" cy="50" r="2" fill="#fff" />
                                <path d="M50 50 L100 0 M50 50 L0 100 M50 50 L100 100 M50 50 L0 0" stroke="#fff" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#network-footer)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center py-20 px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">Ready to complete your quotas?</h2>

                    <p className="text-blue-100/90 mb-10 max-w-2xl mx-auto md:text-lg">
                        Join Dentara to explore our network of pre-screened patients, structured LGU partnerships, and seamless institutional tracking.
                    </p>

                    <button
                        onClick={() => alert('Waitlist joined successfully!')}
                        className="group relative bg-[#f8fafc] hover:bg-white text-[#1e293b] font-bold px-8 py-3.5 rounded-lg shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:w-auto w-full overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">Get Early Access &rarr; Save My Spot</span>
                        <div className="absolute inset-0 bg-brand-light/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                    </button>
                </div>
            </footer>

            {/* Bottom bar */}
            <div className="mt-8 text-center text-sm text-[#475569] font-medium flex flex-col items-center gap-4">
                <div className="group flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer">
                    <Image
                        src="/assets/logo.png"
                        alt="Dentara Logo"
                        width={20}
                        height={20}
                        className="w-5 h-5 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                    />
                    <span className="text-lg font-bold tracking-tight text-[#1e293b]">DENTARA</span>
                </div>
                <div>&copy; 2026 Dentara Inc. All rights reserved. Where Care Meets Career.</div>
            </div>
        </div>
    );
}
