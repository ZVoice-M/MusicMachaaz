import { SettingsForm } from "@/components/forms/settings-form";
import { PageHeader } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        title="Settings"
        description="Fee per day affects all fee calculations. Institute name appears on exports."
      />
      <Card className="max-w-xl">
        <div className="mb-4 flex items-center gap-3 pb-4 border-b border-border">
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm">
            S
          </div>
          <div>
            <p className="font-semibold text-white">Subin</p>
            <p className="text-xs text-muted">Academy Admin</p>
          </div>
        </div>
        <SettingsForm settings={settings} />
      </Card>
    </>
  );
}
