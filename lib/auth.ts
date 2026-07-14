import { auth } from "@clerk/nextjs/server";

/**
 * Obtiene el userId del usuario autenticado actualmente.
 * 
 * Esta función reemplaza el `DEFAULT_USER_ID = "default"` del MVP.
 * Si no hay sesión activa, lanza un error controlado.
 * 
 * Úsala al inicio de CUALQUIER server action que acceda a datos privados:
 * ```ts
 * const userId = await getCurrentUserId();
 * ```
 */
export async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autorizado. Por favor inicia sesión.");
  }

  return userId;
}
