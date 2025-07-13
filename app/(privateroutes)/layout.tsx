import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
