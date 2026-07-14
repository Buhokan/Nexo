import prisma from "@/lib/prisma";

/**
 * Asegura que el usuario existe en nuestra BD.
 * 
 * Se llama en el layout del dashboard en cada petición.
 * Si el usuario se acaba de registrar, crea el registro en BD con:
 *  - Su perfil de usuario
 *  - Su perfil de gamificación (nivel 1, 0 XP)
 * 
 * Si ya existe, no hace nada (es idempotente).
 */
export async function ensureUserExists(
  clerkId: string,
  email: string,
  name?: string | null
): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { id: clerkId },
  });

  if (!existing) {
    // Crear usuario nuevo en la BD
    await prisma.user.create({
      data: {
        id: clerkId, // Usamos el clerkId como ID en nuestra BD
        email,
        name: name ?? email.split("@")[0] ?? "Usuario",
        currency: "COP",
        locale: "es-CO",
        timezone: "America/Bogota",
        // Crear su perfil de gamificación automáticamente
        gamificationProfile: {
          create: {
            level: 1,
            xp: 0,
            totalXp: 0,
            streak: 0,
            longestStreak: 0,
          },
        },
      },
    });

    console.log(`[Nexo] Nuevo usuario creado en BD: ${clerkId} (${email})`);
  }
}
