"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Target,
  CalendarDays,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const MOBILE_NAV_ITEMS = [
  {
    label: "Inicio",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Gastos",
    href: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRight,
  },
  {
    label: "Stats",
    href: ROUTES.STATS,
    icon: BarChart3,
  },
  {
    label: "Objetivos",
    href: ROUTES.GOALS,
    icon: Target,
  },
  {
    label: "Calendario",
    href: ROUTES.CALENDAR,
    icon: CalendarDays,
  },
] as const;

/**
 * Navegación inferior para móvil.
 * Solo visible en pantallas < 768px.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] md:hidden"
      style={{
        height: "var(--mobile-nav-height)",
        background: "rgba(23, 23, 31, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--color-border)",
      }}
      aria-label="Navegación principal"
    >
      <ul className="flex items-center justify-around h-full px-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl transition-all duration-150 relative"
                style={{ minHeight: "52px" }}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Indicador activo */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "var(--color-primary-subtle)",
                    }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                  />
                )}

                <span className="relative flex flex-col items-center gap-0.5">
                  <Icon
                    size={20}
                    style={{
                      color: isActive
                        ? "var(--color-primary-light)"
                        : "var(--color-text-subtle)",
                      transition: "color 150ms ease",
                    }}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{
                      color: isActive
                        ? "var(--color-primary-light)"
                        : "var(--color-text-subtle)",
                      transition: "color 150ms ease",
                    }}
                  >
                    {item.label}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
