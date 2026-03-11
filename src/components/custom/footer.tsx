'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const PLATFORM_LINKS = [
    { label: 'Features',      href: '/#features'    },
    { label: 'How it Works',  href: '/#how-it-works' },
    { label: 'AI Demo',       href: '/#demo'         },
    { label: 'FAQ',           href: '/#faq'          },
    { label: 'Sign In',       href: '/app/login'     },
    { label: 'Register',      href: '/app/register'  },
];

const COMPANY_LINKS = [
    { label: 'About Us',   href: '/about'   },
    { label: 'Blog',       href: '/blog'    },
    { label: 'Careers',    href: '/careers' },
    { label: 'Press Kit',  href: '/press'   },
];

const LEGAL_LINKS = [
    { label: 'Terms of Service', href: '/terms'   },
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Cookie Policy',    href: '/cookies' },
];

const SOCIAL_LINKS = [
    { icon: <Facebook  className="w-5 h-5" />, href: '#', label: 'Facebook'  },
    { icon: <Twitter   className="w-5 h-5" />, href: '#', label: 'Twitter'   },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin  className="w-5 h-5" />, href: '#', label: 'LinkedIn'  },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">

                {/* ── Main Grid ────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/assets/icon.png"
                                alt="Dentara Icon"
                                className="w-6 h-6 object-contain"
                            />
                            <span className="text-lg font-bold tracking-tight text-[#0e2b5c]">
                                DENTARA
                            </span>
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed max-w-sm mb-6">
                            Dentara addresses the &ldquo;quota crisis&rdquo; in Philippine dental education
                            by replacing chaotic patient hunting with a secure, data-driven matching engine.
                            Where care meets career.
                        </p>

                        <div className="flex items-center gap-4 text-gray-400">
                            {SOCIAL_LINKS.map(s => (
                                <Link
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="hover:text-[#3b82f6] transition-colors duration-200"
                                >
                                    {s.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Platform Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-5">
                            Platform
                        </h4>
                        <ul className="space-y-3">
                            {PLATFORM_LINKS.map(l => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-sm text-gray-500 hover:text-[#138b94] transition-colors duration-200"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-5">
                            Company
                        </h4>
                        <ul className="space-y-3">
                            {COMPANY_LINKS.map(l => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-sm text-gray-500 hover:text-[#138b94] transition-colors duration-200"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-5">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {LEGAL_LINKS.map(l => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="text-sm text-gray-500 hover:text-[#138b94] transition-colors duration-200"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom Bar ──────────────────────────────────────── */}
                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 font-medium">
                        &copy; 2026 Dentara Technologies, Inc. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                        Made with care in the Philippines, for Filipino students &amp; communities.
                    </p>
                </div>
            </div>
        </footer>
    );
}
