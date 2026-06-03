
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md overflow-hidden shrink-0">
  <img src="/logo.png" alt="Music Machaanz" className="h-full w-full object-cover" />
</div>
          </div>
          <div>
            <h1 className="text-xl font-bold">Music Machaanz</h1>
            <p className="text-sm text-muted">Welcome back, Subin</p>
          </div>
        </div>
        <LoginForm />
      </Card>
    </main>
  );
}
