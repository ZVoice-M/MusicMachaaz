"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-[#888] mb-6">
            {error.message ?? "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={reset}
            className="bg-[#cc6600] hover:bg-[#e07000] text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
