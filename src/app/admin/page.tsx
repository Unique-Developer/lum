"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Logo } from "@/components/layout/Logo";

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
        <div className="mb-6 flex flex-col items-center">
          <Logo href="/" height={40} width={130} />
          <p className="mt-2 text-sm text-foreground/60">Admin</p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
