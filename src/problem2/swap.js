export const PRICES_URL = "https://interview.switcheo.com/prices.json";

const STABLES = new Set(["USD", "USDC", "BUSD", "USC", "axlUSDC", "YieldUSD"]);

export function latestPrices(rows) {
  const byCurrency = new Map();

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
    a.currency.localeCompare(b.currency, "en", { sensitivity: "base" })
  );
}

export function demoBalance(symbol) {
  if (symbol === "ETH" || symbol === "wstETH") return 1.25;
  if (symbol === "WBTC") return 0.08;
  if (STABLES.has(symbol)) return 2500;
  return 1000;
}

export function sanitizeAmount(value) {
  const cleaned = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
  if (cleaned === "") return "";

  const dot = cleaned.indexOf(".");
  if (dot === -1) return cleaned.replace(/^0+(?=\d)/, "");

  const whole = cleaned.slice(0, dot).replace(/^0+(?=\d)/, "") || "0";
  const fraction = cleaned.slice(dot + 1).replace(/\./g, "").slice(0, 8);
  return `${whole}.${fraction}`;
}

export function convert(amount, fromPrice, toPrice) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (!fromPrice || !toPrice) return null;
  return (value * fromPrice) / toPrice;
}

export function formatInputAmount(value) {
  if (!Number.isFinite(value)) return "";
  return value.toFixed(8).replace(/\.?0+$/, "");
}

function useCompact(value) {
  return Math.abs(value) >= 1e12;
}

export function formatTokenAmount(value) {
  if (!Number.isFinite(value)) return "";
  const abs = Math.abs(value);
  if (useCompact(value)) {
    return value.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
  }
  const maximumFractionDigits = abs >= 1000 ? 4 : abs >= 1 ? 6 : 8;
  return value.toLocaleString("en-US", { maximumFractionDigits });
}

export function formatUsd(value) {
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

export function amountError(amount, balance, symbol) {
  if (amount.trim() === "" || amount === ".") return "Enter an amount.";
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) return "Enter an amount greater than 0.";
  if (value > balance) return `Amount exceeds your ${symbol} balance.`;
  return "";
}
