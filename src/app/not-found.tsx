import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#cc6600]/15 flex items-center justify-center">
            <GraduationCap size={24} className="text-[#cc6600]" />
          </div>
        </div>
        <p className="text-6xl font-bold text-[#1e1e1e] mb-4">404</p>
        <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
        <p className="text-[#888] text-sm mb-6">This page doesn&apos;t exist in Music Machaanz.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-[#cc6600] hover:bg-[#e07000] text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
