"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NexoIsotype } from "@/components/ui/NexoLogo";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.TRANSACTIONS]: "Transacciones",
  [ROUTES.CATEGORIES]: "Categorías",
  [ROUTES.GOALS]: "Objetivos",
  [ROUTES.STATS]: "Estadísticas",
  [ROUTES.CALENDAR]: "Calendario",
  [ROUTES.AI_ASSISTANT]: "Asistente IA",
  [ROUTES.SETTINGS]: "Configuración",
  [ROUTES.PROFILE]: "Mi perfil",
};

/**
 * Header principal de la aplicación.
 * Ahora muestra el avatar y nombre real del usuario autenticado con Clerk.
 */
export function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Nexo";
  const { user } = useUser();

  // Iniciales del usuario para el avatar
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U";

  return (
    <header
      className="sticky top-0 z-[var(--z-sticky)] flex items-center justify-between px-4 md:px-6"
      style={{
        height: "var(--header-height)",
        background: "rgba(11, 11, 15, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {/* Logo en móvil / Título en desktop */}
      <div className="flex items-center gap-3">
        {/* Logo solo visible en móvil */}
        <Link href={ROUTES.DASHBOARD} className="md:hidden">
          <NexoIsotype size={28} />
        </Link>

        {/* Título de la sección */}
        <h1
          className="text-[15px] md:text-base font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {title}
        </h1>
      </div>

      {/* Acciones del header */}
      <div className="flex items-center gap-2">
        {/* Nombre del usuario (solo desktop) */}
        {user?.firstName && (
          <span
            className="hidden md:block text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Hola, {user.firstName} 👋
          </span>
        )}

        {/* Avatar / Perfil — Link a página de ajustes */}
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center justify-center w-9 h-9 rounded-xl font-bold text-sm transition-all hover:opacity-80 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
            color: "white",
          }}
          aria-label="Mi perfil"
          id="profile-btn"
          title={user?.fullName ?? "Mi perfil"}
        >
          {user?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.fullName ?? "Avatar"}
              className="w-9 h-9 rounded-xl object-cover"
            />
          ) : (
            initials
          )}
        </Link>
      </div>
    </header>
  );
}
