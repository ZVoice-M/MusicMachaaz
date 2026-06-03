import { SettingsForm } from "@/components/forms/settings-form";
import { PageHeader } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { getSettings } from "@/lib/data";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Settings" description="Fee per day affects future fee calculations. Defaults are Music Machaanz, 100, INR." />
      <Card className="max-w-xl">
        <SettingsForm settings={settings} />
      </Card>
    </>
  );
}
