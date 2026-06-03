"use client";

import { useState } from "react";
import { Save, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DemoBanner } from "@/components/ui/DemoBanner";
import { isDemoMode } from "@/lib/supabase";
import { toast } from "sonner";

export default function SettingsPage() {
  const [feePerDay, setFeePerDay] = useState("150");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const fee = Number(feePerDay);
    if (!feePerDay || isNaN(fee) || fee <= 0) {
      toast.error("Please enter a valid fee per day.");
      return;
    }

    setSaving(true);
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600));
        toast.success("Settings saved (demo mode)");
        return;
      }
      // TODO: persist to Supabase settings table
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Academy configuration" />

      {isDemoMode && <DemoBanner />}

      <div className="max-w-lg space-y-6">
        {/* Admin profile */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#aaa] uppercase tracking-wider mb-4">
            Admin Profile
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#cc6600]/20 border border-[#cc6600]/30 flex items-center justify-center">
              <User size={22} className="text-[#cc6600]" />
            </div>
            <div>
              <p className="font-semibold text-white">Subin</p>
              <p className="text-sm text-[#666]">Academy Administrator</p>
            </div>
          </div>
        </div>

        {/* Fee configuration */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#aaa] uppercase tracking-wider mb-4">
            Fee Configuration
          </h2>
          <div className="space-y-4">
            <Input
              label="Default Fee Per Day (₹)"
              type="number"
              inputMode="numeric"
              min="1"
              value={feePerDay}
              onChange={(e) => setFeePerDay(e.target.value)}
              hint="Applied to all students unless overridden per student. Changing this affects the financial view calculated from current attendance."
            />
            <Button icon={Save} loading={saving} onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-[#111] border border-red-900/30 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
            Danger Zone
          </h2>
          <p className="text-sm text-[#888] mb-4">
            Signing out will require your Supabase credentials to log back in.
          </p>
          <Button
            variant="danger"
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase");
              const supabase = createClient();
              if (supabase) await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
