export const PRICES_URL = "https://interview.switcheo.com/prices.json";

const STABLES = new Set(["USD", "USDC", "BUSD", "USC", "axlUSDC", "YieldUSD"]);

export interface PriceRow {
  currency?: string;
  price?: number;
  date?: string;
}

export interface Token {
  currency: string;
  price: number;
  date: string;
}

export interface Receipt {
  pay: string;
  receive: string;
  from: string;
  to: string;
}

// keep the newest price for each currency
export function latestPrices(rows: PriceRow[]): Token[] {
  const byCurrency = new Map<string, Token>();

  for (const row of rows) {
    if (!row || typeof row.currency !== "string") continue;
    if (typeof row.price !== "number" || !Number.isFinite(row.price) || row.price <= 0) continue;

    const current = byCurrency.get(row.currency);
    if (!current || String(row.date) >= current.date) {
      byCurrency.set(row.currency, {
        currency: row.currency,
        price: row.price,
        date: String(row.date ?? ""),
      });
    }
  }

  return [...byCurrency.values()].sort((a, b) =>
    a.currency.localeCompare(b.currency, "en", { sensitivity: "base" }),
  );
}

// a fixed demo balance for the pay side
export function demoBalance(symbol: string): number {
  if (symbol === "ETH" || symbol === "wstETH") return 1.25;
  if (symbol === "WBTC") return 0.08;
  if (STABLES.has(symbol)) return 2500;
  return 1000;
}

// digits and one decimal point, at most 8 fraction digits
export function sanitizeAmount(value: string): string {
  const cleaned = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
  if (cleaned === "") return "";

  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned.replace(/^0+(?=\d)/, "");

  const whole = cleaned.slice(0, dot).replace(/^0+(?=\d)/, "") || "0";
  const fraction = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, 8);
  return `${whole}.${fraction}`;
}

// pay amount times the price ratio
export function convert(amount: string, fromPrice: number, toPrice: number): number | null {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (!fromPrice || !toPrice) return null;
  return (value * fromPrice) / toPrice;
}

// trim trailing zeros from a numeric input
export function formatInputAmount(value: number): string {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(8).replace(/\.?0+$/, "");
}

// compact notation for huge values
function useCompact(value: number): boolean {
  return Math.abs(value) >= 1e12;
}

// token amount, shortened when it is huge
export function formatTokenAmount(value: number): string {
  if (!Number.isFinite(value)) return "";
  const abs = Math.abs(value);
  if (useCompact(value)) {
    return value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
  }
  const maximumFractionDigits = abs >= 1000 ? 4 : abs >= 1 ? 6 : 8;
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

// USD estimate, shortened when it is huge
export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (useCompact(value)) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    });
  }
  const digits = Math.abs(value) >= 1 ? 2 : 6;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  });
}

// empty, non-positive, or over the demo balance
export function amountError(amount: string, balance: number, symbol: string): string {
  if (amount.trim() === "" || amount === ".") return "Enter an amount.";
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return "Enter an amount greater than 0.";
  if (value > balance) return `Amount exceeds your ${symbol} balance.`;
  return "";
}
