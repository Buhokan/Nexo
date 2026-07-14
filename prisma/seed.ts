/**
 * Nexo — Seed de datos iniciales (Producción / Multi-usuario)
 *
 * Genera datos base compartidos por todos los usuarios:
 * - Categorías del sistema
 * - Logros (Achievements)
 *
 * Ejecutar: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import { ACHIEVEMENTS } from "../constants/gamification";

const prisma = new PrismaClient();

const CATEGORIES_DATA = [
  { name: "Comida",      emoji: "🍔", icon: "utensils",      color: "#F59E0B", sortOrder: 1 },
  { name: "Transporte",  emoji: "🚗", icon: "car",           color: "#4DA3FF", sortOrder: 2 },
  { name: "Ocio",        emoji: "🎮", icon: "gamepad-2",     color: "#7C5CFF", sortOrder: 3 },
  { name: "Hogar",       emoji: "🏠", icon: "home",          color: "#22C55E", sortOrder: 4 },
  { name: "Tecnología",  emoji: "💻", icon: "laptop",        color: "#4DA3FF", sortOrder: 5 },
  { name: "Salud",       emoji: "❤️", icon: "heart-pulse",   color: "#EF4444", sortOrder: 6 },
  { name: "Educación",   emoji: "📚", icon: "book-open",     color: "#F59E0B", sortOrder: 7 },
  { name: "Compras",     emoji: "🛒", icon: "shopping-cart", color: "#22C55E", sortOrder: 8 },
  { name: "Otros",       emoji: "📦", icon: "package",       color: "#8B8B9E", sortOrder: 9 },
  { name: "Ingreso",     emoji: "💰", icon: "trending-up",   color: "#22C55E", sortOrder: 10 },
] as const;

async function main() {
  console.log("🌱 Iniciando seed de base del sistema...");

  // Upsert categorías del sistema
  for (const cat of CATEGORIES_DATA) {
    await prisma.category.upsert({
      where: { id: `system_${cat.name.toLowerCase()}` },
      update: {},
      create: {
        id: `system_${cat.name.toLowerCase()}`,
        ...cat,
        isSystem: true,
      },
    });
  }
  console.log(`✅ Categorías del sistema creadas/verificadas`);

  // Upsert logros
  for (const ach of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: ach.key },
      update: {
        name: ach.name,
        description: ach.description,
        emoji: ach.emoji,
        xpReward: ach.xpReward,
      },
      create: { ...ach },
    });
  }
  console.log(`✅ Logros base creados/verificados`);

  console.log("\n🎉 Seed base completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
