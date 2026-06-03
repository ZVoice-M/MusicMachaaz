import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isDemoMode } from "@/lib/supabase";

export default async function RootPage() {
  if (isDemoMode) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
