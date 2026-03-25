'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ANIM: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, staggerChildren: 0.1 } }
};
const ITEM: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const chartData = [
  { month: "Oct", subs: 280 },
  { month: "Nov", subs: 310 },
  { month: "Dec", subs: 340 },
  { month: "Jan", subs: 390 },
  { month: "Feb", subs: 420 },
  { month: "Mar", subs: 450 },
];

const students = [
  { name: "Ahmed Khalil", year: "4th Year", status: "Active", daysLeft: 120 },
  { name: "Reem Nasser", year: "3rd Year", status: "Active", daysLeft: 85 },
  { name: "Omar Hassan", year: "5th Year", status: "Expiring", daysLeft: 12 },
  { name: "Lina Farouk", year: "4th Year", status: "Active", daysLeft: 200 },
  { name: "Youssef Ali", year: "3rd Year", status: "Expired", daysLeft: 0 },
];

const metrics = [
  { label: "Active Students", value: "450", sub: "+12 this month", icon: Users },
  { label: "Subscription MRR", value: "$4,500", sub: "+8.2% vs last month", icon: DollarSign },
  { label: "Avg. Days Left", value: "94 days", sub: "Subscription health", icon: Clock },
];

interface Props {
  user: { fullName: string; role: string };
}

export default function UniversityHomeClient({ user }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.div variants={ANIM} initial="hidden" animate="visible" className="space-y-6">
      {/* Greeting */}
      <motion.div variants={ITEM} className="pt-2">
        <p className="text-muted-foreground text-sm font-medium">Overview</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.fullName}</h2>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={ITEM} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="glass-card-solid p-5 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#138b94]/10 flex items-center justify-center">
                <m.icon className="h-5 w-5 text-[#138b94]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight tabular-nums">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            <p className="text-[10px] text-[#138b94] font-medium mt-1 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> {m.sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Chart */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Subscription Growth</h3>
        <div className="glass-card-solid p-5">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(183, 78%, 33%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(183, 78%, 33%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                }}
              />
              <Area
                type="monotone"
                dataKey="subs"
                stroke="hsl(183, 78%, 33%)"
                strokeWidth={2}
                fill="url(#tealGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Student List */}
      <motion.div variants={ITEM}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Registrations</h3>
        <div className="glass-card-solid overflow-hidden">
          {/* Header - desktop only */}
          <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-gray-100/50">
            <span>Name</span>
            <span>Year</span>
            <span>Status</span>
            <span className="text-right">Days Left</span>
          </div>
          {students.map((s, i) => (
            <div
              key={i}
              className="flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-3.5 hover:bg-gray-50/30 transition-colors duration-200 cursor-pointer border-b border-gray-100/30 last:border-0"
            >
              <div className="flex items-center justify-between sm:contents">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <span className="sm:hidden text-xs text-muted-foreground tabular-nums">{s.daysLeft}d</span>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">{s.year}</span>
              <span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  s.status === "Active" ? "bg-[#138b94]/10 text-[#138b94]" :
                  s.status === "Expiring" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100/60 text-red-600"
                }`}>
                  {s.status}
                </span>
              </span>
              <span className="text-sm text-muted-foreground text-right tabular-nums">{s.daysLeft}d</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
