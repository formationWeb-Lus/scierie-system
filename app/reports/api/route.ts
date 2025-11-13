import { PrismaClient, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  format,
  subWeeks,
} from "date-fns";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const period = searchParams.get("period") || "weekly";
    const dateStr =
      searchParams.get("date") || new Date().toISOString().substring(0, 10);
    const date = new Date(dateStr);

    let where: Record<string, any> = {};
    let range: { gte: Date; lte: Date };

    switch (period) {
      case "daily":
        range = {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        };
        break;
      case "weekly":
        range = {
          gte: startOfWeek(date, { weekStartsOn: 1 }),
          lte: endOfWeek(date, { weekStartsOn: 1 }),
        };
        break;
      case "monthly":
        range = { gte: startOfMonth(date), lte: endOfMonth(date) };
        break;
      case "yearly":
        range = { gte: startOfYear(date), lte: endOfYear(date) };
        break;
      default:
        range = { gte: new Date(), lte: new Date() };
    }

    where.date = range;

    // ✅ Sélection du modèle selon le type
    let model:
      | Prisma.ChargeDelegate<any>
      | Prisma.DepenseDelegate<any>
      | Prisma.FactureDelegate<any>
      | Prisma.ProductionDelegate<any>
      | Prisma.VenteDelegate<any>
      | Prisma.StockDelegate<any>;

    switch (type) {
      case "charges":
        model = prisma.charge;
        break;
      case "depenses":
        model = prisma.depense;
        break;
      case "factures":
        model = prisma.facture;
        break;
      case "productions":
        model = prisma.production;
        break;
      case "ventes":
        model = prisma.vente;
        break;
      case "stocks":
        model = prisma.stock;
        break;
      default:
        return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    // ✅ Cast pour éviter le conflit de types TS
    const rows = await (model as any).findMany({
      where,
      orderBy: { date: "asc" },
    });

    // ✅ Fonction pour extraire le bon montant
    const getAmount = (r: any): number =>
      r.total ?? r.montant ?? r.prix ?? r.unitPrice ?? 0;

    const res: Record<string, any> = {};

    // ========== JOURNALIER ==========
    if (period === "daily") {
      const items = rows.map((r: any) => ({ date: r.date, total: getAmount(r) }));
      res.items = items;
      res.total = items.reduce((sum: number, it: any) => sum + it.total, 0);
    }

    // ========== HEBDOMADAIRE ==========
    if (period === "weekly") {
      const days = eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      });

      const prevWeekStart = startOfWeek(subWeeks(date, 1), { weekStartsOn: 1 });
      const prevWeekEnd = endOfWeek(subWeeks(date, 1), { weekStartsOn: 1 });

      const prevRows = await (model as any).findMany({
        where: { date: { gte: prevWeekStart, lte: prevWeekEnd } },
      });

      const data = days.map((d: Date) => {
        const name = format(d, "EEEE");
        const current = rows
          .filter(
            (r: any) =>
              format(r.date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
          )
          .reduce((s: number, r: any) => s + getAmount(r), 0);
        const prev = prevRows
          .filter(
            (r: any) =>
              format(r.date, "yyyy-MM-dd") === format(d, "yyyy-MM-dd")
          )
          .reduce((s: number, r: any) => s + getAmount(r), 0);
        return { day: name, value: current, prev };
      });

      const totalCurrent = data.reduce((a: number, b: any) => a + b.value, 0);
      const totalPrev = data.reduce((a: number, b: any) => a + b.prev, 0);
      const percentChange =
        totalPrev === 0 ? 100 : ((totalCurrent - totalPrev) / totalPrev) * 100;

      res.data = data;
      res.totalCurrent = totalCurrent;
      res.totalPrev = totalPrev;
      res.percentChange = percentChange;
    }

    // ========== MENSUEL ==========
    if (period === "monthly") {
      const weeks = [1, 2, 3, 4];
      const data = weeks.map((w: number) => {
        const subset = rows.slice((w - 1) * 7, w * 7);
        const value = subset.reduce((s: number, r: any) => s + getAmount(r), 0);
        return { week: `Semaine ${w}`, value };
      });
      res.data = data;
      res.total = data.reduce((a: number, b: any) => a + b.value, 0);
    }

    // ========== ANNUEL ==========
    if (period === "yearly") {
      const months = Array.from({ length: 12 }, (_, i) => i);
      const data = months.map((m: number) => {
        const monthRows = rows.filter(
          (r: any) => new Date(r.date).getMonth() === m
        );
        const value = monthRows.reduce((s: number, r: any) => s + getAmount(r), 0);
        return { month: format(new Date(2025, m, 1), "MMM"), value };
      });
      res.data = data;
      res.total = data.reduce((a: number, b: any) => a + b.value, 0);
    }

    return NextResponse.json(res);
  } catch (e) {
    console.error("Erreur serveur:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
