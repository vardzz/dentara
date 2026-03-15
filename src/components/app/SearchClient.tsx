'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search as SearchIcon, X, SlidersHorizontal, Stethoscope, UserCircle } from 'lucide-react';

const TAGS = ['Composite', 'Extraction', 'Complete Denture', 'Pedo', 'Prostho', 'RCT'];

interface SearchResult {
  id: string;
  name: string;
  type: string;
  dist: string;
  match: string;
  tag: string;
}

export default function SearchClient({ initialResults }: { initialResults: SearchResult[] }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const containerAnim: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemAnim: Variants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  // Filter results based on search query
  const filteredResults = initialResults.filter(res => 
    res.name.toLowerCase().includes(query.toLowerCase()) || 
    res.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div variants={containerAnim} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <motion.div variants={itemAnim}>
        <h1 className="text-3xl font-black text-[#0e2b5c] tracking-tight">Discover</h1>
        <p className="text-sm font-medium text-gray-400 mt-1">Find patients, clinics, and cases.</p>
      </motion.div>

      {/* ── Search Bar ── */}
      <motion.div variants={itemAnim} className="relative z-20">
        <motion.div animate={{ scale: isFocused ? 1.02 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className={`relative flex items-center bg-white/80 backdrop-blur-xl border ${isFocused ? 'border-[#138b94] ring-4 ring-[#138b94]/10 shadow-lg' : 'border-white/60 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.05)]'} rounded-[24px] overflow-hidden transition-all duration-300`}>
          <div className="pl-5 text-gray-400"><SearchIcon size={20} strokeWidth={2.5} /></div>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Search requirements..." className="w-full bg-transparent px-4 py-4 text-sm font-bold text-[#0e2b5c] placeholder-gray-400 outline-none" />
          <AnimatePresence>
            {query && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setQuery('')} className="pr-4 text-gray-300 hover:text-gray-500 transition-colors"><X size={18} strokeWidth={2.5} /></motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Results ── */}
      <motion.div variants={itemAnim} className="space-y-3 mt-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Top Matches</h2>
        <AnimatePresence>
          {filteredResults.map((res, i) => (
            <motion.div key={res.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }} className="group relative flex items-center p-4 bg-white/70 backdrop-blur-xl border border-white/60 rounded-[28px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-transform overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-400/10 transition-colors" />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-600`}>
                <UserCircle size={24} />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-base font-black text-[#0e2b5c]">{res.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#138b94]">{res.type} • {res.dist}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center justify-center bg-teal-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">{res.match}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}