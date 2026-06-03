"use client";

import { Users, GraduationCap, IndianRupee, CalendarCheck } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { isDemoMode } from "@/lib/supabase";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Demo data
const DEMO_TREND = [
  { month: "Jan", fees: 18000, collected: 15000 },
  { month: "Feb", fees: 22000, collected: 19000 },
  { month: "Mar", fees: 20000, collected: 20000 },
  { month: "Apr", fees: 25000, collected: 21000 },
  { month: "May", fees: 23000, collected: 22000 },
  { month: "Jun", fees: 27000, collected: 24000 },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, Subin`}
      />

      {isDemoMode && <DemoBanner />}

      {/* Stats grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Students" value="24" icon={Users} />
        <StatCard label="Active Batches" value="4" icon={GraduationCap} />
        <StatCard
          label="Pending Dues"
          value="₹18,500"
          icon={IndianRupee}
          trend={{ value: "3 students overdue", positive: false }}
        />
        <StatCard
          label="Attendance (Jun)"
          value="87%"
          icon={CalendarCheck}
          trend={{ value: "↑ 4% from May", positive: true }}
        />
      </div>

      {/* Revenue trend chart */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#aaa] uppercase tracking-wider mb-5">
          Fee Trend — Last 6 Months
        </h2>
        {/* ResponsiveContainer makes recharts mobile-safe */}
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={DEMO_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFees" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#cc6600" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#cc6600" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
              labelStyle={{ color: "#aaa" }}
              formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
            />
            <Area type="monotone" dataKey="fees" name="Generated" stroke="#cc6600" strokeWidth={2} fill="url(#gradFees)" dot={false} />
            <Area type="monotone" dataKey="collected" name="Collected" stroke="#22c55e" strokeWidth={2} fill="url(#gradCollected)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-[#888]">
            <span className="w-3 h-0.5 bg-[#cc6600] inline-block rounded" /> Generated
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#888]">
            <span className="w-3 h-0.5 bg-green-500 inline-block rounded" /> Collected
          </span>
        </div>
      </div>
    </div>
  );
}
