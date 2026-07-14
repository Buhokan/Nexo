import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/**
 * Ruta raíz — redirige al dashboard
 */
export default function HomePage() {
  redirect(ROUTES.DASHBOARD);
}
