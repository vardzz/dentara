'use client';

import { Rocket, Check } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1], // Premium Ease-Out-Expo feel
        },
    },
};

export default function RoadmapPage() {
    return (
        <section id="roadmap" className="py-24 px-6 md:px-12 lg:px-24 bg-[#fafaf9] relative overflow-hidden flex-1">
            {/* Background aesthetic blur */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light rounded-full blur-[100px] opacity-70 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-brand-light/60 rounded-full blur-[100px] opacity-50 pointer-events-none -translate-x-1/2"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-4xl mx-auto text-center relative z-10 mb-16"
            >
                <motion.h2 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
                    <Rocket className="w-8 h-8 text-brand-teal" /> <span className="text-gradient">Dentara Roadmap</span>
                </motion.h2>
                <motion.p variants={itemVariants} className="text-brand-gray text-lg max-w-2xl mx-auto">
                    Our journey to revolutionize the Philippine clinical supply chain. See what we&apos;ve launched and what&apos;s coming next.
                </motion.p>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-4xl mx-auto relative hidden md:block"
            >
                {/* Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-light -translate-x-1/2"></div>

                <div className="space-y-16">
                    {/* Item 1 (Left) */}
                    <motion.div variants={itemVariants} className="relative flex items-start justify-between w-full group">
                        {/* Left Content */}
                        <div className="w-[45%] text-right pr-8">
                            <div className="roadmap-card p-6 rounded-2xl inline-block w-full">
                                <div className="text-brand-teal font-bold text-xl mb-1">January 2026</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Waitlist & Beta Launch</h3>
                                <p className="text-sm text-gray-500 mb-4">Initial release to gather real student demand and secure pilot LGU partners.</p>
                                <ul className="space-y-2 text-sm text-gray-400 flex flex-col items-end">
                                    <li className="flex items-center justify-end gap-2 line-through"><span>Gather demand from 500+ students</span> <Check className="w-3.5 h-3.5" /></li>
                                    <li className="flex items-center justify-end gap-2 line-through"><span>Onboard first 5 LGUs</span> <Check className="w-3.5 h-3.5" /></li>
                                    <li className="flex items-center justify-end gap-2 line-through"><span>Release v1 waiting list platform</span> <Check className="w-3.5 h-3.5" /></li>
                                </ul>
                            </div>
                        </div>
                        {/* Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-white border-4 border-brand-teal z-10 shadow-sm shadow-brand-teal/20 group-hover:scale-125 transition-transform duration-300"></div>
                        {/* Right Space */}
                        <div className="w-[45%]"></div>
                    </motion.div>

                    {/* Item 2 (Right) */}
                    <motion.div variants={itemVariants} className="relative flex items-start justify-between w-full group">
                        {/* Left Space */}
                        <div className="w-[45%]"></div>
                        {/* Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-white border-4 border-brand-teal z-10 shadow-sm shadow-brand-teal/20 group-hover:scale-125 transition-transform duration-300"></div>
                        {/* Right Content */}
                        <div className="w-[45%] text-left pl-8">
                            <div className="roadmap-card p-6 rounded-2xl inline-block w-full">
                                <div className="text-brand-teal font-bold text-xl mb-1">February 2026</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Triage Integration</h3>
                                <p className="text-sm text-gray-500 mb-4">Rollout of smart case matching to eliminate manual screening of patients.</p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> <span>Launch Tagalog/English symptom text analyzer</span></li>
                                    <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> <span>Automated quota mapping algorithm</span></li>
                                    <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> <span>Photo-based pre-screening flow</span></li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Item 3 (Left) */}
                    <motion.div variants={itemVariants} className="relative flex items-start justify-between w-full group">
                        {/* Left Content */}
                        <div className="w-[45%] text-right pr-8">
                            <div className="roadmap-card p-6 rounded-2xl inline-block w-full">
                                <div className="text-brand-teal/60 font-bold text-xl mb-1">April 2026</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Institutional Dashboard</h3>
                                <p className="text-sm text-gray-500 mb-4">Bringing universities into the loop for seamless oversight and academic approval.</p>
                                <ul className="space-y-2 text-sm text-gray-600 flex flex-col items-end">
                                    <li className="flex items-center justify-end gap-2"><span>Real-time clinical attendance tracking</span> <Check className="w-3.5 h-3.5 text-gray-300" /></li>
                                    <li className="flex items-center justify-end gap-2"><span>Faculty case approval system</span> <Check className="w-3.5 h-3.5 text-gray-300" /></li>
                                    <li className="flex items-center justify-end gap-2"><span>Digital waiver & consent management</span> <Check className="w-3.5 h-3.5 text-gray-300" /></li>
                                </ul>
                            </div>
                        </div>
                        {/* Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-white border-4 border-brand-teal/40 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                        {/* Right Space */}
                        <div className="w-[45%]"></div>
                    </motion.div>

                    {/* Item 4 (Right) */}
                    <motion.div variants={itemVariants} className="relative flex items-start justify-between w-full group">
                        {/* Left Space */}
                        <div className="w-[45%]"></div>
                        {/* Node */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full bg-white border-4 border-brand-teal/40 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                        {/* Right Content */}
                        <div className="w-[45%] text-left pl-8">
                            <div className="roadmap-card p-6 rounded-2xl inline-block w-full">
                                <div className="text-brand-teal/60 font-bold text-xl mb-1">July 2026</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Nationwide Expansion</h3>
                                <p className="text-sm text-gray-500 mb-4">Scaling the platform to cover all dental schools in the Philippines.</p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> <span>Onboard 50+ dental schools</span></li>
                                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> <span>Corporate CSR sponsorship matching</span></li>
                                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> <span>Automated payout & reconciliation</span></li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="mt-20 text-center">
                    <p className="text-sm font-bold text-brand-teal uppercase tracking-wide">More exciting features coming soon!</p>
                </motion.div>
            </motion.div>

            {/* Mobile Roadmap (Simple vertical list) */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-md mx-auto relative md:hidden space-y-12 pl-4"
            >
                {/* Left Line */}
                <div className="absolute left-[23px] top-2 bottom-0 w-px bg-brand-light"></div>

                {/* Item 1 */}
                <motion.div variants={itemVariants} className="relative pl-10 text-left">
                    <div className="absolute left-[-1px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-teal z-10 shadow-sm shadow-brand-teal/20"></div>
                    <div className="text-brand-teal font-bold text-lg mb-1">January 2026</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Waitlist & Beta Launch</h3>
                    <p className="text-sm text-gray-500 mb-4">Initial release to gather real student demand and secure pilot LGU partners.</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> Gathering demographic data</li>
                        <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> Initial 5 LGU onboarded</li>
                    </ul>
                </motion.div>

                {/* Item 2 */}
                <motion.div variants={itemVariants} className="relative pl-10 text-left">
                    <div className="absolute left-[-1px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-teal z-10 shadow-sm shadow-brand-teal/20"></div>
                    <div className="text-brand-teal font-bold text-lg mb-1">February 2026</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">AI Triage Integration</h3>
                    <p className="text-sm text-gray-500 mb-4">Rollout of smart case matching to eliminate manual screening of patients.</p>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> Tagalog symptom text analyzer</li>
                        <li className="flex items-center gap-2 line-through"><Check className="w-3.5 h-3.5" /> Quota mapping logic</li>
                    </ul>
                </motion.div>

                {/* Item 3 */}
                <motion.div variants={itemVariants} className="relative pl-10 text-left">
                    <div className="absolute left-[-1px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-teal/40 z-10"></div>
                    <div className="text-brand-teal/60 font-bold text-lg mb-1">April 2026</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Institutional Dashboard</h3>
                    <p className="text-sm text-gray-500 mb-4">Bringing universities into the loop for seamless oversight and academic approval.</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> Clinical attendance tracking</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> Faculty case approval</li>
                    </ul>
                </motion.div>

                {/* Item 4 */}
                <motion.div variants={itemVariants} className="relative pl-10 text-left">
                    <div className="absolute left-[-1px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-brand-teal/40 z-10"></div>
                    <div className="text-brand-teal/60 font-bold text-lg mb-1">July 2026</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Nationwide Expansion</h3>
                    <p className="text-sm text-gray-500 mb-4">Scaling the platform to cover all dental schools in the Philippines.</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> Onboard 50+ dental schools</li>
                        <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-300" /> Automated reconciliation</li>
                    </ul>
                </motion.div>

                <motion.div variants={itemVariants} className="pt-8 text-center border-t border-brand-light/50">
                    <p className="text-xs font-bold text-brand-teal uppercase tracking-wide">More coming soon!</p>
                </motion.div>
            </motion.div>
        </section>
    );
}

