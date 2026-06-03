"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";

export function AttendanceTrend({ data }: { data: { month: string; present: number; absent: number }[] }) {
  return (
    <Card className="min-h-72">
      <h2 className="mb-4 font-semibold">Monthly Attendance Trend</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid stroke="#303030" />
          <XAxis dataKey="month" stroke="#a3a3a3" />
          <YAxis stroke="#a3a3a3" />
          <Tooltip contentStyle={{ background: "#181818", border: "1px solid #303030" }} />
          <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function FeeTrend({ data }: { data: { month: string; collected: number; pending: number }[] }) {
  return (
    <Card className="min-h-72">
      <h2 className="mb-4 font-semibold">Fee Collection & Pending Trend</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid stroke="#303030" />
          <XAxis dataKey="month" stroke="#a3a3a3" />
          <YAxis stroke="#a3a3a3" />
          <Tooltip contentStyle={{ background: "#181818", border: "1px solid #303030" }} />
          <Line dataKey="collected" stroke="#d4af37" strokeWidth={3} dot={false} />
          <Line dataKey="pending" stroke="#60a5fa" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
