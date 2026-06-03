import { AppShell } from "@/components/layout/app-shell";

export default function SubinLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
