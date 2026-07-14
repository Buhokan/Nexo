import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FAB } from "@/components/layout/FAB";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserExists } from "@/lib/user";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación Nexo.
 * - Verifica autenticación con Clerk
 * - Sincroniza el usuario en la BD de Nexo (crea el registro si es nuevo)
 * - Sidebar en desktop (izquierda, fijo)
 * - Header superior (sticky)
 * - Contenido principal con scroll
 * - Bottom nav en móvil (fijo)
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId } = await auth();

  // Si no hay sesión, redirigir a sign-in
  if (!userId) {
    redirect("/sign-in");
  }

  // Obtener datos del usuario de Clerk y sincronizar con nuestra BD
  const clerkUser = await currentUser();
  if (clerkUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser.fullName ?? clerkUser.firstName ?? null;
    await ensureUserExists(userId, email, name);
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Sidebar — solo visible en desktop */}
      <Sidebar />

      {/* Área principal */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: 0,
          paddingBottom: "var(--mobile-nav-height)",
        }}
      >
        <div
          className="md:ml-[var(--sidebar-width)] flex flex-col min-h-screen"
        >
          {/* Header */}
          <Header />

          {/* Contenido */}
          <main
            className="flex-1 px-4 py-6 md:px-6 md:py-8"
            id="main-content"
            style={{ maxWidth: "var(--content-max-width)", margin: "0 auto", width: "100%" }}
          >
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />

      {/* Floating Action Button (Global) */}
      <FAB />
    </div>
  );
}
