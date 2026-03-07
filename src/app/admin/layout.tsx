import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

export const metadata = {
  title: "Admin | Lumin Art",
  description: "Lumin Art admin portal",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-background text-foreground">{children}</div>
    </AdminAuthProvider>
  );
}
