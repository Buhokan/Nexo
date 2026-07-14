"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Target,
  BarChart3,
  CalendarDays,
  Sparkles,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";
import { NexoLogo } from "@/components/ui/NexoLogo";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Transacciones",
    href: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRight,
  },
  {
    label: "Categorías",
    href: ROUTES.CATEGORIES,
    icon: Tag,
  },
  {
    label: "Objetivos",
    href: ROUTES.GOALS,
    icon: Target,
  },
  {
    label: "Estadísticas",
    href: ROUTES.STATS,
    icon: BarChart3,
  },
  {
    label: "Calendario",
    href: ROUTES.CALENDAR,
    icon: CalendarDays,
  },
  {
    label: "Asistente IA",
    href: ROUTES.AI_ASSISTANT,
    icon: Sparkles,
    badge: "Pronto",
  },
] as const;

const BOTTOM_ITEMS = [
  {
    label: "Configuración",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-[var(--z-sticky)] hidden md:flex flex-col"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center px-6 py-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <NexoLogo size={28} showWordmark />
        </Link>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group",
                    isActive
                      ? "text-white"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
                  )}
                >
                  {/* Background activo */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(124,92,255,0.2), rgba(77,163,255,0.1))",
                        border: "1px solid rgba(124,92,255,0.3)",
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}

                  <span className="relative flex items-center gap-3 w-full">
                    <Icon
                      size={18}
                      className={cn(
                        "shrink-0 transition-colors",
                        isActive
                          ? "text-[var(--color-primary-light)]"
                          : "text-[var(--color-text-subtle)] group-hover:text-[var(--color-text-muted)]"
                      )}
                    />
                    <span>{item.label}</span>

                    {/* Badge */}
                    {"badge" in item && item.badge && (
                      <span
                        className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--color-primary-subtle)",
                          color: "var(--color-primary-light)",
                          border: "1px solid rgba(124,92,255,0.2)",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Stats rápidas de gamificación */}
      <div className="mx-3 mb-3 p-3 rounded-xl" style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary-subtle)" }}>
            <Zap size={14} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
              Nivel 3
            </p>
            <p className="text-[10px]" style={{ color: "var(--color-text-subtle)" }}>
              350 / 650 XP
            </p>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="nexo-progress" style={{ height: "4px" }}>
          <div
            className="nexo-progress-bar"
            style={{ width: "53%" }}
          />
        </div>
      </div>

      {/* Configuración */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-white bg-[var(--color-surface-2)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
