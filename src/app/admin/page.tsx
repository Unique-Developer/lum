"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  const { token, email } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (token && email) {
      router.replace("/admin/dashboard");
    }
  }, [token, email, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin</h1>
        <p className="mt-1 text-sm text-foreground/60">Lumin Art</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
