"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, Calendar, Target, Lock } from "lucide-react";
import { cn } from "@/utils/cn";
import { useProfile, useAchievements } from "@/features/gamification/hooks";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: achievements, isLoading: isAchievementsLoading } = useAchievements();

  const isLoading = isProfileLoading || isAchievementsLoading;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-pulse">
        <div className="h-40 bg-[var(--color-surface-2)] rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-[var(--color-surface-2)] rounded-2xl" />
          <div className="h-24 bg-[var(--color-surface-2)] rounded-2xl" />
        </div>
        <div className="h-48 bg-[var(--color-surface-2)] rounded-3xl" />
      </div>
    );
  }

  // MVP: Nivel cada 100 XP
  const xpForNextLevel = (profile?.level ?? 1) * 100;
  const currentLevelXp = (profile?.totalXp ?? 0) % 100;
  const progressPercent = (currentLevelXp / 100) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        
        {/* ─── Hero Section ───────────────────────────────────────── */}
        <motion.div variants={item} className="nexo-card p-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[var(--color-primary-subtle)] to-transparent opacity-20 pointer-events-none" />
          
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-[var(--color-primary-subtle)]">
              DP
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[var(--color-surface)] rounded-full p-1 border border-[var(--color-border)]">
              <div className="bg-[var(--color-amber)] text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Flame size={12} className="fill-black" />
                {profile?.streak ?? 0}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
            Diego Portilla
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] font-medium">
            Nivel {profile?.level ?? 1} · Entusiasta Financiero
          </p>
        </motion.div>

        {/* ─── Tarjeta de Nivel y XP ──────────────────────────────── */}
        <motion.div variants={item} className="nexo-card p-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Progreso</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-secondary)]">
                  Nivel {profile?.level ?? 1}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[var(--color-text)]">{currentLevelXp}</span>
              <span className="text-xs text-[var(--color-text-subtle)]"> / 100 XP</span>
            </div>
          </div>

          <div className="nexo-progress h-3 bg-[var(--color-surface-2)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="nexo-progress-bar bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] relative overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
          <p className="text-center text-xs text-[var(--color-text-subtle)] mt-3">
            Faltan {100 - currentLevelXp} XP para el Nivel {(profile?.level ?? 1) + 1}
          </p>
        </motion.div>

        {/* ─── Stats Grid ─────────────────────────────────────────── */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3">
          <div className="nexo-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-amber)]/10 text-[var(--color-amber)] flex items-center justify-center shrink-0">
              <Flame size={24} className="fill-current" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Racha Actual</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{profile?.streak ?? 0} días</p>
            </div>
          </div>
          
          <div className="nexo-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] flex items-center justify-center shrink-0">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Mejor Racha</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{profile?.longestStreak ?? 0} días</p>
            </div>
          </div>

          <div className="nexo-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-green)]/10 text-[var(--color-green)] flex items-center justify-center shrink-0">
              <Target size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Transacciones</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{profile?.totalTransactions ?? 0}</p>
            </div>
          </div>

          <div className="nexo-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Días Activo</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{profile?.daysActive ?? 1}</p>
            </div>
          </div>
        </motion.div>

        {/* ─── Logros ─────────────────────────────────────────────── */}
        <motion.div variants={item}>
          <h3 className="text-heading-3 text-[var(--color-text)] mb-4">Logros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements?.map((ach) => (
              <div
                key={ach.id}
                className={cn(
                  "nexo-card p-4 flex flex-col items-center text-center relative transition-all",
                  ach.isUnlocked ? "bg-[var(--color-surface-2)]" : "opacity-60 grayscale hover:grayscale-0"
                )}
              >
                {!ach.isUnlocked && (
                  <div className="absolute top-2 right-2 text-[var(--color-text-subtle)]">
                    <Lock size={14} />
                  </div>
                )}
                
                <div className={cn(
                  "text-4xl mb-3 mt-2",
                  !ach.isUnlocked && "opacity-50"
                )}>
                  {ach.emoji}
                </div>
                
                <h4 className="text-sm font-semibold text-[var(--color-text)] mb-1 leading-tight">
                  {ach.name}
                </h4>
                <p className="text-[10px] text-[var(--color-text-muted)] leading-tight mb-2">
                  {ach.description}
                </p>
                
                {ach.isUnlocked && (
                  <span className="text-[9px] font-bold text-[var(--color-primary-light)] bg-[var(--color-primary-subtle)] px-2 py-0.5 rounded-full mt-auto">
                    +{ach.xpReward} XP
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
