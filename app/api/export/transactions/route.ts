import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") ?? "3", 10);

    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    // Crear CSV
    const headers = ["Fecha", "Descripción", "Categoría", "Tipo", "Monto", "Método de Pago"];
    
    const rows = transactions.map((tx) => [
      format(tx.date, "yyyy-MM-dd"),
      `"${tx.description.replace(/"/g, '""')}"`, // Escapar comillas
      `"${tx.category?.name ?? "Sin categoría"}"`,
      tx.type === "EXPENSE" ? "Gasto" : "Ingreso",
      Number(tx.amount).toString(),
      tx.paymentMethod ?? "OTHER"
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nexo-export-${format(new Date(), "yyyy-MM-dd")}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
